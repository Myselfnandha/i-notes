import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Note, Checklist, Folder, Tag } from '../types';

interface INotesDB extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: { 'by-updated': string; 'by-folder': string };
  };
  checklists: {
    key: string;
    value: Checklist;
    indexes: { 'by-updated': string };
  };
  folders: {
    key: string;
    value: Folder;
    indexes: { 'by-order': number };
  };
  tags: {
    key: string;
    value: Tag;
  };
}

const DB_NAME = 'inotes_client_vault';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<INotesDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<INotesDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('notes')) {
          const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
          noteStore.createIndex('by-updated', 'updated_at');
          noteStore.createIndex('by-folder', 'folder_id');
        }
        if (!db.objectStoreNames.contains('checklists')) {
          const clStore = db.createObjectStore('checklists', { keyPath: 'id' });
          clStore.createIndex('by-updated', 'updated_at');
        }
        if (!db.objectStoreNames.contains('folders')) {
          const folderStore = db.createObjectStore('folders', { keyPath: 'id' });
          folderStore.createIndex('by-order', 'display_order');
        }
        if (!db.objectStoreNames.contains('tags')) {
          db.createObjectStore('tags', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// ----------------- Notes Operations ----------------- //

export async function dbGetNotes(): Promise<Note[]> {
  const db = await getDB();
  const notes = await db.getAll('notes');
  return notes.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export async function dbGetNote(id: string): Promise<Note | undefined> {
  const db = await getDB();
  return db.get('notes', id);
}

export async function dbSaveNote(note: Note): Promise<Note> {
  const db = await getDB();
  await db.put('notes', note);
  return note;
}

export async function dbDeleteNote(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('notes', id);
}

// ----------------- Checklists Operations ----------------- //

export async function dbGetChecklists(): Promise<Checklist[]> {
  const db = await getDB();
  const lists = await db.getAll('checklists');
  return lists.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export async function dbGetChecklist(id: string): Promise<Checklist | undefined> {
  const db = await getDB();
  return db.get('checklists', id);
}

export async function dbSaveChecklist(cl: Checklist): Promise<Checklist> {
  const db = await getDB();
  await db.put('checklists', cl);
  return cl;
}

export async function dbDeleteChecklist(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('checklists', id);
}

// ----------------- Folders Operations ----------------- //

export async function dbGetFolders(): Promise<Folder[]> {
  const db = await getDB();
  const folders = await db.getAll('folders');
  return folders.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export async function dbSaveFolder(folder: Folder): Promise<Folder> {
  const db = await getDB();
  await db.put('folders', folder);
  return folder;
}

export async function dbDeleteFolder(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('folders', id);
}

// ----------------- Tags Operations ----------------- //

export async function dbGetTags(): Promise<Tag[]> {
  const db = await getDB();
  return db.getAll('tags');
}

export async function dbSaveTag(tag: Tag): Promise<Tag> {
  const db = await getDB();
  await db.put('tags', tag);
  return tag;
}

export async function dbDeleteTag(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('tags', id);
}

// ----------------- Vault Backup / Export / Import ----------------- //

export async function dbExportVault(): Promise<string> {
  const [notes, checklists, folders, tags] = await Promise.all([
    dbGetNotes(),
    dbGetChecklists(),
    dbGetFolders(),
    dbGetTags()
  ]);
  const payload = {
    app: 'i Notes Archival System',
    version: '2.4.0',
    exported_at: new Date().toISOString(),
    data: { notes, checklists, folders, tags }
  };
  return JSON.stringify(payload, null, 2);
}

export async function dbImportVault(jsonString: string): Promise<{ notes: number; checklists: number }> {
  const parsed = JSON.parse(jsonString);
  const data = parsed.data || parsed;
  const db = await getDB();

  const tx = db.transaction(['notes', 'checklists', 'folders', 'tags'], 'readwrite');
  if (Array.isArray(data.notes)) {
    for (const n of data.notes) await tx.objectStore('notes').put(n);
  }
  if (Array.isArray(data.checklists)) {
    for (const c of data.checklists) await tx.objectStore('checklists').put(c);
  }
  if (Array.isArray(data.folders)) {
    for (const f of data.folders) await tx.objectStore('folders').put(f);
  }
  if (Array.isArray(data.tags)) {
    for (const t of data.tags) await tx.objectStore('tags').put(t);
  }
  await tx.done;

  return {
    notes: data.notes?.length || 0,
    checklists: data.checklists?.length || 0
  };
}

// ----------------- Vault Reset ----------------- //

export async function dbClearVault(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['notes', 'checklists', 'folders', 'tags'], 'readwrite');
  await tx.objectStore('notes').clear();
  await tx.objectStore('checklists').clear();
  await tx.objectStore('folders').clear();
  await tx.objectStore('tags').clear();
  await tx.done;
}

