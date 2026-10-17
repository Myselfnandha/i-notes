import React, { useState } from 'react';
import { Item } from '../types';

interface FoldersViewProps {
  items: Item[];
  activeFolder: string | null;
  onSelectFolder: (folder: string | null) => void;
  onSelectTag: (tag: string) => void;
  onOpenCreate: () => void;
  onSelectQuickFilter: (filter: 'pinned' | 'reminders' | 'audio' | 'all') => void;
}

export const FoldersView: React.FC<FoldersViewProps> = ({
  items,
  activeFolder,
  onSelectFolder,
  onSelectTag,
  onOpenCreate,
  onSelectQuickFilter
}) => {
  const [openSubfolders, setOpenSubfolders] = useState<Record<string, boolean>>({
    personal: true
  });

  const toggleSub = (id: string) => {
    setOpenSubfolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Counts
  const noteCount = items.filter((i) => i.type === 'note' || !i.type).length;
  const checklistCount = items.filter((i) => (i.checklist?.length || 0) > 0).length;
  const audioCount = items.filter((i) => i.type === 'audio').length;
  const pinnedCount = items.filter((i) => i.is_pinned).length;
  const reminderCount = items.filter((i) => i.type === 'reminder').length;

  // Collect all unique tags and their counts
  const tagCounts: Record<string, number> = {};
  items.forEach((item) => {
    (item.tags || []).forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Overview & Vault Metric Card */}
      <div className="vault-overview-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--tertiary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                cloud_done
              </span>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Vault Overview
              </span>
            </div>
            <p className="font-headline" style={{ fontSize: '1.05rem', color: 'var(--on-surface)', marginTop: 4 }}>
              {noteCount} Notes <span style={{ color: 'var(--outline-variant)' }}>·</span>{' '}
              {checklistCount} Checklists <span style={{ color: 'var(--outline-variant)' }}>·</span>{' '}
              {audioCount} Audio
            </p>
          </div>
          <span
            className="card-badge"
            style={{ background: 'var(--surface-container-lowest)', color: 'var(--tertiary)' }}
          >
            <span className="sync-pulse connected" style={{ width: 6, height: 6 }} />
            Synced
          </span>
        </div>

        {/* Capacity & Storage Meter Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
          <div className="vault-meter-bar">
            <div className="meter-fill-notes" style={{ width: '55%' }} />
            <div className="meter-fill-media" style={{ width: '25%' }} />
            <div className="meter-fill-cache" style={{ width: '12%' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--outline)' }}>
            <span>Private Hugging Face Bucket · Offline Index Active</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Zero Local Server Needed</span>
          </div>
        </div>
      </div>

      {/* Quick Filters Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, padding: '0 2px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--on-surface-variant)' }}>
            Quick Filters
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--outline)' }}>4 smart views</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {/* 1. Pinned */}
          <div
            className="editorial-card"
            style={{ padding: 12, cursor: 'pointer' }}
            onClick={() => onSelectQuickFilter('pinned')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--secondary-fixed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--on-secondary-fixed-variant)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  keep
                </span>
              </div>
              <span className="font-headline" style={{ fontSize: '1.1rem' }}>
                {pinnedCount}
              </span>
            </div>
            <div style={{ marginTop: 8 }}>
              <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Pinned</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--outline)' }}>Priority desk items</p>
            </div>
          </div>

          {/* 2. Reminders */}
          <div
            className="editorial-card"
            style={{ padding: 12, cursor: 'pointer' }}
            onClick={() => onSelectQuickFilter('reminders')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--primary-fixed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  notifications_active
                </span>
              </div>
              <span className="font-headline" style={{ fontSize: '1.1rem' }}>
                {reminderCount}
              </span>
            </div>
            <div style={{ marginTop: 8 }}>
              <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Reminders</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--outline)' }}>Upcoming deadlines</p>
            </div>
          </div>
        </div>
      </div>

      {/* Folders Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, padding: '0 2px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--on-surface-variant)' }}>
            Folders
          </span>
          <button
            type="button"
            style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => onSelectFolder(null)}
          >
            Clear Filter
          </button>
        </div>

        <div className="folders-tree-card">
          {/* Folder 1: Personal Journal */}
          <div
            className="folder-tree-row"
            onClick={() => onSelectFolder(activeFolder === 'Personal' ? null : 'Personal')}
            style={{ background: activeFolder === 'Personal' ? 'var(--surface-container-high)' : undefined }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--secondary-fixed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  folder_open
                </span>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Personal Journal</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--outline)' }}>Reflections & dreams</p>
              </div>
            </div>
            <span className="chip-count">
              {items.filter((i) => i.folderId === 'Personal').length || 12}
            </span>
          </div>

          {/* Folder 2: Work & Drafts */}
          <div
            className="folder-tree-row"
            onClick={() => onSelectFolder(activeFolder === 'Work & Drafts' ? null : 'Work & Drafts')}
            style={{ background: activeFolder === 'Work & Drafts' ? 'var(--surface-container-high)' : undefined }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--primary-fixed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  folder
                </span>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Work & Drafts</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--outline)' }}>Product launch & tasks</p>
              </div>
            </div>
            <span className="chip-count">
              {items.filter((i) => i.folderId === 'Work & Drafts').length || 8}
            </span>
          </div>

          {/* Folder 3: Book Ideas */}
          <div
            className="folder-tree-row"
            onClick={() => onSelectFolder(activeFolder === 'Book Ideas' ? null : 'Book Ideas')}
            style={{ background: activeFolder === 'Book Ideas' ? 'var(--surface-container-high)' : undefined }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--tertiary-fixed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--tertiary)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  bookmark
                </span>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Book Ideas</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--outline)' }}>Reading list & quotes</p>
              </div>
            </div>
            <span className="chip-count">
              {items.filter((i) => i.folderId === 'Book Ideas').length || 5}
            </span>
          </div>

          {/* Folder 4: Recipes & Cookery */}
          <div
            className="folder-tree-row"
            onClick={() => onSelectFolder(activeFolder === 'Recipes' ? null : 'Recipes')}
            style={{ background: activeFolder === 'Recipes' ? 'var(--surface-container-high)' : undefined }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--surface-container-high)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--on-surface-variant)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  local_cafe
                </span>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Recipes & Cookery</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--outline)' }}>Coffee rituals & meals</p>
              </div>
            </div>
            <span className="chip-count">
              {items.filter((i) => i.folderId === 'Recipes').length || 4}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Tags Cloud */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, padding: '0 2px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--on-surface-variant)' }}>
            Tags & Labels
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--outline)' }}>
            {Object.keys(tagCounts).length} tags
          </span>
        </div>

        <div
          className="editorial-card"
          style={{ padding: 14, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}
        >
          {Object.entries(tagCounts).map(([tag, count]) => (
            <button
              key={tag}
              type="button"
              className="editorial-chip"
              style={{ fontSize: '0.74rem', padding: '4px 10px' }}
              onClick={() => onSelectTag(tag)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '12px', color: 'var(--primary)' }}>
                tag
              </span>
              <span>{tag}</span>
              <span className="chip-count">{count}</span>
            </button>
          ))}
          {Object.keys(tagCounts).length === 0 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>
              No tags yet. Add tags like #writing or #ideas in notes!
            </span>
          )}
        </div>
      </div>

      {/* Archival Quote Footer Element */}
      <div
        style={{
          textAlign: 'center',
          padding: '12px 16px',
          borderRadius: 'var(--radius-card)',
          background: 'var(--surface-container-low)'
        }}
      >
        <p className="font-headline" style={{ fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--on-surface-variant)' }}>
          “Order is the shape upon which thought expands.”
        </p>
        <p style={{ fontSize: '0.65rem', color: 'var(--outline)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Folio Archival System · v2.5
        </p>
      </div>
    </div>
  );
};
