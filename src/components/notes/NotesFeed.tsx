import React, { useState, useMemo } from 'react';
import {
  Search,
  Mic,
  SlidersHorizontal,
  Plus,
  Pin,
  Sparkles,
  BookOpen,
  CheckSquare,
  Volume2,
  Image as ImageIcon,
  FolderOpen,
  PenLine
} from 'lucide-react';
import { Note, Checklist, ColorWash } from '../../types';
import { NoteCard } from './NoteCard';
import { BrandLogo } from '../common/BrandLogo';

interface NotesFeedProps {
  notes: Note[];
  checklists: Checklist[];
  onSelectNote: (note: Note) => void;
  onSelectChecklist: (cl: Checklist) => void;
  onNewNote: () => void;
  onNewChecklist: () => void;
  onOpenVoiceRecorder: () => void;
  onTogglePinNote: (note: Note) => void;
  onToggleArchiveNote: (note: Note) => void;
  onDeleteNote: (note: Note) => void;
  onChangeColorWash?: (note: Note, wash: ColorWash) => void;
}

export const NotesFeed: React.FC<NotesFeedProps> = ({
  notes,
  checklists,
  onSelectNote,
  onSelectChecklist,
  onNewNote,
  onNewChecklist,
  onOpenVoiceRecorder,
  onTogglePinNote,
  onToggleArchiveNote,
  onDeleteNote,
  onChangeColorWash,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pinned' | 'work' | 'personal'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Active unarchived notes
  const activeNotes = useMemo(() => {
    return notes.filter(n => !n.archived && !n.trashed);
  }, [notes]);

  // Active unarchived checklists
  const activeChecklists = useMemo(() => {
    return checklists.filter(c => !c.archived && !c.trashed);
  }, [checklists]);

  // Filtered notes based on search & chips
  const filteredNotes = useMemo(() => {
    return activeNotes.filter(note => {
      const matchesSearch =
        searchQuery === '' ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.snippet && note.snippet.toLowerCase().includes(searchQuery.toLowerCase())) ||
        note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedTag && !note.tags.includes(selectedTag)) return false;

      if (activeFilter === 'pinned') return note.pinned;
      if (activeFilter === 'work') return note.tags.includes('work') || note.tags.includes('drafts');
      if (activeFilter === 'personal') return note.tags.includes('memoir') || note.tags.includes('reading') || note.tags.includes('travel');

      return true;
    });
  }, [activeNotes, searchQuery, activeFilter, selectedTag]);

  const pinnedNotes = useMemo(() => {
    return filteredNotes.filter(n => n.pinned);
  }, [filteredNotes]);

  const recentNotes = useMemo(() => {
    return filteredNotes.filter(n => !n.pinned);
  }, [filteredNotes]);

  const pinnedChecklists = useMemo(() => {
    return activeChecklists.filter(c => c.pinned && (
      searchQuery === '' || c.title.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [activeChecklists, searchQuery]);

  // Formatted date string for header
  const headerDateStr = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }, []);

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Top Header greeting */}
      <header className="pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size={42} />
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-medium text-ink-primary leading-tight">
              Good afternoon, Nandha
            </h1>
            <p className="text-xs text-ink-secondary">{headerDateStr}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-ochre/15 border border-ochre/30 flex items-center justify-center text-ochre font-serif font-bold text-sm shadow-resting">
            N
          </div>
        </div>
      </header>

      {/* Pill Search Bar */}
      <div className="mt-2 mb-4 relative">
        <div className="flex items-center gap-2 bg-recessed rounded-pill px-4 py-3 border border-transparent focus-within:border-ochre/50 focus-within:bg-white transition-all shadow-resting">
          <Search className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, tags, or voice..."
            className="w-full bg-transparent text-sm text-ink-primary placeholder:text-ink-tertiary placeholder:font-serif placeholder:italic focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-ink-tertiary hover:text-ink-primary px-1.5"
            >
              Clear
            </button>
          )}
          <button
            onClick={onOpenVoiceRecorder}
            title="Record Voice Memo"
            className="p-1 rounded-full text-ink-tertiary hover:text-ochre hover:bg-black/5"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            title="Filter options"
            className="p-1 rounded-full text-ink-tertiary hover:text-ink-primary hover:bg-black/5"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Notes' },
          { id: 'pinned', label: 'Pinned' },
          { id: 'work', label: 'Work & Drafts' },
          { id: 'personal', label: 'Personal' },
        ].map((chip) => {
          const isActive = activeFilter === chip.id && !selectedTag;
          return (
            <button
              key={chip.id}
              onClick={() => {
                setActiveFilter(chip.id as any);
                setSelectedTag(null);
              }}
              className={`px-4 py-2 rounded-pill font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1C1B1A] text-white shadow-resting'
                  : 'bg-recessed text-ink-secondary hover:bg-white hover:border-hairline'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Empty State when no notes exist */}
      {filteredNotes.length === 0 && pinnedChecklists.length === 0 && (
        <div className="mt-12 text-center py-12 px-6 bg-white/70 border border-hairline rounded-card shadow-resting">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-ochre/10 flex items-center justify-center text-ochre mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl text-ink-primary mb-2">Your Vault is Pristine</h2>
          <p className="text-sm text-ink-secondary max-w-sm mx-auto mb-6 leading-relaxed">
            Begin with a quiet reflection, an outline, or a quick task list.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onNewNote}
              className="px-6 py-3 rounded-full bg-ochre hover:bg-ochre-dark text-white text-sm font-medium flex items-center gap-2 shadow-lifted active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Note
            </button>
          </div>
        </div>
      )}

      {/* Pinned Section */}
      {(pinnedNotes.length > 0 || pinnedChecklists.length > 0) && (
        <section className="mt-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-ink-tertiary">
              <Pin className="w-3.5 h-3.5 fill-ochre text-ochre" />
              PINNED
            </div>
            <span className="text-xs text-ink-tertiary">
              {pinnedNotes.length + pinnedChecklists.length} pinned
            </span>
          </div>

          <div className="space-y-3">
            {/* Pinned Checklists (e.g. Weekend Market List from Screen 1) */}
            {pinnedChecklists.map((cl) => {
              const completedCount = cl.items.filter(i => i.completed).length;
              return (
                <div
                  key={cl.id}
                  onClick={() => onSelectChecklist(cl)}
                  className="bg-[#FAF5ED] border border-[#EAD7C1] rounded-card p-4 sm:p-5 shadow-resting hover:shadow-lifted transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-serif text-lg font-medium text-ink-primary">
                        {cl.title}
                      </h3>
                      {cl.reminder_time && (
                        <span className="text-xs text-ochre font-medium">
                          ⏰ {cl.reminder_time}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-ink-tertiary font-mono">
                      {completedCount} of {cl.items.length} completed
                    </span>
                  </div>

                  {/* Mini Task checklist items */}
                  <div className="space-y-1.5 mt-2">
                    {cl.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-xs text-ink-secondary">
                        <span className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[10px] ${
                          item.completed ? 'bg-ochre text-white' : 'border border-ink-tertiary'
                        }`}>
                          {item.completed ? '✓' : ''}
                        </span>
                        <span className={item.completed ? 'line-through text-ink-tertiary' : ''}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Pinned Notes */}
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onSelectNote}
                onTogglePin={onTogglePinNote}
                onToggleArchive={onToggleArchiveNote}
                onDelete={onDeleteNote}
                onChangeColorWash={onChangeColorWash}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent Notes Section (Masonry Staggered Grid) */}
      {recentNotes.length > 0 && (
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-ink-tertiary">
              RECENT NOTES
            </span>
            <span className="text-xs text-ink-tertiary cursor-pointer hover:text-ink-primary">
              Sort by Date ↓
            </span>
          </div>

          <div className="masonry-grid">
            {recentNotes.map((note) => (
              <div key={note.id} className="masonry-item">
                <NoteCard
                  note={note}
                  onEdit={onSelectNote}
                  onTogglePin={onTogglePinNote}
                  onToggleArchive={onToggleArchiveNote}
                  onDelete={onDeleteNote}
                  onChangeColorWash={onChangeColorWash}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Floating Action Dock (Screen 1 Quick-Capture Hub) */}
      <div className="fixed bottom-20 right-4 sm:right-8 z-40 flex flex-col items-center gap-2">
        <div className="bg-white/90 backdrop-blur-md border border-[#EBE8E1] rounded-full p-1.5 shadow-dock flex flex-col items-center gap-2">
          <button
            onClick={onNewChecklist}
            title="New Checklist"
            className="w-10 h-10 rounded-full hover:bg-recessed text-ink-secondary hover:text-ink-primary flex items-center justify-center transition-transform active:scale-90"
          >
            <CheckSquare className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenVoiceRecorder}
            title="Voice Memo"
            className="w-10 h-10 rounded-full hover:bg-recessed text-ink-secondary hover:text-ink-primary flex items-center justify-center transition-transform active:scale-90"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={onNewNote}
            title="Attach Photo / Note"
            className="w-10 h-10 rounded-full hover:bg-recessed text-ink-secondary hover:text-ink-primary flex items-center justify-center transition-transform active:scale-90"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <button
            onClick={onNewNote}
            title="Quick Note"
            className="w-12 h-12 rounded-full bg-ochre hover:bg-ochre-dark text-white flex items-center justify-center shadow-lifted transition-transform active:scale-95"
          >
            <PenLine className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
