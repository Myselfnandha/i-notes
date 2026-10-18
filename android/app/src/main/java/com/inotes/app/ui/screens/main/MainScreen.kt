package com.inotes.app.ui.screens.main

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CloudSync
import androidx.compose.material.icons.filled.Description
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.inotes.app.data.model.Note
import com.inotes.app.data.repository.NotesRepository
import com.inotes.app.data.sync.HuggingFaceSyncManager
import com.inotes.app.ui.screens.editor.NoteEditorScreen
import com.inotes.app.ui.screens.feed.NotesFeedScreen
import com.inotes.app.ui.screens.settings.SettingsScreen
import com.inotes.app.ui.theme.INotesTheme
import com.inotes.app.ui.theme.OchrePrimary
import com.inotes.app.ui.theme.ParchmentSurface
import kotlinx.coroutines.launch

enum class MainTab {
    NOTES, SETTINGS
}

@Composable
fun MainScreen(
    repository: NotesRepository,
    initialAction: String? = null
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val syncManager = remember { HuggingFaceSyncManager.getInstance(context) }

    val notes by repository.notesFlow.collectAsState()
    var activeTab by remember { mutableStateOf(MainTab.NOTES) }
    var editingNote by remember { mutableStateOf<Note?>(null) }
    var isNewNoteMode by remember { mutableStateOf(false) }

    // Handle initial launch action from Home Screen Widget
    LaunchedEffect(initialAction) {
        if (initialAction == "inotes.action.NEW_NOTE") {
            isNewNoteMode = true
        }
        // Auto sync if token configured
        if (syncManager.getHfToken().isNotBlank()) {
            scope.launch {
                syncManager.performSync()
            }
        }
    }

    INotesTheme {
        if (editingNote != null || isNewNoteMode) {
            NoteEditorScreen(
                initialNote = editingNote,
                onSaveNote = { savedNote ->
                    repository.saveNote(savedNote)
                },
                onBack = {
                    editingNote = null
                    isNewNoteMode = false
                }
            )
        } else {
            Scaffold(
                bottomBar = {
                    NavigationBar(
                        containerColor = ParchmentSurface,
                        tonalElevation = 6.dp
                    ) {
                        NavigationBarItem(
                            selected = activeTab == MainTab.NOTES,
                            onClick = { activeTab = MainTab.NOTES },
                            icon = { Icon(Icons.Default.Description, contentDescription = "Notes", modifier = Modifier.size(20.dp)) },
                            label = { Text("Reflections", fontSize = 11.sp) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = OchrePrimary,
                                selectedTextColor = OchrePrimary,
                                indicatorColor = Color(0xFFF6E8D8)
                            )
                        )
                        NavigationBarItem(
                            selected = activeTab == MainTab.SETTINGS,
                            onClick = { activeTab = MainTab.SETTINGS },
                            icon = { Icon(Icons.Default.CloudSync, contentDescription = "Sync & Backup", modifier = Modifier.size(20.dp)) },
                            label = { Text("Cloud Sync", fontSize = 11.sp) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = OchrePrimary,
                                selectedTextColor = OchrePrimary,
                                indicatorColor = Color(0xFFF6E8D8)
                            )
                        )
                    }
                }
            ) { innerPadding ->
                when (activeTab) {
                    MainTab.NOTES -> {
                        NotesFeedScreen(
                            notes = notes,
                            onNoteClick = { note -> editingNote = note },
                            onNewNoteClick = { isNewNoteMode = true },
                            onTogglePin = { note -> repository.togglePinNote(note) },
                            onDeleteNote = { note -> repository.deleteNotePermanently(note.id) },
                            onOpenSync = { activeTab = MainTab.SETTINGS },
                            modifier = Modifier.padding(innerPadding)
                        )
                    }
                    MainTab.SETTINGS -> {
                        SettingsScreen(
                            notes = notes,
                            syncManager = syncManager,
                            onExportVault = { repository.exportVault() },
                            modifier = Modifier.padding(innerPadding)
                        )
                    }
                }
            }
        }
    }
}
