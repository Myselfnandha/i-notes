package com.inotes.app.data.model

data class ChecklistItem(
    val id: String,
    val text: String,
    val completed: Boolean = false,
    val order: Int = 0
)

data class Checklist(
    val id: String,
    val title: String,
    val category: String = "General",
    val pinned: Boolean = false,
    val archived: Boolean = false,
    val trashed: Boolean = false,
    val colorWash: String = "chamois",
    val items: List<ChecklistItem> = emptyList(),
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
) {
    val completedCount: Int get() = items.count { it.completed }
    val totalCount: Int get() = items.size
    val progress: Float get() = if (totalCount == 0) 0f else completedCount.toFloat() / totalCount
}
