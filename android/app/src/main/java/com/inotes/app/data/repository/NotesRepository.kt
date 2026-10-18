package com.inotes.app.data.repository

import android.content.Context
import com.inotes.app.INotesWidgetProvider
import com.inotes.app.data.local.INotesDatabase
import com.inotes.app.data.model.Checklist
import com.inotes.app.data.model.Folder
import com.inotes.app.data.model.Note
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class NotesRepository private constructor(private val context: Context) {

    private val db = INotesDatabase.getInstance(context)
    private val scope = CoroutineScope(Dispatchers.IO)

    private val _notesFlow = MutableStateFlow<List<Note>>(emptyList())
    val notesFlow: StateFlow<List<Note>> = _notesFlow.asStateFlow()

    private val _checklistsFlow = MutableStateFlow<List<Checklist>>(emptyList())
    val checklistsFlow: StateFlow<List<Checklist>> = _checklistsFlow.asStateFlow()

    private val _foldersFlow = MutableStateFlow<List<Folder>>(emptyList())
    val foldersFlow: StateFlow<List<Folder>> = _foldersFlow.asStateFlow()

    init {
        refreshAll()
    }

    fun refreshAll() {
        scope.launch {
            _notesFlow.value = db.getAllNotes()
            _checklistsFlow.value = db.getAllChecklists()
            _foldersFlow.value = db.getAllFolders()
        }
    }

    // ================== Notes ==================

    fun getNote(id: String): Note? {
        return db.getNoteById(id)
    }

    fun saveNote(note: Note) {
        scope.launch {
            db.upsertNote(note)
            _notesFlow.value = db.getAllNotes()

            // Update shared vault preferences for home screen widget
            val prefs = context.getSharedPreferences(INotesWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE)
            prefs.edit()
                .putString(INotesWidgetProvider.KEY_LATEST_NOTE_TITLE, note.title.ifBlank { "Latest Reflection" })
                .putString(INotesWidgetProvider.KEY_LATEST_NOTE_SNIPPET, note.content)
                .apply()

            // Refresh home screen widget
            INotesWidgetProvider.updateAllWidgets(context)
        }
    }

    fun togglePinNote(note: Note) {
        saveNote(note.copy(pinned = !note.pinned, updatedAt = System.currentTimeMillis()))
    }

    fun toggleArchiveNote(note: Note) {
        saveNote(note.copy(archived = !note.archived, updatedAt = System.currentTimeMillis()))
    }

    fun trashNote(note: Note) {
        saveNote(note.copy(trashed = true, updatedAt = System.currentTimeMillis()))
    }

    fun deleteNotePermanently(id: String) {
        scope.launch {
            db.deleteNotePermanently(id)
            _notesFlow.value = db.getAllNotes()
        }
    }

    // ================== Checklists ==================

    fun saveChecklist(checklist: Checklist) {
        scope.launch {
            db.upsertChecklist(checklist)
            _checklistsFlow.value = db.getAllChecklists()
        }
    }

    fun togglePinChecklist(checklist: Checklist) {
        saveChecklist(checklist.copy(pinned = !checklist.pinned, updatedAt = System.currentTimeMillis()))
    }

    fun deleteChecklistPermanently(id: String) {
        scope.launch {
            db.deleteChecklistPermanently(id)
            _checklistsFlow.value = db.getAllChecklists()
        }
    }

    // ================== Folders ==================

    fun saveFolder(folder: Folder) {
        scope.launch {
            db.upsertFolder(folder)
            _foldersFlow.value = db.getAllFolders()
        }
    }

    fun deleteFolder(id: String) {
        scope.launch {
            db.deleteFolder(id)
            _foldersFlow.value = db.getAllFolders()
        }
    }

    // ================== Vault Backup ==================

    fun exportVault(): String {
        return db.exportVaultJson()
    }

    companion object {
        @Volatile
        private var INSTANCE: NotesRepository? = null

        fun getInstance(context: Context): NotesRepository {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: NotesRepository(context.applicationContext).also { INSTANCE = it }
            }
        }
    }
}
