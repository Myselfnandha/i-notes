package com.inotes.app

import android.app.Activity
import android.content.Context
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import com.inotes.app.data.model.Note
import com.inotes.app.data.repository.NotesRepository

class QuickNoteActivity : Activity() {

    private lateinit var inputTitle: EditText
    private lateinit var inputContent: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_quick_note)

        inputTitle = findViewById(R.id.input_note_title)
        inputContent = findViewById(R.id.input_note_content)
        val btnClose = findViewById<View>(R.id.btn_close)
        val btnCancel = findViewById<TextView>(R.id.btn_cancel)
        val btnSave = findViewById<Button>(R.id.btn_save_note)
        val root = findViewById<View>(R.id.quick_note_root)

        // Tap outside card dismisses dialog
        root.setOnClickListener { finish() }

        // Close and Cancel buttons
        btnClose.setOnClickListener { finish() }
        btnCancel.setOnClickListener { finish() }

        // Save action
        btnSave.setOnClickListener { saveNoteAndExit() }

        // Auto focus note content input and bring up soft keyboard immediately
        inputContent.requestFocus()
        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE)

        inputContent.postDelayed({
            val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as? InputMethodManager
            imm?.showSoftInput(inputContent, InputMethodManager.SHOW_IMPLICIT)
        }, 150)
    }

    private fun saveNoteAndExit() {
        val title = inputTitle.text.toString().trim()
        val content = inputContent.text.toString().trim()

        if (title.isEmpty() && content.isEmpty()) {
            Toast.makeText(this, "Note cannot be empty", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            val now = System.currentTimeMillis()
            val effectiveTitle = if (title.isNotEmpty()) title else (if (content.length > 30) content.take(30) + "..." else content)

            val newNote = Note(
                id = "note-$now",
                title = effectiveTitle,
                content = content,
                snippet = if (content.length > 80) content.take(80) + "..." else content,
                tags = listOf("quick-note"),
                colorWash = "chamois",
                createdAt = now,
                updatedAt = now
            )

            // Direct save to Native SQLite Vault
            NotesRepository.getInstance(applicationContext).saveNote(newNote)

            Toast.makeText(this, "Saved to i Notes Vault", Toast.LENGTH_SHORT).show()

            // Dismiss soft keyboard & exit cleanly
            val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as? InputMethodManager
            imm?.hideSoftInputFromWindow(inputContent.windowToken, 0)
            finish()

        } catch (e: Exception) {
            e.printStackTrace()
            Toast.makeText(this, "Error saving note: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }
}
