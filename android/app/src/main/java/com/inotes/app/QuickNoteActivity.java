package com.inotes.app;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class QuickNoteActivity extends Activity {

    public static final String PREFS_NAME = "inotes_shared_vault";
    public static final String KEY_PENDING_NOTES = "pending_notes";

    private EditText inputTitle;
    private EditText inputContent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quick_note);

        inputTitle = findViewById(R.id.input_note_title);
        inputContent = findViewById(R.id.input_note_content);
        View btnClose = findViewById(R.id.btn_close);
        TextView btnCancel = findViewById(R.id.btn_cancel);
        Button btnSave = findViewById(R.id.btn_save_note);
        View root = findViewById(R.id.quick_note_root);

        // Tap outside card dismisses dialog
        root.setOnClickListener(v -> finish());

        // Close and Cancel buttons
        btnClose.setOnClickListener(v -> finish());
        btnCancel.setOnClickListener(v -> finish());

        // Save action
        btnSave.setOnClickListener(v -> saveNoteAndExit());

        // Auto focus note content input and bring up soft keyboard immediately
        inputContent.requestFocus();
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE);

        inputContent.postDelayed(() -> {
            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            if (imm != null) {
                imm.showSoftInput(inputContent, InputMethodManager.SHOW_IMPLICIT);
            }
        }, 150);
    }

    private void saveNoteAndExit() {
        String title = inputTitle.getText().toString().trim();
        String content = inputContent.getText().toString().trim();

        if (title.isEmpty() && content.isEmpty()) {
            Toast.makeText(this, "Note cannot be empty", Toast.LENGTH_SHORT).show();
            return;
        }

        try {
            long now = System.currentTimeMillis();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            String isoDate = sdf.format(new Date(now));

            String noteId = "note-" + now;
            String effectiveTitle = !title.isEmpty() ? title : (content.length() > 30 ? content.substring(0, 30) + "..." : content);
            int wordCount = content.isEmpty() ? 0 : content.split("\\s+").length;

            JSONObject noteObj = new JSONObject();
            noteObj.put("id", noteId);
            noteObj.put("title", effectiveTitle);
            noteObj.put("content_html", "<p>" + content.replace("\n", "<br/>") + "</p>");
            noteObj.put("snippet", content);
            noteObj.put("tags", new JSONArray().put("quick-note"));
            noteObj.put("pinned", false);
            noteObj.put("archived", false);
            noteObj.put("trashed", false);
            noteObj.put("color_wash", "chamois");
            noteObj.put("created_at", isoDate);
            noteObj.put("updated_at", isoDate);
            noteObj.put("word_count", wordCount);
            noteObj.put("reading_time", 1);

            // Store into shared preferences for local vault bridge
            SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            String existingPending = prefs.getString(KEY_PENDING_NOTES, "[]");
            JSONArray pendingArray = new JSONArray(existingPending);
            pendingArray.put(noteObj);

            SharedPreferences.Editor editor = prefs.edit();
            editor.putString(KEY_PENDING_NOTES, pendingArray.toString());
            editor.putString(INotesWidgetProvider.KEY_LATEST_NOTE_TITLE, effectiveTitle);
            editor.putString(INotesWidgetProvider.KEY_LATEST_NOTE_SNIPPET, content);
            editor.apply();

            // Refresh the home screen widget immediately
            INotesWidgetProvider.updateAllWidgets(this);

            // Optional background cloud sync attempt
            syncNoteToCloudBackground(noteObj);

            Toast.makeText(this, "Saved to i Notes Vault", Toast.LENGTH_SHORT).show();

            // Hide keyboard & finish smoothly
            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            if (imm != null) {
                imm.hideSoftInputFromWindow(inputContent.getWindowToken(), 0);
            }
            finish();

        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(this, "Error saving note: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }

    private void syncNoteToCloudBackground(final JSONObject noteObj) {
        new Thread(() -> {
            try {
                // If local/remote backend is configured
                URL url = new URL("http://10.0.2.2:7860/api/notes");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setConnectTimeout(3000);
                conn.setReadTimeout(3000);
                conn.setDoOutput(true);

                try (OutputStream os = conn.getOutputStream()) {
                    byte[] input = noteObj.toString().getBytes("utf-8");
                    os.write(input, 0, input.length);
                }
                int code = conn.getResponseCode();
                conn.disconnect();
            } catch (Exception ignored) {
                // Offline fallback - note is safely persisted in local vault
            }
        }).start();
    }
}
