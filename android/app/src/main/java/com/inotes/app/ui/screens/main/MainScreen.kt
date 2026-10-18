package com.inotes.app.ui.screens.main

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Checklist
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.inotes.app.data.model.Note
import com.inotes.app.data.repository.NotesRepository
import com.inotes.app.ui.screens.checklists.ChecklistsScreen
import com.inotes.app.ui.screens.editor.NoteEditorScreen
import com.inotes.app.ui.screens.feed.NotesFeedScreen
import com.inotes.app.ui.screens.folders.FoldersScreen
import com.inotes.app.ui.theme.INotesTheme
import com.inotes.app.ui.theme.OchrePrimary
import com.inotes.app.ui.theme.ParchmentBorder
import com.inotes.app.ui.theme.ParchmentSurface

enum class TabItem {
    NOTES, CHECKLISTS, FOLDERS
}

@Composable
fun MainScreen(
    repository: NotesRepository,
    initialAction: String? = null
) {
    val notes by repository.notesFlow.collectAsState()
    val checklists by repository.checklistsFlow.collectAsState()
    val folders by repository.foldersFlow.collectAsState()

    var activeTab by remember { mutableStateOf(TabItem.NOTES) }
    var editingNote by remember { mutableStateOf<Note?>(null) }
    var isNewNoteMode by remember { mutableStateOf(false) }

    // Handle deep-link launch actions
    LaunchedEffect(initialAction) {
        when (initialAction) {
            "inotes.action.NEW_NOTE" -> {
                isNewNoteMode = true
            }
            "inotes.action.CHECKLIST" -> {
                activeTab = TabItem.CHECKLISTS
            }
        }
    }

    INotesTheme {
        if (editingNote != null || isNewNoteMode) {
            NoteEditorScreen(
                initialNote = editingNote,
                onSaveAndExit = { savedNote ->
                    repository.saveNote(savedNote)
                    editingNote = null
                    isNewNoteMode = false
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
                            selected = activeTab == TabItem.NOTES,
                            onClick = { activeTab = TabItem.NOTES },
                            icon = { Icon(Icons.Default.Description, contentDescription = "Notes", modifier = Modifier.size(20.dp)) },
                            label = { Text("Notes", fontSize = 11.sp) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = OchrePrimary,
                                selectedTextColor = OchrePrimary,
                                indicatorColor = Color(0xFFF6E8D8)
                            )
                        )
                        NavigationBarItem(
                            selected = activeTab == TabItem.CHECKLISTS,
                            onClick = { activeTab = TabItem.CHECKLISTS },
                            icon = { Icon(Icons.Default.Checklist, contentDescription = "Checklists", modifier = Modifier.size(20.dp)) },
                            label = { Text("Checklists", fontSize = 11.sp) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = OchrePrimary,
                                selectedTextColor = OchrePrimary,
                                indicatorColor = Color(0xFFF6E8D8)
                            )
                        )
                        NavigationBarItem(
                            selected = activeTab == TabItem.FOLDERS,
                            onClick = { activeTab = TabItem.FOLDERS },
                            icon = { Icon(Icons.Default.Folder, contentDescription = "Folders", modifier = Modifier.size(20.dp)) },
                            label = { Text("Vault", fontSize = 11.sp) },
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
                    TabItem.NOTES -> {
                        NotesFeedScreen(
                            notes = notes,
                            onNoteClick = { note -> editingNote = note },
                            onNewNoteClick = { isNewNoteMode = true },
                            onTogglePin = { note -> repository.togglePinNote(note) },
                            onDeleteNote = { note -> repository.deleteNotePermanently(note.id) },
                            modifier = Modifier.padding(innerPadding)
                        )
                    }
                    TabItem.CHECKLISTS -> {
                        ChecklistsScreen(
                            checklists = checklists,
                            onSaveChecklist = { cl -> repository.saveChecklist(cl) },
                            onDeleteChecklist = { cl -> repository.deleteChecklistPermanently(cl.id) },
                            modifier = Modifier.padding(innerPadding)
                        )
                    }
                    TabItem.FOLDERS -> {
                        FoldersScreen(
                            folders = folders,
                            notes = notes,
                            onSaveFolder = { f -> repository.saveFolder(f) },
                            onDeleteFolder = { f -> repository.deleteFolder(f.id) },
                            onExportVault = { repository.exportVault() },
                            modifier = Modifier.padding(innerPadding)
                        )
                    }
                }
            }
        }
    }
}
