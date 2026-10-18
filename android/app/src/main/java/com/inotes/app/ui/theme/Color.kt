package com.inotes.app.ui.theme

import androidx.compose.ui.graphics.Color

val ParchmentBg = Color(0xFFFAF5ED)
val ParchmentSurface = Color(0xFFFFFFFF)
val ParchmentBorder = Color(0xFFEAD7C1)
val ParchmentDivider = Color(0xFFEFEBE4)

val InkPrimary = Color(0xFF1C1B1A)
val InkSecondary = Color(0xFF6F6B66)
val InkTertiary = Color(0xFF9E9A95)

val OchrePrimary = Color(0xFF8D4B00)
val OchreDark = Color(0xFF5B3000)
val OchreLight = Color(0xFFE0A96D)
val OchreContainer = Color(0xFFF6E8D8)

// 6 Archival Stationery Paper Washes
val WashWhite = Color(0xFFFFFFFF)
val WashCream = Color(0xFFFAF5ED)
val WashSage = Color(0xFFF3F6F2)
val WashPeach = Color(0xFFFDF3EE)
val WashChamois = Color(0xFFF7F0E6)
val WashLavender = Color(0xFFF4F1F8)

fun getPaperWashColor(name: String): Color {
    return when (name.lowercase()) {
        "white" -> WashWhite
        "cream" -> WashCream
        "sage" -> WashSage
        "peach" -> WashPeach
        "chamois" -> WashChamois
        "lavender" -> WashLavender
        else -> WashChamois
    }
}
