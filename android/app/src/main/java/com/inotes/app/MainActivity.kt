package com.inotes.app

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.inotes.app.data.repository.NotesRepository
import com.inotes.app.ui.screens.main.MainScreen

class MainActivity : ComponentActivity() {

    private lateinit var repository: NotesRepository
    private var launchAction: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        repository = NotesRepository.getInstance(applicationContext)
        launchAction = intent?.action

        setContent {
            MainScreen(
                repository = repository,
                initialAction = launchAction
            )
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        launchAction = intent.action
        setContent {
            MainScreen(
                repository = repository,
                initialAction = launchAction
            )
        }
    }

    override fun onResume() {
        super.onResume()
        repository.refreshAll()
    }
}
