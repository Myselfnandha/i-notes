package com.inotes.app.ui.screens.feed

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.inotes.app.data.model.Note
import com.inotes.app.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotesFeedScreen(
    notes: List<Note>,
    onNoteClick: (Note) -> Unit,
    onNewNoteClick: () -> Unit,
    onTogglePin: (Note) -> Unit,
    onDeleteNote: (Note) -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedTag by remember { mutableStateOf<String?>(null) }

    val allTags = remember(notes) {
        notes.flatMap { it.tags }.distinct()
    }

    val filteredNotes = remember(notes, searchQuery, selectedTag) {
        notes.filter { note ->
            !note.archived && !note.trashed &&
            (searchQuery.isBlank() || note.title.contains(searchQuery, ignoreCase = true) || note.content.contains(searchQuery, ignoreCase = true)) &&
            (selectedTag == null || note.tags.contains(selectedTag))
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(ParchmentBg)
    ) {
        // Top Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(34.dp)
                    .clip(CircleShape)
                    .background(OchrePrimary),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "i",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "i Notes",
                    style = MaterialTheme.typography.titleLarge
                )
                Text(
                    text = "ARCHIVAL SYSTEM · PURE NATIVE",
                    style = MaterialTheme.typography.labelSmall
                )
            }
            FilledTonalButton(
                onClick = onNewNoteClick,
                colors = ButtonDefaults.filledTonalButtonColors(
                    containerColor = OchrePrimary,
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp),
                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text(text = "Note", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search vault reflections...", fontSize = 13.sp, color = InkTertiary) },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = InkSecondary, modifier = Modifier.size(18.dp)) },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { searchQuery = "" }) {
                        Icon(Icons.Default.Clear, contentDescription = "Clear", tint = InkSecondary, modifier = Modifier.size(16.dp))
                    }
                }
            },
            singleLine = true,
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White,
                focusedBorderColor = OchrePrimary,
                unfocusedBorderColor = ParchmentBorder
            ),
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 18.dp, vertical = 4.dp)
        )

        // Tag Filter Chips
        if (allTags.isNotEmpty()) {
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 18.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                item {
                    FilterChip(
                        selected = selectedTag == null,
                        onClick = { selectedTag = null },
                        label = { Text("All Notes", fontSize = 11.sp) }
                    )
                }
                items(allTags) { tag ->
                    FilterChip(
                        selected = selectedTag == tag,
                        onClick = { selectedTag = if (selectedTag == tag) null else tag },
                        label = { Text("#$tag", fontSize = 11.sp) }
                    )
                }
            }
        }

        // Notes List
        if (filteredNotes.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.EditNote,
                        contentDescription = null,
                        tint = OchreLight,
                        modifier = Modifier.size(54.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Your Vault is Pristine",
                        style = MaterialTheme.typography.titleMedium,
                        color = InkPrimary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Tap '+ Note' above or the Home Screen Widget to capture your first reflection.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = InkSecondary,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(start = 18.dp, end = 18.dp, top = 8.dp, bottom = 90.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(filteredNotes, key = { it.id }) { note ->
                    NoteCard(
                        note = note,
                        onClick = { onNoteClick(note) },
                        onTogglePin = { onTogglePin(note) },
                        onDelete = { onDeleteNote(note) }
                    )
                }
            }
        }
    }
}

@Composable
fun NoteCard(
    note: Note,
    onClick: () -> Unit,
    onTogglePin: () -> Unit,
    onDelete: () -> Unit
) {
    val washColor = getPaperWashColor(note.colorWash)
    val dateFormat = remember { SimpleDateFormat("MMM d, yyyy", Locale.getDefault()) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .border(1.dp, ParchmentBorder, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = washColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = note.title.ifBlank { "Untitled Note" },
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    ),
                    color = InkPrimary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )
                if (note.pinned) {
                    Icon(
                        Icons.Default.PushPin,
                        contentDescription = "Pinned",
                        tint = OchrePrimary,
                        modifier = Modifier
                            .size(16.dp)
                            .clickable(onClick = onTogglePin)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                }
                IconButton(
                    onClick = onDelete,
                    modifier = Modifier.size(20.dp)
                ) {
                    Icon(
                        Icons.Default.DeleteOutline,
                        contentDescription = "Delete",
                        tint = InkTertiary,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            if (note.content.isNotBlank()) {
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = note.snippet,
                    style = MaterialTheme.typography.bodyMedium,
                    color = InkSecondary,
                    maxLines = 3,
                    overflow = TextOverflow.Ellipsis
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Footer meta: tags, reading time & date
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = dateFormat.format(Date(note.updatedAt)),
                    style = MaterialTheme.typography.labelSmall,
                    color = InkTertiary
                )
                Text(
                    text = " · ${note.readingTime} min read",
                    style = MaterialTheme.typography.labelSmall,
                    color = InkTertiary
                )
                Spacer(modifier = Modifier.weight(1f))
                for (tag in note.tags.take(2)) {
                    Text(
                        text = "#$tag",
                        style = MaterialTheme.typography.labelSmall,
                        color = OchrePrimary,
                        modifier = Modifier.padding(start = 4.dp)
                    )
                }
            }
        }
    }
}
