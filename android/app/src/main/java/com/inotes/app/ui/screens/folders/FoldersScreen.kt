package com.inotes.app.ui.screens.folders

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.inotes.app.data.model.Folder
import com.inotes.app.data.model.Note
import com.inotes.app.ui.theme.*

@Composable
fun FoldersScreen(
    folders: List<Folder>,
    notes: List<Note>,
    onSaveFolder: (Folder) -> Unit,
    onDeleteFolder: (Folder) -> Unit,
    onExportVault: () -> String,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current
    var showCreateDialog by remember { mutableStateOf(false) }
    var newFolderName by remember { mutableStateOf("") }
    var showExportDialog by remember { mutableStateOf(false) }
    var exportedJson by remember { mutableStateOf("") }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(ParchmentBg)
            .padding(horizontal = 20.dp)
    ) {
        // Top Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(
                    text = "Folders & Vault",
                    style = MaterialTheme.typography.titleLarge
                )
                Text(
                    text = "TAXONOMY & ARCHIVE REPOSITORY",
                    style = MaterialTheme.typography.labelSmall
                )
            }
            FilledTonalButton(
                onClick = { showCreateDialog = true },
                colors = ButtonDefaults.filledTonalButtonColors(
                    containerColor = OchrePrimary,
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp),
                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("Folder", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 90.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Vault Statistics Card
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .border(1.dp, ParchmentBorder, RoundedCornerShape(16.dp)),
                    colors = CardDefaults.cardColors(containerColor = ParchmentSurface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Storage, contentDescription = null, tint = OchrePrimary, modifier = Modifier.size(20.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Pure Native SQLite Vault",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                            )
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            StatPill(label = "Total Notes", value = notes.size.toString())
                            StatPill(label = "Folders", value = folders.size.toString())
                            StatPill(label = "Vault Engine", value = "SQLite WAL")
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        Button(
                            onClick = {
                                exportedJson = onExportVault()
                                showExportDialog = true
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = OchreContainer, contentColor = OchreDark),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Export Vault Archive (JSON)", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        }
                    }
                }
            }

            // Folder items
            items(folders, key = { it.id }) { folder ->
                val count = notes.count { it.folderId == folder.id }
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .border(1.dp, ParchmentBorder, RoundedCornerShape(14.dp)),
                    colors = CardDefaults.cardColors(containerColor = ParchmentSurface)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(12.dp)
                                .clip(CircleShape)
                                .background(parseColorSafe(folder.color))
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = folder.name,
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold)
                            )
                            Text(
                                text = "$count reflections",
                                style = MaterialTheme.typography.labelSmall,
                                color = InkTertiary
                            )
                        }
                        IconButton(
                            onClick = { onDeleteFolder(folder) },
                            modifier = Modifier.size(24.dp)
                        ) {
                            Icon(Icons.Default.DeleteOutline, contentDescription = "Delete", tint = InkTertiary, modifier = Modifier.size(16.dp))
                        }
                    }
                }
            }
        }
    }

    // New Folder Dialog
    if (showCreateDialog) {
        AlertDialog(
            onDismissRequest = { showCreateDialog = false },
            title = { Text("New Archival Folder", fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold) },
            text = {
                OutlinedTextField(
                    value = newFolderName,
                    onValueChange = { newFolderName = it },
                    label = { Text("Folder Name") },
                    placeholder = { Text("e.g. Travelogue") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (newFolderName.isNotBlank()) {
                            val f = Folder(
                                id = "f-${System.currentTimeMillis()}",
                                name = newFolderName.trim(),
                                color = "#8D4B00",
                                displayOrder = folders.size
                            )
                            onSaveFolder(f)
                            newFolderName = ""
                            showCreateDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = OchrePrimary)
                ) {
                    Text("Create")
                }
            },
            dismissButton = {
                TextButton(onClick = { showCreateDialog = false }) {
                    Text("Cancel", color = InkSecondary)
                }
            },
            containerColor = ParchmentSurface
        )
    }

    // Export Dialog
    if (showExportDialog) {
        AlertDialog(
            onDismissRequest = { showExportDialog = false },
            title = { Text("Vault Export", fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text(
                        text = "Your entire vault has been serialized into archival JSON format. You can copy it to your clipboard.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = InkSecondary
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = exportedJson.take(300) + "...\n(Total length: ${exportedJson.length} bytes)",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 11.sp,
                        color = InkTertiary
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        clipboardManager.setText(AnnotatedString(exportedJson))
                        Toast.makeText(context, "Copied Vault JSON to clipboard!", Toast.LENGTH_SHORT).show()
                        showExportDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = OchrePrimary)
                ) {
                    Text("Copy JSON")
                }
            },
            dismissButton = {
                TextButton(onClick = { showExportDialog = false }) {
                    Text("Close", color = InkSecondary)
                }
            },
            containerColor = ParchmentSurface
        )
    }
}

@Composable
private fun StatPill(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = value, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = OchrePrimary))
        Text(text = label, style = MaterialTheme.typography.labelSmall, color = InkTertiary)
    }
}

private fun parseColorSafe(hex: String): Color {
    return try {
        Color(android.graphics.Color.parseColor(hex))
    } catch (_: Exception) {
        OchrePrimary
    }
}
