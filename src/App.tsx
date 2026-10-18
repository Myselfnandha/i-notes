import React, { useState, useEffect, useCallback } from 'react';
import {
  Note,
  Checklist,
  Folder,
  Tag,
  ActiveTab,
  ColorWash
} from './types';
import {
  dbGetNotes,
  dbGetChecklists,
  dbGetFolders,
  dbGetTags,
  dbSaveNote,
  dbDeleteNote,
  dbSaveChecklist,
  dbDeleteChecklist,
  dbSaveFolder,
  dbDeleteFolder,
  dbSaveTag,
  dbDeleteTag
} from './db';
import { subscribeSyncStatus, triggerVaultSync } from './services/syncService';
import { AppShell } from './components/layout/AppShell';
import { NotesFeed } from './components/notes/NotesFeed';
import { FoldersView } from './components/folders/FoldersView';
import { NoteEditor } from './components/editor/NoteEditor';
import { ChecklistsView } from './components/checklists/ChecklistsView';
import { ChecklistDetail } from './components/checklists/ChecklistDetail';
import { ArchiveTrashView } from './components/archive/ArchiveTrashView';
import { AudioRecorderModal } from './components/audio/AudioRecorderModal';
import { VaultBackupModal } from './components/vault/VaultBackupModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [syncStatus, setSyncStatus] = useState<string>('Synced just now');

  // Active view states
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(null);
  const [subView, setSubView] = useState<'none' | 'archive' | 'trash'>('none');
  const [isVoiceRecorderOpen, setIsVoiceRecorderOpen] = useState(false);
  const [isVaultManagerOpen, setIsVaultManagerOpen] = useState(false);

  // Load vault data from IndexedDB
  const refreshData = useCallback(async () => {
    try {
      const [allNotes, allChecklists, allFolders, allTags] = await Promise.all([
        dbGetNotes(),
        dbGetChecklists(),
        dbGetFolders(),
        dbGetTags(),
      ]);
      setNotes(allNotes);
      setChecklists(allChecklists);
      setFolders(allFolders);
      setTags(allTags);
    } catch (err) {
      console.error('Failed to load vault data:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
    const unsubscribe = subscribeSyncStatus((_, time) => {
      setSyncStatus(time || 'Synced just now');
    });

    // Check launch action query params (?action=new-note / ?action=new-checklist / ?action=voice)
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    if (action === 'new-note' || action === 'quick-note') {
      handleCreateNewNote();
    } else if (action === 'new-checklist') {
      handleCreateNewChecklist();
    } else if (action === 'voice') {
      setIsVoiceRecorderOpen(true);
    }

    // Android Widget bridge: receive notes added via home screen widget
    const handleWidgetPendingNotes = async (e: any) => {
      const pendingNotes = e.detail;
      if (Array.isArray(pendingNotes) && pendingNotes.length > 0) {
        for (const n of pendingNotes) {
          await dbSaveNote(n);
        }
        await refreshData();
      }
    };

    const handleOpenVoice = () => setIsVoiceRecorderOpen(true);
    const handleOpenChecklist = () => setActiveTab('checklists');

    window.addEventListener('inotes:sync_pending', handleWidgetPendingNotes);
    window.addEventListener('inotes:open_voice', handleOpenVoice);
    window.addEventListener('inotes:open_checklist', handleOpenChecklist);

    // Trigger cloud sync in background if online
    triggerVaultSync().then(() => refreshData());

    return () => {
      unsubscribe();
      window.removeEventListener('inotes:sync_pending', handleWidgetPendingNotes);
      window.removeEventListener('inotes:open_voice', handleOpenVoice);
      window.removeEventListener('inotes:open_checklist', handleOpenChecklist);
    };
  }, [refreshData]);

  // Note Handlers
  const handleSaveNote = async (updatedNote: Note) => {
    await dbSaveNote(updatedNote);
    setNotes(prev => {
      const idx = prev.findIndex(n => n.id === updatedNote.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedNote;
        return next;
      }
      return [updatedNote, ...prev];
    });
  };

  const handleDeleteNote = async (note: Note) => {
    if (note.trashed) {
      await dbDeleteNote(note.id);
      setNotes(prev => prev.filter(n => n.id !== note.id));
    } else {
      const trashedNote = { ...note, trashed: true, updated_at: new Date().toISOString() };
      await dbSaveNote(trashedNote);
      setNotes(prev => prev.map(n => n.id === note.id ? trashedNote : n));
    }
    if (editingNote?.id === note.id) setEditingNote(null);
  };

  const handleTogglePinNote = async (note: Note) => {
    const updated = { ...note, pinned: !note.pinned, updated_at: new Date().toISOString() };
    await handleSaveNote(updated);
  };

  const handleToggleArchiveNote = async (note: Note) => {
    const updated = { ...note, archived: !note.archived, updated_at: new Date().toISOString() };
    await handleSaveNote(updated);
  };

  const handleChangeColorWash = async (note: Note, wash: ColorWash) => {
    const updated = { ...note, color_wash: wash, updated_at: new Date().toISOString() };
    await handleSaveNote(updated);
  };

  const handleCreateNewNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: '',
      content_html: '',
      snippet: '',
      tags: [],
      pinned: false,
      archived: false,
      trashed: false,
      color_wash: 'white',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      word_count: 0,
      reading_time: 1,
    };
    setEditingNote(newNote);
  };

  // Checklist Handlers
  const handleSaveChecklist = async (updatedCl: Checklist) => {
    await dbSaveChecklist(updatedCl);
    setChecklists(prev => {
      const idx = prev.findIndex(c => c.id === updatedCl.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedCl;
        return next;
      }
      return [updatedCl, ...prev];
    });
  };

  const handleDeleteChecklist = async (cl: Checklist) => {
    if (cl.trashed) {
      await dbDeleteChecklist(cl.id);
      setChecklists(prev => prev.filter(c => c.id !== cl.id));
    } else {
      const trashedCl = { ...cl, trashed: true, updated_at: new Date().toISOString() };
      await dbSaveChecklist(trashedCl);
      setChecklists(prev => prev.map(c => c.id === cl.id ? trashedCl : c));
    }
    if (editingChecklist?.id === cl.id) setEditingChecklist(null);
  };

  const handleCreateNewChecklist = () => {
    const newCl: Checklist = {
      id: `cl-${Date.now()}`,
      title: 'New Checklist',
      subtitle: '',
      category: 'General',
      pinned: false,
      archived: false,
      trashed: false,
      color_wash: 'white',
      items: [
        { id: `item-1`, text: 'First task', completed: false, order: 0 }
      ],
      media_attachments: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEditingChecklist(newCl);
  };

  // Audio recording saved
  const handleAudioRecorded = async (audioUrl: string, duration: number, title = 'Voice Memo') => {
    const newAudioNote: Note = {
      id: `note-audio-${Date.now()}`,
      title: title,
      content_html: `<p>Voice dictation captured on ${new Date().toLocaleTimeString()}</p>`,
      snippet: `"Audio memo recording (${Math.round(duration)}s)"`,
      tags: ['audio', 'memo'],
      pinned: false,
      archived: false,
      trashed: false,
      color_wash: 'white',
      audio_url: audioUrl,
      audio_duration: duration,
      word_count: 0,
      reading_time: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await handleSaveNote(newAudioNote);
  };

  // Folders & Tags Handlers
  const handleCreateFolder = async (name: string, color?: string, parentId?: string | null) => {
    const newFolder: Folder = {
      id: `f-${Date.now()}`,
      name,
      color: color || '#8d4b00',
      parent_id: parentId || null,
      display_order: folders.length + 1,
      created_at: new Date().toISOString(),
    };
    await dbSaveFolder(newFolder);
    setFolders(prev => [...prev, newFolder]);
  };

  const handleCreateTag = async (name: string, color?: string) => {
    const newTag: Tag = {
      id: `t-${name}`,
      name,
      color: color || '#d97706',
    };
    await dbSaveTag(newTag);
    setTags(prev => [...prev, newTag]);
  };


  // If in Note Editor View
  if (editingNote) {
    return (
      <NoteEditor
        note={editingNote}
        folders={folders}
        onBack={() => {
          setEditingNote(null);
          refreshData();
        }}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
        onToggleArchive={handleToggleArchiveNote}
        onOpenVoiceRecorder={() => setIsVoiceRecorderOpen(true)}
      />
    );
  }

  // If in Checklist Detail View
  if (editingChecklist) {
    return (
      <ChecklistDetail
        checklist={editingChecklist}
        onBack={() => {
          setEditingChecklist(null);
          refreshData();
        }}
        onSaveChecklist={handleSaveChecklist}
        onDeleteChecklist={handleDeleteChecklist}
        onOpenVoiceRecorder={() => setIsVoiceRecorderOpen(true)}
      />
    );
  }

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        setSubView('none');
      }}
      syncStatus={syncStatus}
      folders={folders}
      onSelectFolder={() => {}}
      onOpenVaultManager={() => setIsVaultManagerOpen(true)}
      onNewNote={handleCreateNewNote}
    >
      {/* Subviews: Archive Box or Trash */}
      {subView !== 'none' ? (
        <ArchiveTrashView
          mode={subView}
          notes={notes}
          checklists={checklists}
          onBack={() => setSubView('none')}
          onRestoreNote={async (n) => {
            const restored = { ...n, archived: false, trashed: false, updated_at: new Date().toISOString() };
            await handleSaveNote(restored);
          }}
          onRestoreChecklist={async (c) => {
            const restored = { ...c, archived: false, trashed: false, updated_at: new Date().toISOString() };
            await handleSaveChecklist(restored);
          }}
          onPermanentDeleteNote={async (id) => {
            await dbDeleteNote(id);
            setNotes(prev => prev.filter(n => n.id !== id));
          }}
          onPermanentDeleteChecklist={async (id) => {
            await dbDeleteChecklist(id);
            setChecklists(prev => prev.filter(c => c.id !== id));
          }}
          onEmptyTrash={async () => {
            const trashedNotes = notes.filter(n => n.trashed);
            const trashedChecklists = checklists.filter(c => c.trashed);
            for (const n of trashedNotes) await dbDeleteNote(n.id);
            for (const c of trashedChecklists) await dbDeleteChecklist(c.id);
            refreshData();
          }}
        />
      ) : (
        <>
          {activeTab === 'notes' && (
            <NotesFeed
              notes={notes}
              checklists={checklists}
              onSelectNote={setEditingNote}
              onSelectChecklist={setEditingChecklist}
              onNewNote={handleCreateNewNote}
              onNewChecklist={handleCreateNewChecklist}
              onOpenVoiceRecorder={() => setIsVoiceRecorderOpen(true)}
              onTogglePinNote={handleTogglePinNote}
              onToggleArchiveNote={handleToggleArchiveNote}
              onDeleteNote={handleDeleteNote}
              onChangeColorWash={handleChangeColorWash}
            />
          )}

          {activeTab === 'checklists' && (
            <ChecklistsView
              checklists={checklists}
              onSelectChecklist={setEditingChecklist}
              onNewChecklist={handleCreateNewChecklist}
              onTogglePin={async (cl) => {
                const updated = { ...cl, pinned: !cl.pinned, updated_at: new Date().toISOString() };
                await handleSaveChecklist(updated);
              }}
            />
          )}

          {activeTab === 'folders' && (
            <FoldersView
              folders={folders}
              tags={tags}
              notes={notes}
              checklists={checklists}
              syncStatus={syncStatus}
              onSelectFolder={() => setActiveTab('notes')}
              onSelectTag={() => setActiveTab('notes')}
              onOpenVaultManager={() => setIsVaultManagerOpen(true)}
              onOpenArchive={() => setSubView('archive')}
              onOpenTrash={() => setSubView('trash')}
              onCreateFolder={handleCreateFolder}
              onCreateTag={handleCreateTag}
            />
          )}

          {activeTab === 'archive' && (
            <ArchiveTrashView
              mode="archive"
              notes={notes}
              checklists={checklists}
              onBack={() => setActiveTab('notes')}
              onRestoreNote={async (n) => {
                const restored = { ...n, archived: false, trashed: false, updated_at: new Date().toISOString() };
                await handleSaveNote(restored);
              }}
              onRestoreChecklist={async (c) => {
                const restored = { ...c, archived: false, trashed: false, updated_at: new Date().toISOString() };
                await handleSaveChecklist(restored);
              }}
              onPermanentDeleteNote={async (id) => {
                await dbDeleteNote(id);
                setNotes(prev => prev.filter(n => n.id !== id));
              }}
              onPermanentDeleteChecklist={async (id) => {
                await dbDeleteChecklist(id);
                setChecklists(prev => prev.filter(c => c.id !== id));
              }}
            />
          )}
        </>
      )}

      {/* Audio Recorder Modal */}
      <AudioRecorderModal
        isOpen={isVoiceRecorderOpen}
        onClose={() => setIsVoiceRecorderOpen(false)}
        onAudioRecorded={handleAudioRecorded}
      />

      {/* Vault Archival Manager Modal */}
      <VaultBackupModal
        isOpen={isVaultManagerOpen}
        onClose={() => setIsVaultManagerOpen(false)}
        onRefreshData={refreshData}
      />
    </AppShell>
  );
};

export default App;
