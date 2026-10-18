import sqlite3
import os
import json
from pathlib import Path

DATA_DIR = Path(os.environ.get("DATA_DIR", "data"))
DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR = DATA_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DATA_DIR / "inotes.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

def init_db():
    conn = get_db()
    with conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS folders (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            parent_id TEXT,
            color TEXT,
            display_order INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS tags (
            id TEXT PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            color TEXT
        );

        CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            content_json TEXT,
            content_html TEXT,
            snippet TEXT,
            folder_id TEXT,
            tags TEXT, -- JSON array of strings
            pinned INTEGER DEFAULT 0,
            archived INTEGER DEFAULT 0,
            trashed INTEGER DEFAULT 0,
            color_wash TEXT DEFAULT 'white',
            audio_url TEXT,
            audio_duration REAL DEFAULT 0,
            word_count INTEGER DEFAULT 0,
            reading_time INTEGER DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS checklists (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            subtitle TEXT,
            category TEXT,
            folder_id TEXT,
            pinned INTEGER DEFAULT 0,
            archived INTEGER DEFAULT 0,
            trashed INTEGER DEFAULT 0,
            color_wash TEXT DEFAULT 'white',
            reminder_time TEXT,
            reminder_location TEXT,
            items TEXT, -- JSON array of items
            media_attachments TEXT, -- JSON array
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
        """)
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at", DB_PATH)
