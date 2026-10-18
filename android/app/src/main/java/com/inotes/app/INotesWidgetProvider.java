package com.inotes.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class INotesWidgetProvider extends AppWidgetProvider {

    public static final String PREFS_NAME = "inotes_shared_vault";
    public static final String KEY_LATEST_NOTE_TITLE = "latest_note_title";
    public static final String KEY_LATEST_NOTE_SNIPPET = "latest_note_snippet";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.inotes_widget_stationery);

        // Read latest saved note snippet from shared vault prefs
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String latestTitle = prefs.getString(KEY_LATEST_NOTE_TITLE, null);
        String latestSnippet = prefs.getString(KEY_LATEST_NOTE_SNIPPET, null);

        if (latestTitle != null && !latestTitle.trim().isEmpty()) {
            views.setTextViewText(R.id.widget_prompt_text, latestTitle);
            views.setTextViewText(R.id.widget_last_snippet, latestSnippet != null ? latestSnippet : "Saved to Vault · Tap to add next");
        } else if (latestSnippet != null && !latestSnippet.trim().isEmpty()) {
            views.setTextViewText(R.id.widget_prompt_text, "Latest Reflection");
            views.setTextViewText(R.id.widget_last_snippet, latestSnippet);
        } else {
            views.setTextViewText(R.id.widget_prompt_text, "Write a reflection or thought...");
            views.setTextViewText(R.id.widget_last_snippet, "Pristine sheet · Tap anywhere to type instantly");
        }

        // PendingIntent for Quick Note Activity (Instant transparent keyboard overlay)
        Intent quickNoteIntent = new Intent(context, QuickNoteActivity.class);
        quickNoteIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent quickNotePendingIntent = PendingIntent.getActivity(
                context,
                0,
                quickNoteIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        // Blank typing area triggers instant quick-add
        views.setOnClickPendingIntent(R.id.widget_blank_space, quickNotePendingIntent);
        views.setOnClickPendingIntent(R.id.widget_btn_new_note, quickNotePendingIntent);

        // PendingIntent for Voice Note in main app
        Intent voiceIntent = new Intent(context, MainActivity.class);
        voiceIntent.setAction("inotes.action.VOICE");
        voiceIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent voicePendingIntent = PendingIntent.getActivity(
                context,
                1,
                voiceIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_btn_voice, voicePendingIntent);

        // PendingIntent for Checklist in main app
        Intent checklistIntent = new Intent(context, MainActivity.class);
        checklistIntent.setAction("inotes.action.CHECKLIST");
        checklistIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent checklistPendingIntent = PendingIntent.getActivity(
                context,
                2,
                checklistIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_btn_checklist, checklistPendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    public static void updateAllWidgets(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        ComponentName component = new ComponentName(context, INotesWidgetProvider.class);
        int[] ids = manager.getAppWidgetIds(component);
        for (int id : ids) {
            updateAppWidget(context, manager, id);
        }
    }
}
