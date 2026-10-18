package com.inotes.app;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIntent(intent);
    }

    @Override
    public void onResume() {
        super.onResume();
        syncPendingWidgetNotes();
    }

    private void handleIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        if ("inotes.action.VOICE".equals(action)) {
            dispatchJSEvent("inotes:open_voice", null);
        } else if ("inotes.action.CHECKLIST".equals(action)) {
            dispatchJSEvent("inotes:open_checklist", null);
        }
    }

    private void syncPendingWidgetNotes() {
        SharedPreferences prefs = getSharedPreferences(INotesWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE);
        String pending = prefs.getString(QuickNoteActivity.KEY_PENDING_NOTES, "[]");
        if (pending != null && !pending.equals("[]")) {
            dispatchJSEvent("inotes:sync_pending", pending);
            // Clear pending once handed off
            prefs.edit().putString(QuickNoteActivity.KEY_PENDING_NOTES, "[]").apply();
        }
    }

    private void dispatchJSEvent(String eventName, String jsonDetail) {
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            String script;
            if (jsonDetail != null) {
                script = "window.dispatchEvent(new CustomEvent('" + eventName + "', { detail: " + jsonDetail + " }));";
            } else {
                script = "window.dispatchEvent(new CustomEvent('" + eventName + "'));";
            }
            webView.postDelayed(() -> webView.evaluateJavascript(script, null), 300);
        }
    }
}
