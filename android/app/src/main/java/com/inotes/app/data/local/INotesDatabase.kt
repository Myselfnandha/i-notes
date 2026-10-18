package com.inotes.app.data.local

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import com.inotes.app.data.model.Checklist
import com.inotes.app.data.model.ChecklistItem
import com.inotes.app.data.model.Folder
import com.inotes.app.data.model.Note
import org.json.JSONArray
import org.json.JSONObject

class INotesDatabase private constructor(context: Context) : SQLiteOpenHelper(
    context.applicationContext,
    DATABASE_NAME,
    null,
    DATABASE_VERSION
) {
    override fun onConfigure(db: SQLiteDatabase) {
        super.onConfigure(db)
        db.enableWriteAheadLogging()
    }

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(
            """
            CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                snippet TEXT NOT NULL,
                folder_id TEXT,
                tags TEXT NOT NULL,
                pinned INTEGER NOT NULL DEFAULT 0,
                archived INTEGER NOT NULL DEFAULT 0,
                trashed INTEGER NOT NULL DEFAULT 0,
                color_wash TEXT NOT NULL DEFAULT 'chamois',
                word_count INTEGER NOT NULL DEFAULT 0,
                reading_time INTEGER NOT NULL DEFAULT 1,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            )
            """.trimIndent()
        )

        db.execSQL(
            """
            CREATE TABLE IF NOT EXISTS checklists (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                category TEXT NOT NULL DEFAULT 'General',
                pinned INTEGER NOT NULL DEFAULT 0,
                archived INTEGER NOT NULL DEFAULT 0,
                trashed INTEGER NOT NULL DEFAULT 0,
                color_wash TEXT NOT NULL DEFAULT 'chamois',
                items_json TEXT NOT NULL DEFAULT '[]',
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            )
            """.trimIndent()
        )

        db.execSQL(
            """
            CREATE TABLE IF NOT EXISTS folders (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                color TEXT NOT NULL DEFAULT '#8D4B00',
                display_order INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL
            )
            """.trimIndent()
        )

        // Seed default pristine stationery folders
        val now = System.currentTimeMillis()
        val defaultFolders = listOf(
            Folder("f-journal", "Personal Journal", "#8D4B00", 0, now),
            Folder("f-work", "Work & Projects", "#3D5A80", 1, now),
            Folder("f-ideas", "Fleeting Ideas", "#2D6A4F", 2, now)
        )
        for (f in defaultFolders) {
            val cv = ContentValues().apply {
                put("id", f.id)
                put("name", f.name)
                put("color", f.color)
                put("display_order", f.displayOrder)
                put("created_at", f.createdAt)
            }
            db.insert("folders", null, cv)
        }

        // Seed welcome archival reflection note
        val welcomeNote = Note(
            id = "note-welcome",
            title = "Welcome to i Notes Archival",
            content = "This is your pure native archival stationery canvas. Crafted with unbleached parchment tones, deckled hairline accents, and instant capture directly from your home screen widget.\n\nEvery reflection is saved safely offline into your private local vault.",
            folderId = "f-journal",
            tags = listOf("archival", "stationery"),
            pinned = true,
            colorWash = "chamois",
            createdAt = now,
            updatedAt = now
        )
        insertNoteInternal(db, welcomeNote)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        // Migration logic for future database schema versions
    }

    // ==========================================
    // NOTES CRUD OPERATIONS
    // ==========================================

    fun getAllNotes(): List<Note> {
        val list = mutableListOf<Note>()
        val db = readableDatabase
        val cursor = db.rawQuery(
            "SELECT * FROM notes WHERE trashed = 0 ORDER BY pinned DESC, updated_at DESC",
            null
        )
        cursor.use {
            while (it.moveToNext()) {
                list.add(cursorToNote(it))
            }
        }
        return list
    }

    fun getArchivedNotes(): List<Note> {
        val list = mutableListOf<Note>()
        val db = readableDatabase
        val cursor = db.rawQuery(
            "SELECT * FROM notes WHERE archived = 1 AND trashed = 0 ORDER BY updated_at DESC",
            null
        )
        cursor.use {
            while (it.moveToNext()) {
                list.add(cursorToNote(it))
            }
        }
        return list
    }

    fun getTrashedNotes(): List<Note> {
        val list = mutableListOf<Note>()
        val db = readableDatabase
        val cursor = db.rawQuery(
            "SELECT * FROM notes WHERE trashed = 1 ORDER BY updated_at DESC",
            null
        )
        cursor.use {
            while (it.moveToNext()) {
                list.add(cursorToNote(it))
            }
        }
        return list
    }

    fun getNoteById(id: String): Note? {
        val db = readableDatabase
        val cursor = db.rawQuery("SELECT * FROM notes WHERE id = ?", arrayOf(id))
        cursor.use {
            if (it.moveToFirst()) {
                return cursorToNote(it)
            }
        }
        return null
    }

    fun upsertNote(note: Note) {
        val db = writableDatabase
        insertNoteInternal(db, note)
    }

    private fun insertNoteInternal(db: SQLiteDatabase, note: Note) {
        val cv = ContentValues().apply {
            put("id", note.id)
            put("title", note.title)
            put("content", note.content)
            put("snippet", note.snippet)
            put("folder_id", note.folderId)
            put("tags", JSONArray(note.tags).toString())
            put("pinned", if (note.pinned) 1 else 0)
            put("archived", if (note.archived) 1 else 0)
            put("trashed", if (note.trashed) 1 else 0)
            put("color_wash", note.colorWash)
            put("word_count", note.wordCount)
            put("reading_time", note.readingTime)
            put("created_at", note.createdAt)
            put("updated_at", note.updatedAt)
        }
        db.insertWithOnConflict("notes", null, cv, SQLiteDatabase.CONFLICT_REPLACE)
    }

    fun deleteNotePermanently(id: String) {
        writableDatabase.delete("notes", "id = ?", arrayOf(id))
    }

    // ==========================================
    // CHECKLISTS CRUD OPERATIONS
    // ==========================================

    fun getAllChecklists(): List<Checklist> {
        val list = mutableListOf<Checklist>()
        val db = readableDatabase
        val cursor = db.rawQuery(
            "SELECT * FROM checklists WHERE trashed = 0 ORDER BY pinned DESC, updated_at DESC",
            null
        )
        cursor.use {
            while (it.moveToNext()) {
                list.add(cursorToChecklist(it))
            }
        }
        return list
    }

    fun getChecklistById(id: String): Checklist? {
        val db = readableDatabase
        val cursor = db.rawQuery("SELECT * FROM checklists WHERE id = ?", arrayOf(id))
        cursor.use {
            if (it.moveToFirst()) {
                return cursorToChecklist(it)
            }
        }
        return null
    }

    fun upsertChecklist(cl: Checklist) {
        val itemsArray = JSONArray()
        for (item in cl.items) {
            val obj = JSONObject().apply {
                put("id", item.id)
                put("text", item.text)
                put("completed", item.completed)
                put("order", item.order)
            }
            itemsArray.put(obj)
        }

        val cv = ContentValues().apply {
            put("id", cl.id)
            put("title", cl.title)
            put("category", cl.category)
            put("pinned", if (cl.pinned) 1 else 0)
            put("archived", if (cl.archived) 1 else 0)
            put("trashed", if (cl.trashed) 1 else 0)
            put("color_wash", cl.colorWash)
            put("items_json", itemsArray.toString())
            put("created_at", cl.createdAt)
            put("updated_at", cl.updatedAt)
        }
        writableDatabase.insertWithOnConflict("checklists", null, cv, SQLiteDatabase.CONFLICT_REPLACE)
    }

    fun deleteChecklistPermanently(id: String) {
        writableDatabase.delete("checklists", "id = ?", arrayOf(id))
    }

    // ==========================================
    // FOLDERS CRUD OPERATIONS
    // ==========================================

    fun getAllFolders(): List<Folder> {
        val list = mutableListOf<Folder>()
        val db = readableDatabase
        val cursor = db.rawQuery("SELECT * FROM folders ORDER BY display_order ASC", null)
        cursor.use {
            while (it.moveToNext()) {
                list.add(
                    Folder(
                        id = it.getString(it.getColumnIndexOrThrow("id")),
                        name = it.getString(it.getColumnIndexOrThrow("name")),
                        color = it.getString(it.getColumnIndexOrThrow("color")),
                        displayOrder = it.getInt(it.getColumnIndexOrThrow("display_order")),
                        createdAt = it.getLong(it.getColumnIndexOrThrow("created_at"))
                    )
                )
            }
        }
        return list
    }

    fun upsertFolder(f: Folder) {
        val cv = ContentValues().apply {
            put("id", f.id)
            put("name", f.name)
            put("color", f.color)
            put("display_order", f.displayOrder)
            put("created_at", f.createdAt)
        }
        writableDatabase.insertWithOnConflict("folders", null, cv, SQLiteDatabase.CONFLICT_REPLACE)
    }

    fun deleteFolder(id: String) {
        writableDatabase.delete("folders", "id = ?", arrayOf(id))
    }

    // ==========================================
    // VAULT EXPORT / IMPORT
    // ==========================================

    fun exportVaultJson(): String {
        val root = JSONObject()
        root.put("app", "i Notes Pure Native Archival")
        root.put("version", "2.0.0")
        root.put("exported_at", System.currentTimeMillis())

        val notesArray = JSONArray()
        for (n in getAllNotes()) {
            val obj = JSONObject().apply {
                put("id", n.id)
                put("title", n.title)
                put("content", n.content)
                put("folder_id", n.folderId)
                put("pinned", n.pinned)
                put("color_wash", n.colorWash)
                put("created_at", n.createdAt)
                put("updated_at", n.updatedAt)
            }
            notesArray.put(obj)
        }
        root.put("notes", notesArray)
        return root.toString(2)
    }

    // ==========================================
    // CURSOR CONVERTERS
    // ==========================================

    private fun cursorToNote(cursor: android.database.Cursor): Note {
        val tagsJson = cursor.getString(cursor.getColumnIndexOrThrow("tags"))
        val tagsList = mutableListOf<String>()
        try {
            val arr = JSONArray(tagsJson)
            for (i in 0 until arr.length()) {
                tagsList.add(arr.getString(i))
            }
        } catch (_: Exception) {}

        return Note(
            id = cursor.getString(cursor.getColumnIndexOrThrow("id")),
            title = cursor.getString(cursor.getColumnIndexOrThrow("title")),
            content = cursor.getString(cursor.getColumnIndexOrThrow("content")),
            snippet = cursor.getString(cursor.getColumnIndexOrThrow("snippet")),
            folderId = cursor.getString(cursor.getColumnIndexOrThrow("folder_id")),
            tags = tagsList,
            pinned = cursor.getInt(cursor.getColumnIndexOrThrow("pinned")) == 1,
            archived = cursor.getInt(cursor.getColumnIndexOrThrow("archived")) == 1,
            trashed = cursor.getInt(cursor.getColumnIndexOrThrow("trashed")) == 1,
            colorWash = cursor.getString(cursor.getColumnIndexOrThrow("color_wash")),
            wordCount = cursor.getInt(cursor.getColumnIndexOrThrow("word_count")),
            readingTime = cursor.getInt(cursor.getColumnIndexOrThrow("reading_time")),
            createdAt = cursor.getLong(cursor.getColumnIndexOrThrow("created_at")),
            updatedAt = cursor.getLong(cursor.getColumnIndexOrThrow("updated_at"))
        )
    }

    private fun cursorToChecklist(cursor: android.database.Cursor): Checklist {
        val itemsJson = cursor.getString(cursor.getColumnIndexOrThrow("items_json"))
        val itemsList = mutableListOf<ChecklistItem>()
        try {
            val arr = JSONArray(itemsJson)
            for (i in 0 until arr.length()) {
                val obj = arr.getJSONObject(i)
                itemsList.add(
                    ChecklistItem(
                        id = obj.optString("id", "item-$i"),
                        text = obj.optString("text", ""),
                        completed = obj.optBoolean("completed", false),
                        order = obj.optInt("order", i)
                    )
                )
            }
        } catch (_: Exception) {}

        return Checklist(
            id = cursor.getString(cursor.getColumnIndexOrThrow("id")),
            title = cursor.getString(cursor.getColumnIndexOrThrow("title")),
            category = cursor.getString(cursor.getColumnIndexOrThrow("category")),
            pinned = cursor.getInt(cursor.getColumnIndexOrThrow("pinned")) == 1,
            archived = cursor.getInt(cursor.getColumnIndexOrThrow("archived")) == 1,
            trashed = cursor.getInt(cursor.getColumnIndexOrThrow("trashed")) == 1,
            colorWash = cursor.getString(cursor.getColumnIndexOrThrow("color_wash")),
            items = itemsList,
            createdAt = cursor.getLong(cursor.getColumnIndexOrThrow("created_at")),
            updatedAt = cursor.getLong(cursor.getColumnIndexOrThrow("updated_at"))
        )
    }

    companion object {
        const val DATABASE_NAME = "inotes_vault.db"
        const val DATABASE_VERSION = 1

        @Volatile
        private var INSTANCE: INotesDatabase? = null

        fun getInstance(context: Context): INotesDatabase {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: INotesDatabase(context).also { INSTANCE = it }
            }
        }
    }
}
