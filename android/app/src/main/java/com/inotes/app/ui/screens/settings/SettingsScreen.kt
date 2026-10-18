package com.inotes.app.ui.screens.settings

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.inotes.app.data.model.Note
import com.inotes.app.data.sync.HuggingFaceSyncManager
import com.inotes.app.data.sync.SyncState
import com.inotes.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun SettingsScreen(
    notes: List<Note>,
    syncManager: HuggingFaceSyncManager,
    onExportVault: () -> String,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current
    val scope = rememberCoroutineScope()
    val syncState by syncManager.syncState.collectAsState()

    var hfToken by remember { mutableStateOf(syncManager.getHfToken()) }
    var repoId by remember { mutableStateOf(syncManager.getRepoId()) }
    var isTokenVisible by remember { mutableStateOf(false) }

    var showExportDialog by remember { mutableStateOf(false) }
    var exportedJson by remember { mutableStateOf("") }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(ParchmentBg)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp, vertical = 16.dp)
            .padding(bottom = 90.dp)
    ) {
        // Header
        Text(
            text = "Vault & Cloud Sync",
            style = MaterialTheme.typography.titleLarge
        )
        Text(
            text = "HUGGING FACE CROSS-DEVICE SYNC",
            style = MaterialTheme.typography.labelSmall
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Hugging Face Cloud Sync Card
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
                    Icon(Icons.Default.CloudSync, contentDescription = null, tint = OchrePrimary, modifier = Modifier.size(22.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Hugging Face Cloud Sync",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Sync reflections across devices via your private Hugging Face cloud vault repository.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = InkSecondary,
                    fontSize = 12.sp
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Repo ID Field
                OutlinedTextField(
                    value = repoId,
                    onValueChange = {
                        repoId = it
                        syncManager.setRepoId(it)
                    },
                    label = { Text("Hugging Face Repository", fontSize = 12.sp) },
                    placeholder = { Text("username/repo-name") },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = ParchmentBg,
                        unfocusedContainerColor = ParchmentBg,
                        focusedBorderColor = OchrePrimary,
                        unfocusedBorderColor = ParchmentBorder
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Access Token Field
                OutlinedTextField(
                    value = hfToken,
                    onValueChange = {
                        hfToken = it
                        syncManager.setHfToken(it)
                    },
                    label = { Text("Hugging Face Access Token (hf_...)", fontSize = 12.sp) },
                    placeholder = { Text("Enter token with write access") },
                    singleLine = true,
                    visualTransformation = if (isTokenVisible) VisualTransformation.None else PasswordVisualTransformation(),
                    trailingIcon = {
                        IconButton(onClick = { isTokenVisible = !isTokenVisible }) {
                            Icon(
                                if (isTokenVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                contentDescription = "Toggle token visibility",
                                tint = InkTertiary,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    },
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = ParchmentBg,
                        unfocusedContainerColor = ParchmentBg,
                        focusedBorderColor = OchrePrimary,
                        unfocusedBorderColor = ParchmentBorder
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Sync Status Banner
                when (val state = syncState) {
                    is SyncState.Syncing -> {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            CircularProgressIndicator(modifier = Modifier.size(16.dp), color = OchrePrimary, strokeWidth = 2.dp)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Syncing with Hugging Face...", fontSize = 12.sp, color = OchrePrimary)
                        }
                    }
                    is SyncState.Success -> {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Color(0xFF2D6A4F), modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(state.message, fontSize = 12.sp, color = Color(0xFF2D6A4F))
                        }
                    }
                    is SyncState.Error -> {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.ErrorOutline, contentDescription = null, tint = Color(0xFFC1121F), modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(state.error, fontSize = 12.sp, color = Color(0xFFC1121F))
                        }
                    }
                    is SyncState.Idle -> {
                        Text("Ready to sync", fontSize = 12.sp, color = InkTertiary)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Sync Now Button
                Button(
                    onClick = {
                        scope.launch {
                            syncManager.performSync()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = OchrePrimary),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.Sync, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Sync Now with Cloud", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Local Vault Backup & Stats
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
                        text = "Local Vault Archive",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("Total Reflections", style = MaterialTheme.typography.labelSmall, color = InkTertiary)
                        Text("${notes.size} notes", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = OchrePrimary))
                    }
                    Column {
                        Text("Database Engine", style = MaterialTheme.typography.labelSmall, color = InkTertiary)
                        Text("SQLite WAL", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = OchrePrimary))
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                Button(
                    onClick = {
                        exportedJson = onExportVault()
                        showExportDialog = true
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = OchreContainer, contentColor = OchreDark),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Export Vault Backup (JSON)", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        }
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
                        text = exportedJson.take(300) + "...\n(Total: ${exportedJson.length} bytes)",
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
