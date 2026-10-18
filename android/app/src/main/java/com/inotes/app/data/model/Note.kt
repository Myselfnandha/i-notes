package com.inotes.app.data.model

data class Note(
    val id: String,
    val title: String,
    val content: String,
    val snippet: String = if (content.length > 80) content.take(80) + "..." else content,
    val folderId: String? = null,
    val tags: List<String> = emptyList(),
    val pinned: Boolean = false,
    val archived: Boolean = false,
    val trashed: Boolean = false,
    val colorWash: String = "chamois",
    val wordCount: Int = if (content.isBlank()) 0 else content.trim().split(Regex("\\s+")).size,
    val readingTime: Int = maxOf(1, (if (content.isBlank()) 0 else content.trim().split(Regex("\\s+")).size) / 200),
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
