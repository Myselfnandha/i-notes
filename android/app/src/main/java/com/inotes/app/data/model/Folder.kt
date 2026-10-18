package com.inotes.app.data.model

data class Folder(
    val id: String,
    val name: String,
    val color: String = "#8D4B00",
    val displayOrder: Int = 0,
    val createdAt: Long = System.currentTimeMillis()
)
