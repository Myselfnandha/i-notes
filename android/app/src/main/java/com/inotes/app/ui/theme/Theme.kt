package com.inotes.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = OchrePrimary,
    onPrimary = ParchmentSurface,
    primaryContainer = OchreContainer,
    onPrimaryContainer = OchreDark,
    secondary = OchreLight,
    onSecondary = InkPrimary,
    background = ParchmentBg,
    onBackground = InkPrimary,
    surface = ParchmentSurface,
    onSurface = InkPrimary,
    surfaceVariant = WashCream,
    onSurfaceVariant = InkSecondary,
    outline = ParchmentBorder
)

@Composable
fun INotesTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = Typography,
        content = content
    )
}
