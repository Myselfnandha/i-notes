import os
import json
import uuid
import datetime
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.database import init_db, get_db, UPLOADS_DIR, DB_PATH
from backend.models import (
    NoteModel, ChecklistModel, FolderModel, TagModel, SyncPayload, VaultStats
)

app = FastAPI(title="i Notes Archival System API", version="2.4.0")

# Enable CORS for local dev and remote PWA clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "i Notes Archival System",
        "version": "2.4.0",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }

# ----------------- Notes Endpoints ----------------- #

@app.get("/api/notes", response_model=List[NoteModel])
def get_notes():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM notes ORDER BY updated_at DESC")
    rows = cursor.fetchall()
    notes = []
    for r in rows:
        notes.append(NoteModel(
            id=r["id"],
            title=r["title"],
            content_json=r["content_json"],
            content_html=r["content_html"],
            snippet=r["snippet"],
            folder_id=r["folder_id"],
            tags=json.loads(r["tags"]) if r["tags"] else [],
            pinned=bool(r["pinned"]),
            archived=bool(r["archived"]),
            trashed=bool(r["trashed"]),
            color_wash=r["color_wash"] or "white",
            audio_url=r["audio_url"],
            audio_duration=r["audio_duration"] or 0.0,
            word_count=r["word_count"] or 0,
            reading_time=r["reading_time"] or 1,
            created_at=r["created_at"],
            updated_at=r["updated_at"]
        ))
    conn.close()
    return notes

@app.post("/api/notes", response_model=NoteModel)
def upsert_note(note: NoteModel):
    conn = get_db()
    with conn:
        conn.execute("""
            INSERT INTO notes (
                id, title, content_json, content_html, snippet, folder_id, tags,
                pinned, archived, trashed, color_wash, audio_url, audio_duration,
                word_count, reading_time, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                title=excluded.title,
                content_json=excluded.content_json,
                content_html=excluded.content_html,
                snippet=excluded.snippet,
                folder_id=excluded.folder_id,
                tags=excluded.tags,
                pinned=excluded.pinned,
                archived=excluded.archived,
                trashed=excluded.trashed,
                color_wash=excluded.color_wash,
                audio_url=excluded.audio_url,
                audio_duration=excluded.audio_duration,
                word_count=excluded.word_count,
                reading_time=excluded.reading_time,
                updated_at=excluded.updated_at
        """, (
            note.id, note.title, note.content_json, note.content_html, note.snippet,
            note.folder_id, json.dumps(note.tags), int(note.pinned), int(note.archived),
            int(note.trashed), note.color_wash, note.audio_url, note.audio_duration,
            note.word_count, note.reading_time, note.created_at, note.updated_at
        ))
    conn.close()
    return note

@app.delete("/api/notes/{note_id}")
def delete_note(note_id: str):
    conn = get_db()
    with conn:
        conn.execute("DELETE FROM notes WHERE id = ?", (note_id,))
    conn.close()
    return {"deleted": note_id}

# ----------------- Checklists Endpoints ----------------- #

@app.get("/api/checklists", response_model=List[ChecklistModel])
def get_checklists():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM checklists ORDER BY updated_at DESC")
    rows = cursor.fetchall()
    checklists = []
    for r in rows:
        checklists.append(ChecklistModel(
            id=r["id"],
            title=r["title"],
            subtitle=r["subtitle"],
            category=r["category"],
            folder_id=r["folder_id"],
            pinned=bool(r["pinned"]),
            archived=bool(r["archived"]),
            trashed=bool(r["trashed"]),
            color_wash=r["color_wash"] or "white",
            reminder_time=r["reminder_time"],
            reminder_location=r["reminder_location"],
            items=json.loads(r["items"]) if r["items"] else [],
            media_attachments=json.loads(r["media_attachments"]) if r["media_attachments"] else [],
            created_at=r["created_at"],
            updated_at=r["updated_at"]
        ))
    conn.close()
    return checklists

@app.post("/api/checklists", response_model=ChecklistModel)
def upsert_checklist(cl: ChecklistModel):
    conn = get_db()
    with conn:
        conn.execute("""
            INSERT INTO checklists (
                id, title, subtitle, category, folder_id, pinned, archived, trashed,
                color_wash, reminder_time, reminder_location, items, media_attachments,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                title=excluded.title,
                subtitle=excluded.subtitle,
                category=excluded.category,
                folder_id=excluded.folder_id,
                pinned=excluded.pinned,
                archived=excluded.archived,
                trashed=excluded.trashed,
                color_wash=excluded.color_wash,
                reminder_time=excluded.reminder_time,
                reminder_location=excluded.reminder_location,
                items=excluded.items,
                media_attachments=excluded.media_attachments,
                updated_at=excluded.updated_at
        """, (
            cl.id, cl.title, cl.subtitle, cl.category, cl.folder_id, int(cl.pinned),
            int(cl.archived), int(cl.trashed), cl.color_wash, cl.reminder_time,
            cl.reminder_location, json.dumps([item.dict() for item in cl.items]),
            json.dumps(cl.media_attachments), cl.created_at, cl.updated_at
        ))
    conn.close()
    return cl

@app.delete("/api/checklists/{cl_id}")
def delete_checklist(cl_id: str):
    conn = get_db()
    with conn:
        conn.execute("DELETE FROM checklists WHERE id = ?", (cl_id,))
    conn.close()
    return {"deleted": cl_id}

# ----------------- Folders & Tags ----------------- #

@app.get("/api/folders", response_model=List[FolderModel])
def get_folders():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM folders ORDER BY display_order ASC, name ASC")
    rows = cursor.fetchall()
    folders = [FolderModel(
        id=r["id"], name=r["name"], parent_id=r["parent_id"], color=r["color"],
        display_order=r["display_order"], created_at=r["created_at"]
    ) for r in rows]
    conn.close()
    return folders

@app.post("/api/folders", response_model=FolderModel)
def upsert_folder(folder: FolderModel):
    conn = get_db()
    with conn:
        conn.execute("""
            INSERT INTO folders (id, name, parent_id, color, display_order, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                name=excluded.name,
                parent_id=excluded.parent_id,
                color=excluded.color,
                display_order=excluded.display_order
        """, (folder.id, folder.name, folder.parent_id, folder.color, folder.display_order, folder.created_at))
    conn.close()
    return folder

@app.delete("/api/folders/{folder_id}")
def delete_folder(folder_id: str):
    conn = get_db()
    with conn:
        conn.execute("DELETE FROM folders WHERE id = ?", (folder_id,))
    conn.close()
    return {"deleted": folder_id}

@app.get("/api/tags", response_model=List[TagModel])
def get_tags():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tags ORDER BY name ASC")
    rows = cursor.fetchall()
    tags = [TagModel(id=r["id"], name=r["name"], color=r["color"]) for r in rows]
    conn.close()
    return tags

@app.post("/api/tags", response_model=TagModel)
def upsert_tag(tag: TagModel):
    conn = get_db()
    with conn:
        conn.execute("""
            INSERT INTO tags (id, name, color) VALUES (?, ?, ?)
            ON CONFLICT(name) DO UPDATE SET color=excluded.color
        """, (tag.id, tag.name, tag.color))
    conn.close()
    return tag

@app.delete("/api/tags/{tag_id}")
def delete_tag(tag_id: str):
    conn = get_db()
    with conn:
        conn.execute("DELETE FROM tags WHERE id = ?", (tag_id,))
    conn.close()
    return {"deleted": tag_id}

# ----------------- Audio & Media Uploads ----------------- #

@app.post("/api/audio/upload")
async def upload_audio(file: UploadFile = File(...)):
    filename = f"audio_{uuid.uuid4().hex[:12]}_{file.filename}"
    filepath = UPLOADS_DIR / filename
    with open(filepath, "wb") as f:
        content = await file.read()
        f.write(content)
    return {
        "url": f"/api/audio/{filename}",
        "filename": filename,
        "size": len(content)
    }

@app.get("/api/audio/{filename}")
def stream_audio(filename: str):
    filepath = UPLOADS_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(filepath, media_type="audio/webm")

# ----------------- Bidirectional Sync & Vault Stats ----------------- #

@app.post("/api/sync")
def sync_vault(payload: SyncPayload):
    # Upsert all client mutations
    for folder in payload.folders:
        upsert_folder(folder)
    for tag in payload.tags:
        upsert_tag(tag)
    for note in payload.notes:
        upsert_note(note)
    for cl in payload.checklists:
        upsert_checklist(cl)

    # Return complete updated state
    return {
        "notes": get_notes(),
        "checklists": get_checklists(),
        "folders": get_folders(),
        "tags": get_tags(),
        "synced_at": datetime.datetime.utcnow().isoformat() + "Z"
    }

@app.get("/api/vault/stats", response_model=VaultStats)
def get_vault_stats():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM notes WHERE trashed = 0")
    notes_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM checklists WHERE trashed = 0")
    checklists_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM notes WHERE audio_url IS NOT NULL AND audio_url != ''")
    audio_count = cursor.fetchone()[0]
    conn.close()

    # Calculate uploads folder size
    uploads_bytes = sum(f.stat().st_size for f in UPLOADS_DIR.glob('*') if f.is_file())
    db_bytes = DB_PATH.stat().st_size if DB_PATH.exists() else 0
    used_mb = round((uploads_bytes + db_bytes) / (1024 * 1024), 2)

    return VaultStats(
        notes_count=notes_count,
        checklists_count=checklists_count,
        audio_count=audio_count,
        used_mb=max(used_mb, 1.4), # baseline db size
        total_mb=2048.0,
        synced_at=datetime.datetime.utcnow().isoformat() + "Z"
    )

# ----------------- Static SPA Frontend Serving ----------------- #

DIST_DIR = Path("dist")

if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        file_path = DIST_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(DIST_DIR / "index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=7860, reload=True)
