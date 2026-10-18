import React, { useState, useMemo } from 'react';
import {
  Folder as FolderIcon,
  ChevronDown,
  ChevronRight,
  Pin,
  Bell,
  Mic,
  Lock,
  Plus,
  Archive,
  Trash2,
  Tag as TagIcon,
  HardDrive,
  RefreshCw,
  ExternalLink,
  Search,
  Check
} from 'lucide-react';
import { Folder, Tag, Note, Checklist, VaultStats } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

interface FoldersViewProps {
  folders: Folder[];
  tags: Tag[];
  notes: Note[];
  checklists: Checklist[];
  syncStatus: string;
  onSelectFolder: (folder: Folder | null) => void;
  onSelectTag: (tag: string) => void;
  onOpenVaultManager: () => void;
  onOpenArchive: () => void;
  onOpenTrash: () => void;
  onCreateFolder: (name: string, color?: string, parentId?: string | null) => void;
  onCreateTag: (name: string, color?: string) => void;
}

export const FoldersView: React.FC<FoldersViewProps> = ({
  folders,
  tags,
  notes,
  checklists,
  syncStatus,
  onSelectFolder,
  onSelectTag,
  onOpenVaultManager,
  onOpenArchive,
  onOpenTrash,
  onCreateFolder,
  onCreateTag,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#8d4b00');
  const [showNewTagModal, setShowNewTagModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  // Counts
  const notesCount = notes.filter(n => !n.trashed).length;
  const checklistsCount = checklists.filter(c => !c.trashed).length;
  const audioCount = notes.filter(n => n.audio_url && !n.trashed).length;
  const pinnedCount = notes.filter(n => n.pinned && !n.trashed).length + checklists.filter(c => c.pinned && !c.trashed).length;
  const remindersCount = checklists.filter(c => c.reminder_time && !c.trashed).length;
  const archivedCount = notes.filter(n => n.archived && !n.trashed).length + checklists.filter(c => c.archived && !c.trashed).length;
  const trashedCount = notes.filter(n => n.trashed).length + checklists.filter(c => c.trashed).length;

  const toggleExpand = (folderId: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const getNotesCountInFolder = (folderId: string) => {
    return notes.filter(n => n.folder_id === folderId && !n.trashed).length;
  };

  const getTagCount = (tagName: string) => {
    return notes.filter(n => n.tags.includes(tagName) && !n.trashed).length;
  };

  // Top level vs nested folders
  const rootFolders = folders.filter(f => !f.parent_id);
  const getSubFolders = (parentId: string) => folders.filter(f => f.parent_id === parentId);

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim(), newFolderColor);
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  const handleCreateTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    onCreateTag(newTagName.trim().toLowerCase());
    setNewTagName('');
    setShowNewTagModal(false);
  };

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Top Header */}
      <header className="pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size={42} />
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-medium text-ink-primary leading-tight">
              Folders & Vault
            </h1>
            <p className="text-xs text-ink-secondary">Archival Hierarchy</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenVaultManager}
            className="px-3 py-1.5 rounded-full bg-recessed hover:bg-white border border-hairline text-xs font-medium text-ink-secondary flex items-center gap-1.5 shadow-resting"
          >
            <HardDrive className="w-3.5 h-3.5 text-ochre" />
            Manage Vault
          </button>
        </div>
      </header>

      {/* Vault Overview Card */}
      <div className="mt-3 bg-white border border-hairline rounded-card p-5 shadow-resting">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold tracking-wider uppercase text-ink-tertiary flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-ochre" />
            VAULT OVERVIEW
          </span>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium">
            ● {syncStatus}
          </span>
        </div>

        <h2 className="font-serif text-xl sm:text-2xl text-ink-primary font-medium mb-3">
          {notesCount} Notes · {checklistsCount} Checklists · {audioCount} Audio
        </h2>

        {/* Multi-color storage bar */}
        <div className="w-full h-2 rounded-full bg-recessed flex overflow-hidden mb-2">
          <div
            className="bg-[#8d4b00] h-full transition-all duration-500"
            style={{ width: `${Math.min(50, notesCount * 4)}%` }}
          />
          <div
            className="bg-[#E0A96D] h-full transition-all duration-500"
            style={{ width: `${Math.min(30, checklistsCount * 5)}%` }}
          />
          <div
            className="bg-[#8A9A86] h-full transition-all duration-500"
            style={{ width: `${Math.min(20, audioCount * 10)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-ink-secondary">
          <span className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#8d4b00]" />
            {notesCount + checklistsCount === 0
              ? 'Pristine Vault · 2.0 GB available'
              : `${((notesCount * 12 + checklistsCount * 8 + audioCount * 120) / 1024).toFixed(1)} MB of 2.0 GB used`}
          </span>
          <button
            onClick={onOpenVaultManager}
            className="text-ochre hover:text-ochre-dark font-medium flex items-center gap-0.5"
          >
            Manage <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Filters (2x2 Grid from Screen 2) */}
      <section className="mt-6">
        <div className="flex items-center justify-between text-xs mb-3 text-ink-tertiary font-semibold tracking-wider uppercase">
          <span>QUICK FILTERS</span>
          <span>4 smart lists</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => onSelectTag('pinned')}
            className="bg-white border border-hairline rounded-card p-4 shadow-resting hover:shadow-lifted transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-full bg-[#E0A96D]/15 flex items-center justify-center text-ochre">
                <Pin className="w-4 h-4 fill-ochre" />
              </span>
              <span className="font-serif text-lg font-medium text-ink-primary">{pinnedCount}</span>
            </div>
            <div>
              <h3 className="font-serif font-medium text-sm text-ink-primary">Pinned</h3>
              <p className="text-[11px] text-ink-tertiary">Priority desk items</p>
            </div>
          </div>

          <div
            onClick={() => onSelectTag('reminders')}
            className="bg-white border border-hairline rounded-card p-4 shadow-resting hover:shadow-lifted transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-full bg-peach/20 flex items-center justify-center text-[#8d4b00]">
                <Bell className="w-4 h-4" />
              </span>
              <span className="font-serif text-lg font-medium text-ink-primary">{remindersCount}</span>
            </div>
            <div>
              <h3 className="font-serif font-medium text-sm text-ink-primary">Reminders</h3>
              <p className="text-[11px] text-ink-tertiary">Upcoming deadlines</p>
            </div>
          </div>

          <div
            onClick={() => onSelectTag('audio')}
            className="bg-white border border-hairline rounded-card p-4 shadow-resting hover:shadow-lifted transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center text-[#51604e]">
                <Mic className="w-4 h-4" />
              </span>
              <span className="font-serif text-lg font-medium text-ink-primary">{audioCount}</span>
            </div>
            <div>
              <h3 className="font-serif font-medium text-sm text-ink-primary">Audio Notes</h3>
              <p className="text-[11px] text-ink-tertiary">Voice dictations</p>
            </div>
          </div>

          <div className="bg-white border border-hairline rounded-card p-4 shadow-resting hover:shadow-lifted transition-all cursor-pointer flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-full bg-recessed flex items-center justify-center text-ink-tertiary">
                <Lock className="w-4 h-4" />
              </span>
              <span className="font-serif text-lg font-medium text-ink-primary">0</span>
            </div>
            <div>
              <h3 className="font-serif font-medium text-sm text-ink-primary">Locked</h3>
              <p className="text-[11px] text-ink-tertiary">Encrypted vaults</p>
            </div>
          </div>
        </div>
      </section>

      {/* Folders Section */}
      <section className="mt-6">
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-1.5 font-semibold tracking-wider uppercase text-ink-tertiary">
            <span>FOLDERS</span>
            <span className="px-1.5 py-0.5 rounded-full bg-recessed text-ink-secondary font-mono text-[10px]">
              {folders.length}
            </span>
          </div>
          <span className="text-xs text-ink-tertiary hover:text-ink-primary cursor-pointer">
            Reorder
          </span>
        </div>

        <div className="bg-white border border-hairline rounded-card divide-y divide-hairline shadow-resting overflow-hidden">
          {rootFolders.map((folder) => {
            const subFolders = getSubFolders(folder.id);
            const isExpanded = expandedFolders[folder.id];
            const count = getNotesCountInFolder(folder.id);

            return (
              <div key={folder.id} className="text-sm">
                <div
                  onClick={() => onSelectFolder(folder)}
                  className="px-4 py-3.5 flex items-center justify-between hover:bg-recessed/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: folder.color || '#8d4b00' }}
                    >
                      <FolderIcon className="w-4 h-4 fill-white" />
                    </span>
                    <div>
                      <h4 className="font-serif font-medium text-ink-primary text-base">
                        {folder.name}
                      </h4>
                      <p className="text-[11px] text-ink-tertiary">
                        {count} notes {subFolders.length > 0 ? `· ${subFolders.length} nested` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-recessed text-ink-secondary text-xs flex items-center justify-center font-mono">
                      {count}
                    </span>
                    {subFolders.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(folder.id);
                        }}
                        className="p-1 text-ink-tertiary hover:text-ink-primary"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub folders */}
                {isExpanded && subFolders.length > 0 && (
                  <div className="bg-[#FAF8F5] border-t border-hairline pl-12 pr-4 divide-y divide-hairline">
                    {subFolders.map((sub) => {
                      const subCount = getNotesCountInFolder(sub.id);
                      return (
                        <div
                          key={sub.id}
                          onClick={() => onSelectFolder(sub)}
                          className="py-2.5 flex items-center justify-between text-xs text-ink-secondary hover:text-ink-primary cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span>↳</span>
                            {sub.name}
                          </span>
                          <span className="font-mono text-ink-tertiary">{subCount}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setShowNewFolderModal(true)}
          className="mt-3 w-full py-3 rounded-card bg-[#F4F3EF] hover:bg-white border border-dashed border-[#D5CEBF] text-ink-secondary hover:text-ink-primary text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-resting"
        >
          <FolderIcon className="w-4 h-4 text-ochre" />
          + New Folder
        </button>
      </section>

      {/* Tags & Labels Section */}
      <section className="mt-6">
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-1.5 font-semibold tracking-wider uppercase text-ink-tertiary">
            <span>TAGS & LABELS</span>
            <span className="px-1.5 py-0.5 rounded-full bg-recessed text-ink-secondary font-mono text-[10px]">
              {tags.length} labels
            </span>
          </div>
          <button
            onClick={() => setShowNewTagModal(true)}
            className="text-xs text-ochre hover:text-ochre-dark font-medium"
          >
            + New Tag
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => {
            const count = getTagCount(tag.name);
            return (
              <button
                key={tag.id}
                onClick={() => onSelectTag(tag.name)}
                className="px-3.5 py-1.5 rounded-full bg-white border border-hairline text-xs font-medium text-ink-secondary hover:border-ochre hover:text-ink-primary flex items-center gap-1.5 shadow-resting transition-all"
              >
                <span className="text-ochre font-bold">#</span>
                <span>{tag.name}</span>
                <span className="ml-1 text-[10px] text-ink-tertiary font-mono bg-recessed px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Storage Maintenance Section */}
      <section className="mt-6">
        <div className="text-xs mb-3 font-semibold tracking-wider uppercase text-ink-tertiary">
          STORAGE MAINTENANCE
        </div>

        <div className="bg-white border border-hairline rounded-card divide-y divide-hairline shadow-resting overflow-hidden">
          <div
            onClick={onOpenArchive}
            className="px-4 py-3.5 flex items-center justify-between hover:bg-recessed/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-sage/20 text-[#51604e] flex items-center justify-center">
                <Archive className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-serif font-medium text-ink-primary text-sm">Archive Box</h4>
                <p className="text-[11px] text-ink-tertiary">Preserved notes hidden from main view</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-ink-tertiary">{archivedCount}</span>
              <ChevronRight className="w-4 h-4 text-ink-tertiary" />
            </div>
          </div>

          <div
            onClick={onOpenTrash}
            className="px-4 py-3.5 flex items-center justify-between hover:bg-recessed/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-medium text-ink-primary text-sm">Trash</h4>
                  <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                    30 days
                  </span>
                </div>
                <p className="text-[11px] text-ink-tertiary">Items are permanently removed after 30 days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-ink-tertiary">{trashedCount}</span>
              <ChevronRight className="w-4 h-4 text-ink-tertiary" />
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Quote Footer from Screen 2 */}
      <footer className="mt-12 text-center py-6 border-t border-hairline">
        <blockquote className="font-serif italic text-sm text-ink-secondary mb-1">
          “Order is the shape upon which thought expands.”
        </blockquote>
        <p className="text-[10px] uppercase font-mono tracking-widest text-ink-tertiary">
          I NOTES ARCHIVAL SYSTEM · V2.4
        </p>
      </footer>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-hairline rounded-sheet p-6 w-full max-w-sm shadow-sheet">
            <h3 className="font-serif text-xl font-medium text-ink-primary mb-4">Create New Folder</h3>
            <form onSubmit={handleCreateFolderSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-medium text-ink-secondary mb-1">Folder Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Travel Notes, Philosophy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-hairline bg-recessed focus:bg-white focus:outline-none focus:border-ochre text-sm"
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-ink-secondary mb-2">Folder Accent Hue</label>
                <div className="flex items-center gap-2">
                  {['#8d4b00', '#d97706', '#51604e', '#805521', '#ba1a1a', '#31302f'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewFolderColor(c)}
                      className={`w-6 h-6 rounded-full border border-black/10 transition-transform ${
                        newFolderColor === c ? 'scale-125 ring-2 ring-ochre' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-ink-secondary hover:bg-recessed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-ochre hover:bg-ochre-dark text-white text-xs font-medium shadow-lifted"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Tag Modal */}
      {showNewTagModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-hairline rounded-sheet p-6 w-full max-w-sm shadow-sheet">
            <h3 className="font-serif text-xl font-medium text-ink-primary mb-4">Add New Tag</h3>
            <form onSubmit={handleCreateTagSubmit}>
              <div className="mb-6">
                <label className="block text-xs font-medium text-ink-secondary mb-1">Tag Name</label>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-hairline bg-recessed focus-within:bg-white focus-within:border-ochre">
                  <span className="text-ochre font-bold">#</span>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="ideas"
                    className="w-full bg-transparent focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTagModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-ink-secondary hover:bg-recessed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-ochre hover:bg-ochre-dark text-white text-xs font-medium shadow-lifted"
                >
                  Add Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
