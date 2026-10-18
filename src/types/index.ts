export type ColorWash = 'white' | 'cream' | 'sage' | 'peach' | 'chamois' | 'lavender';

export interface Note {
  id: string;
  title: string;
  content_json?: string;
  content_html?: string;
  snippet?: string;
  folder_id?: string | null;
  tags: string[];
  pinned: boolean;
  archived: boolean;
  trashed: boolean;
  color_wash: ColorWash;
  audio_url?: string | null;
  audio_duration?: number;
  word_count?: number;
  reading_time?: number;
  created_at: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'High' | 'Medium' | 'Normal' | null;
  badge?: string | null;
  audio_clip?: string | null;
  assignee?: string | null;
  order: number;
}

export interface Checklist {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  folder_id?: string | null;
  pinned: boolean;
  archived: boolean;
  trashed: boolean;
  color_wash: ColorWash;
  reminder_time?: string | null;
  reminder_location?: string | null;
  items: ChecklistItem[];
  media_attachments: string[];
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  name: string;
  parent_id?: string | null;
  color?: string;
  display_order: number;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface VaultStats {
  notes_count: number;
  checklists_count: number;
  audio_count: number;
  used_mb: number;
  total_mb: number;
  synced_at: string;
}

export type ActiveTab = 'notes' | 'checklists' | 'folders' | 'archive';
