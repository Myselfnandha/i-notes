from typing import List, Optional, Any
from pydantic import BaseModel, Field

class FolderModel(BaseModel):
    id: str
    name: str
    parent_id: Optional[str] = None
    color: Optional[str] = "#8d4b00"
    display_order: int = 0
    created_at: str

class TagModel(BaseModel):
    id: str
    name: str
    color: Optional[str] = "#d97706"

class NoteModel(BaseModel):
    id: str
    title: str = "Untitled Note"
    content_json: Optional[str] = "{}"
    content_html: Optional[str] = ""
    snippet: Optional[str] = ""
    folder_id: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    pinned: bool = False
    archived: bool = False
    trashed: bool = False
    color_wash: str = "white"
    audio_url: Optional[str] = None
    audio_duration: float = 0.0
    word_count: int = 0
    reading_time: int = 1
    created_at: str
    updated_at: str

class ChecklistItem(BaseModel):
    id: str
    text: str
    completed: bool = False
    priority: Optional[str] = None # 'High', 'Medium', etc.
    badge: Optional[str] = None
    audio_clip: Optional[str] = None
    assignee: Optional[str] = None
    order: int = 0

class ChecklistModel(BaseModel):
    id: str
    title: str = "Untitled Checklist"
    subtitle: Optional[str] = ""
    category: Optional[str] = "Personal"
    folder_id: Optional[str] = None
    pinned: bool = False
    archived: bool = False
    trashed: bool = False
    color_wash: str = "white"
    reminder_time: Optional[str] = None
    reminder_location: Optional[str] = None
    items: List[ChecklistItem] = Field(default_factory=list)
    media_attachments: List[str] = Field(default_factory=list)
    created_at: str
    updated_at: str

class SyncPayload(BaseModel):
    notes: List[NoteModel] = Field(default_factory=list)
    checklists: List[ChecklistModel] = Field(default_factory=list)
    folders: List[FolderModel] = Field(default_factory=list)
    tags: List[TagModel] = Field(default_factory=list)

class VaultStats(BaseModel):
    notes_count: int
    checklists_count: int
    audio_count: int
    used_mb: float
    total_mb: float = 2048.0
    synced_at: str
