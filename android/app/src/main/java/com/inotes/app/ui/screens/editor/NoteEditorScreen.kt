package com.inotes.app.ui.screens.editor

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.PushPin
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.inotes.app.data.model.Note
import com.inotes.app.ui.theme.*
import kotlinx.coroutines.delay

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NoteEditorScreen(
    initialNote: Note?,
    onSaveNote: (Note) -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val noteId = remember { initialNote?.id ?: "note-${System.currentTimeMillis()}" }
    val createdAt = remember { initialNote?.createdAt ?: System.currentTimeMillis() }

    var title by remember { mutableStateOf(initialNote?.title ?: "") }
    var content by remember { mutableStateOf(initialNote?.content ?: "") }
    var colorWash by remember { mutableStateOf(initialNote?.colorWash ?: "chamois") }
    var isPinned by remember { mutableStateOf(initialNote?.pinned ?: false) }
    var isSaving by remember { mutableStateOf(false) }

    val washColor = getPaperWashColor(colorWash)
    val wordCount = remember(content) {
        if (content.isBlank()) 0 else content.trim().split(Regex("\\s+")).size
    }
    val readingTime = remember(wordCount) {
        maxOf(1, wordCount / 200)
    }

    val paperWashes = listOf(
        "chamois" to WashChamois,
        "cream" to WashCream,
        "sage" to WashSage,
        "peach" to WashPeach,
        "white" to WashWhite,
        "lavender" to WashLavender
    )

    // Silent Auto-Save on Keystroke (Debounced by 400ms)
    LaunchedEffect(title, content, colorWash, isPinned) {
        if (title.isNotBlank() || content.isNotBlank()) {
            isSaving = true
            delay(400)
            val noteToSave = Note(
                id = noteId,
                title = title,
                content = content,
                snippet = if (content.length > 80) content.take(80) + "..." else content,
                folderId = initialNote?.folderId,
                tags = initialNote?.tags ?: listOf("reflection"),
                pinned = isPinned,
                archived = initialNote?.archived ?: false,
                trashed = false,
                colorWash = colorWash,
                wordCount = wordCount,
                readingTime = readingTime,
                createdAt = createdAt,
                updatedAt = System.currentTimeMillis()
            )
            onSaveNote(noteToSave)
            isSaving = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {},
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = InkPrimary)
                    }
                },
                actions = {
                    // Paper Wash Picker Swatches
                    Row(
                        modifier = Modifier.padding(end = 10.dp),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        for ((name, color) in paperWashes) {
                            Box(
                                modifier = Modifier
                                    .size(22.dp)
                                    .clip(CircleShape)
                                    .background(color)
                                    .border(
                                        width = if (colorWash == name) 2.dp else 1.dp,
                                        color = if (colorWash == name) OchrePrimary else ParchmentBorder,
                                        shape = CircleShape
                                    )
                                    .clickable { colorWash = name }
                            )
                        }
                    }

                    // Pin toggle
                    IconButton(onClick = { isPinned = !isPinned }) {
                        Icon(
                            Icons.Default.PushPin,
                            contentDescription = "Pin Note",
                            tint = if (isPinned) OchrePrimary else InkTertiary
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = washColor)
            )
        },
        bottomBar = {
            // Subtle Stationery Status Bar
            Surface(
                color = washColor,
                border = androidx.compose.foundation.BorderStroke(1.dp, ParchmentBorder)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "$wordCount words · $readingTime min read",
                        style = MaterialTheme.typography.labelSmall,
                        color = InkSecondary
                    )
                    Text(
                        text = if (isSaving) "Saving..." else "● Auto-saved",
                        style = MaterialTheme.typography.labelSmall,
                        color = if (isSaving) OchreLight else OchrePrimary,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        },
        containerColor = washColor
    ) { innerPadding ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 12.dp)
        ) {
            // Note Title (Serif typography)
            TextField(
                value = title,
                onValueChange = { title = it },
                placeholder = {
                    Text(
                        "Title of reflection...",
                        style = TextStyle(
                            fontFamily = FontFamily.Serif,
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Bold,
                            color = InkTertiary
                        )
                    )
                },
                textStyle = TextStyle(
                    fontFamily = FontFamily.Serif,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = InkPrimary
                ),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.Transparent,
                    unfocusedContainerColor = Color.Transparent,
                    disabledContainerColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent
                ),
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            // Ruled Notebook Guideline
            HorizontalDivider(
                color = ParchmentBorder,
                thickness = 1.dp,
                modifier = Modifier.padding(vertical = 8.dp)
            )

            // Note Content Body (Auto-expanding ruled sheet)
            TextField(
                value = content,
                onValueChange = { content = it },
                placeholder = {
                    Text(
                        "Write freely on this unbleached stationery sheet...",
                        style = TextStyle(
                            fontFamily = FontFamily.SansSerif,
                            fontSize = 15.sp,
                            lineHeight = 24.sp,
                            color = InkTertiary
                        )
                    )
                },
                textStyle = TextStyle(
                    fontFamily = FontFamily.SansSerif,
                    fontSize = 15.sp,
                    lineHeight = 24.sp,
                    color = InkPrimary
                ),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.Transparent,
                    unfocusedContainerColor = Color.Transparent,
                    disabledContainerColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .fillMaxHeight()
                    .defaultMinSize(minHeight = 450.dp)
            )
        }
    }
}
