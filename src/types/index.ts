export type ItemType = 'note' | 'reminder' | 'link' | 'instagram' | 'checklist' | 'audio';

export type PriorityLevel = 'low' | 'medium' | 'high';

export type RecurrenceRule = 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly';

export type ColorAccent =
  | 'paper'
  | 'oat'
  | 'sage'
  | 'ochre'
  | 'terracotta'
  | 'lilac'
  | 'slate'
  | 'emerald'
  | 'cyan'
  | 'amber'
  | 'rose'
  | 'violet';

export type SortOption = 'newest' | 'oldest' | 'due' | 'priority' | 'alphabetical';

export type SyncState = 'connected' | 'connecting' | 'reconnecting' | 'offline';

export interface ChecklistTask {
  text: string;
  done: boolean;
}

export interface UrlMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  isInstagram?: boolean;
  igType?: 'reel' | 'post' | 'video' | 'story';
  shortcode?: string;
  embedUrl?: string;
  cleanUrl?: string;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  noteCount?: number;
}

export interface Item {
  id: string;
  sync_room: string;
  type: ItemType;
  title: string;
  content: string;
  plainText?: string;
  deck?: string;
  url?: string;
  metadata?: UrlMetadata;
  folderId?: string | null;
  tags: string[];
  color: ColorAccent;
  is_pinned: boolean;
  is_completed: boolean;
  is_archived?: boolean;
  due_date?: string | null;
  reminder_recurrence?: RecurrenceRule;
  priority?: PriorityLevel;
  checklist?: ChecklistTask[];
  snoozed_until?: string | null;
  audio_duration?: string;
  revision?: number;
  created_at: number;
  updated_at: number;
  _offline_pending?: boolean;
}

export interface DeviceInfo {
  id: string;
  name: string;
  platform: string;
}

export interface NetworkInfo {
  localIp: string;
  port: number;
  syncUrl: string;
  publicHttpsUrl?: string | null;
  lanSyncUrl?: string;
  room: string;
  qrDataUrl: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  desc?: string;
  duration?: number;
}
