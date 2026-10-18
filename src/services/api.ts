import { Note, Checklist, Folder, Tag, VaultStats } from '../types';

const API_BASE = '/api';

export async function apiCheckHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET', cache: 'no-cache' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiGetNotes(): Promise<Note[]> {
  const res = await fetch(`${API_BASE}/notes`);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
}

export async function apiSaveNote(note: Note): Promise<Note> {
  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error('Failed to save note');
  return res.json();
}

export async function apiDeleteNote(id: string): Promise<void> {
  await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
}

export async function apiGetChecklists(): Promise<Checklist[]> {
  const res = await fetch(`${API_BASE}/checklists`);
  if (!res.ok) throw new Error('Failed to fetch checklists');
  return res.json();
}

export async function apiSaveChecklist(cl: Checklist): Promise<Checklist> {
  const res = await fetch(`${API_BASE}/checklists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cl),
  });
  if (!res.ok) throw new Error('Failed to save checklist');
  return res.json();
}

export async function apiDeleteChecklist(id: string): Promise<void> {
  await fetch(`${API_BASE}/checklists/${id}`, { method: 'DELETE' });
}

export async function apiGetFolders(): Promise<Folder[]> {
  const res = await fetch(`${API_BASE}/folders`);
  if (!res.ok) throw new Error('Failed to fetch folders');
  return res.json();
}

export async function apiSaveFolder(f: Folder): Promise<Folder> {
  const res = await fetch(`${API_BASE}/folders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(f),
  });
  if (!res.ok) throw new Error('Failed to save folder');
  return res.json();
}

export async function apiDeleteFolder(id: string): Promise<void> {
  await fetch(`${API_BASE}/folders/${id}`, { method: 'DELETE' });
}

export async function apiGetTags(): Promise<Tag[]> {
  const res = await fetch(`${API_BASE}/tags`);
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}

export async function apiSaveTag(t: Tag): Promise<Tag> {
  const res = await fetch(`${API_BASE}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(t),
  });
  if (!res.ok) throw new Error('Failed to save tag');
  return res.json();
}

export async function apiDeleteTag(id: string): Promise<void> {
  await fetch(`${API_BASE}/tags/${id}`, { method: 'DELETE' });
}

export async function apiUploadAudio(blob: Blob, filename = 'memo.webm'): Promise<{ url: string; size: number }> {
  const formData = new FormData();
  formData.append('file', blob, filename);
  const res = await fetch(`${API_BASE}/audio/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload audio');
  return res.json();
}

export async function apiSyncVault(payload: {
  notes: Note[];
  checklists: Checklist[];
  folders: Folder[];
  tags: Tag[];
}): Promise<{
  notes: Note[];
  checklists: Checklist[];
  folders: Folder[];
  tags: Tag[];
  synced_at: string;
}> {
  const res = await fetch(`${API_BASE}/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Sync failed');
  return res.json();
}

export async function apiGetVaultStats(): Promise<VaultStats> {
  const res = await fetch(`${API_BASE}/vault/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}
