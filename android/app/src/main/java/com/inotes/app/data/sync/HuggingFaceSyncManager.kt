package com.inotes.app.data.sync

import android.content.Context
import android.util.Base64
import com.inotes.app.data.local.INotesDatabase
import com.inotes.app.data.model.Note
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.*

sealed class SyncState {
    object Idle : SyncState()
    object Syncing : SyncState()
    data class Success(val message: String, val timestamp: Long) : SyncState()
    data class Error(val error: String) : SyncState()
}

class HuggingFaceSyncManager private constructor(private val context: Context) {

    private val prefs = context.getSharedPreferences("inotes_sync_prefs", Context.MODE_PRIVATE)
    private val db = INotesDatabase.getInstance(context)

    private val _syncState = MutableStateFlow<SyncState>(SyncState.Idle)
    val syncState: StateFlow<SyncState> = _syncState.asStateFlow()

    fun getHfToken(): String {
        return prefs.getString("hf_token", "") ?: ""
    }

    fun setHfToken(token: String) {
        prefs.edit().putString("hf_token", token.trim()).apply()
    }

    fun getRepoId(): String {
        return prefs.getString("hf_repo_id", DEFAULT_REPO_ID) ?: DEFAULT_REPO_ID
    }

    fun setRepoId(repoId: String) {
        prefs.edit().putString("hf_repo_id", repoId.trim()).apply()
    }

    suspend fun performSync(): Result<String> = withContext(Dispatchers.IO) {
        val token = getHfToken()
        val repoId = getRepoId()

        if (token.isBlank()) {
            val err = "Hugging Face Access Token not configured in Settings"
            _syncState.value = SyncState.Error(err)
            return@withContext Result.failure(Exception(err))
        }

        _syncState.value = SyncState.Syncing

        try {
            // 1. Fetch remote vault.json from Hugging Face
            val remoteNotes = fetchRemoteVault(token, repoId)

            // 2. Merge remote notes into local SQLite vault (latest timestamp wins)
            val localNotes = db.getAllNotes().associateBy { it.id }.toMutableMap()

            for (rNote in remoteNotes) {
                val existing = localNotes[rNote.id]
                if (existing == null || rNote.updatedAt > existing.updatedAt) {
                    db.upsertNote(rNote)
                    localNotes[rNote.id] = rNote
                }
            }

            // 3. Serialize all merged notes and commit back to Hugging Face
            val allMerged = localNotes.values.toList()
            val vaultJson = serializeVault(allMerged)

            commitVaultToHf(token, repoId, vaultJson)

            val now = System.currentTimeMillis()
            val timeStr = SimpleDateFormat("h:mm a", Locale.getDefault()).format(Date(now))
            val msg = "Synced with $repoId at $timeStr (${allMerged.size} notes)"

            _syncState.value = SyncState.Success(msg, now)
            Result.success(msg)

        } catch (e: Exception) {
            e.printStackTrace()
            val err = "Sync failed: ${e.message}"
            _syncState.value = SyncState.Error(err)
            Result.failure(e)
        }
    }

    private fun fetchRemoteVault(token: String, repoId: String): List<Note> {
        val notes = mutableListOf<Note>()
        try {
            val url = URL("https://huggingface.co/datasets/$repoId/raw/main/vault.json")
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "GET"
            conn.setRequestProperty("Authorization", "Bearer $token")
            conn.connectTimeout = 8000
            conn.readTimeout = 8000

            val code = conn.responseCode
            if (code == 200) {
                val reader = BufferedReader(InputStreamReader(conn.inputStream))
                val jsonStr = reader.readText()
                reader.close()

                val root = JSONObject(jsonStr)
                val arr = root.optJSONArray("notes") ?: JSONArray()
                for (i in 0 until arr.length()) {
                    val obj = arr.getJSONObject(i)
                    notes.add(
                        Note(
                            id = obj.getString("id"),
                            title = obj.optString("title", ""),
                            content = obj.optString("content", ""),
                            snippet = obj.optString("snippet", ""),
                            folderId = obj.optString("folder_id", null),
                            pinned = obj.optBoolean("pinned", false),
                            colorWash = obj.optString("color_wash", "chamois"),
                            createdAt = obj.optLong("created_at", System.currentTimeMillis()),
                            updatedAt = obj.optLong("updated_at", System.currentTimeMillis())
                        )
                    )
                }
            }
            conn.disconnect()
        } catch (_: Exception) {
            // New repository or empty vault
        }
        return notes
    }

    private fun commitVaultToHf(token: String, repoId: String, vaultJson: String) {
        val url = URL("https://huggingface.co/api/datasets/$repoId/commit/main")
        val conn = url.openConnection() as HttpURLConnection
        conn.requestMethod = "POST"
        conn.setRequestProperty("Authorization", "Bearer $token")
        conn.setRequestProperty("Content-Type", "application/json")
        conn.connectTimeout = 12000
        conn.readTimeout = 12000
        conn.doOutput = true

        val b64 = Base64.encodeToString(vaultJson.toByteArray(Charsets.UTF_8), Base64.NO_WRAP)
        val payload = JSONObject().apply {
            put("summary", "Sync notes vault from i Notes Android")
            val operations = JSONArray().apply {
                val op = JSONObject().apply {
                    put("key", "file")
                    val fileObj = JSONObject().apply {
                        put("path", "vault.json")
                        put("content", b64)
                        put("encoding", "base64")
                    }
                    put("value", fileObj)
                }
                put(op)
            }
            put("operations", operations)
        }

        val outBytes = payload.toString().toByteArray(Charsets.UTF_8)
        val os: OutputStream = conn.outputStream
        os.write(outBytes)
        os.flush()
        os.close()

        val code = conn.responseCode
        if (code !in 200..299) {
            val errReader = BufferedReader(InputStreamReader(conn.errorStream ?: conn.inputStream))
            val errBody = errReader.readText()
            errReader.close()
            conn.disconnect()
            throw Exception("HTTP $code: $errBody")
        }
        conn.disconnect()
    }

    private fun serializeVault(notes: List<Note>): String {
        val root = JSONObject()
        root.put("app", "i Notes Pure Native Archival")
        root.put("version", "2.0.0")
        root.put("updated_at", System.currentTimeMillis())

        val arr = JSONArray()
        for (n in notes) {
            val obj = JSONObject().apply {
                put("id", n.id)
                put("title", n.title)
                put("content", n.content)
                put("snippet", n.snippet)
                put("folder_id", n.folderId)
                put("pinned", n.pinned)
                put("color_wash", n.colorWash)
                put("created_at", n.createdAt)
                put("updated_at", n.updatedAt)
            }
            arr.put(obj)
        }
        root.put("notes", arr)
        return root.toString(2)
    }

    companion object {
        const val DEFAULT_REPO_ID = "nandhaalagesan248/inotes-vault"

        @Volatile
        private var INSTANCE: HuggingFaceSyncManager? = null

        fun getInstance(context: Context): HuggingFaceSyncManager {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: HuggingFaceSyncManager(context.applicationContext).also { INSTANCE = it }
            }
        }
    }
}
