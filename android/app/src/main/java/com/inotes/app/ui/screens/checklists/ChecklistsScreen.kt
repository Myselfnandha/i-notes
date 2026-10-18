package com.inotes.app.ui.screens.checklists

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Checklist
import androidx.compose.material.icons.filled.DeleteOutline
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.inotes.app.data.model.Checklist
import com.inotes.app.data.model.ChecklistItem
import com.inotes.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChecklistsScreen(
    checklists: List<Checklist>,
    onSaveChecklist: (Checklist) -> Unit,
    onDeleteChecklist: (Checklist) -> Unit,
    modifier: Modifier = Modifier
) {
    var showCreateDialog by remember { mutableStateOf(false) }
    var newChecklistTitle by remember { mutableStateOf("") }
    var newChecklistCategory by remember { mutableStateOf("Personal") }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(ParchmentBg)
    ) {
        // Top Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(
                    text = "Checklists & Tasks",
                    style = MaterialTheme.typography.titleLarge
                )
                Text(
                    text = "ACTIONABLE ARCHIVES",
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
                Text("New List", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }

        if (checklists.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.Checklist,
                        contentDescription = null,
                        tint = OchreLight,
                        modifier = Modifier.size(54.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "No Active Checklists",
                        style = MaterialTheme.typography.titleMedium,
                        color = InkPrimary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Create structured task lists with actionable items.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = InkSecondary
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(start = 18.dp, end = 18.dp, top = 8.dp, bottom = 90.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(checklists, key = { it.id }) { cl ->
                    ChecklistCard(
                        checklist = cl,
                        onUpdate = onSaveChecklist,
                        onDelete = { onDeleteChecklist(cl) }
                    )
                }
            }
        }
    }

    // New Checklist Dialog
    if (showCreateDialog) {
        AlertDialog(
            onDismissRequest = { showCreateDialog = false },
            title = { Text("New Checklist", fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = newChecklistTitle,
                        onValueChange = { newChecklistTitle = it },
                        label = { Text("Checklist Title") },
                        placeholder = { Text("e.g. Weekly Writing Goals") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = newChecklistCategory,
                        onValueChange = { newChecklistCategory = it },
                        label = { Text("Category") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (newChecklistTitle.isNotBlank()) {
                            val now = System.currentTimeMillis()
                            val cl = Checklist(
                                id = "cl-$now",
                                title = newChecklistTitle.trim(),
                                category = newChecklistCategory.trim().ifBlank { "General" },
                                createdAt = now,
                                updatedAt = now
                            )
                            onSaveChecklist(cl)
                            newChecklistTitle = ""
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
}

@Composable
fun ChecklistCard(
    checklist: Checklist,
    onUpdate: (Checklist) -> Unit,
    onDelete: () -> Unit
) {
    var newItemText by remember { mutableStateOf("") }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .border(1.dp, ParchmentBorder, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = ParchmentSurface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = checklist.title,
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontFamily = FontFamily.Serif,
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        ),
                        color = InkPrimary
                    )
                    Text(
                        text = "${checklist.category.uppercase()} · ${checklist.completedCount} of ${checklist.totalCount} completed",
                        style = MaterialTheme.typography.labelSmall,
                        color = InkTertiary
                    )
                }
                IconButton(onClick = onDelete, modifier = Modifier.size(20.dp)) {
                    Icon(
                        Icons.Default.DeleteOutline,
                        contentDescription = "Delete List",
                        tint = InkTertiary,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            // Linear Progress Bar
            if (checklist.totalCount > 0) {
                Spacer(modifier = Modifier.height(8.dp))
                LinearProgressIndicator(
                    progress = checklist.progress,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(4.dp)
                        .clip(RoundedCornerShape(2.dp)),
                    color = OchrePrimary,
                    trackColor = ParchmentDivider
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Task Items
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                for (item in checklist.items) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = item.completed,
                            onCheckedChange = { isChecked ->
                                val updatedItems = checklist.items.map {
                                    if (it.id == item.id) it.copy(completed = isChecked) else it
                                }
                                onUpdate(checklist.copy(items = updatedItems, updatedAt = System.currentTimeMillis()))
                            },
                            colors = CheckboxDefaults.colors(
                                checkedColor = OchrePrimary,
                                uncheckedColor = InkTertiary
                            )
                        )
                        Text(
                            text = item.text,
                            style = MaterialTheme.typography.bodyMedium.copy(
                                textDecoration = if (item.completed) TextDecoration.LineThrough else TextDecoration.None,
                                color = if (item.completed) InkTertiary else InkPrimary
                            ),
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }

            // In-line Add Item Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = newItemText,
                    onValueChange = { newItemText = it },
                    placeholder = { Text("Add task item...", fontSize = 12.sp, color = InkTertiary) },
                    singleLine = true,
                    shape = RoundedCornerShape(10.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = ParchmentBg,
                        unfocusedContainerColor = ParchmentBg,
                        focusedBorderColor = OchrePrimary,
                        unfocusedBorderColor = ParchmentBorder
                    ),
                    modifier = Modifier.weight(1f)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Button(
                    onClick = {
                        if (newItemText.isNotBlank()) {
                            val newItem = ChecklistItem(
                                id = "item-${System.currentTimeMillis()}",
                                text = newItemText.trim(),
                                completed = false,
                                order = checklist.items.size
                            )
                            val updatedItems = checklist.items + newItem
                            onUpdate(checklist.copy(items = updatedItems, updatedAt = System.currentTimeMillis()))
                            newItemText = ""
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = OchrePrimary),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text("Add", fontSize = 12.sp)
                }
            }
        }
    }
}
