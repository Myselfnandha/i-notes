import React, { useState } from 'react';
import { ItemType } from '../types';

interface FloatingActionDockProps {
  onOpenCreate: (type: ItemType) => void;
  onQuickSaveText?: (text: string, type: ItemType) => void;
}

export const FloatingActionDock: React.FC<FloatingActionDockProps> = ({
  onOpenCreate,
  onQuickSaveText
}) => {
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [quickText, setQuickText] = useState('');
  const [quickType, setQuickType] = useState<ItemType>('note');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickText.trim()) return;

    if (onQuickSaveText) {
      onQuickSaveText(quickText.trim(), quickType);
    } else {
      onOpenCreate(quickType);
    }
    setQuickText('');
    setIsQuickOpen(false);
  };

  return (
    <div className="action-dock-container pb-safe">
      {isQuickOpen ? (
        <form
          onSubmit={handleQuickSubmit}
          className="action-dock-pill"
          style={{ width: '100%', maxWidth: '420px', gap: '8px' }}
        >
          <button
            type="button"
            className="dock-action-btn"
            onClick={() => setIsQuickOpen(false)}
            title="Cancel"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              close
            </span>
          </button>

          <input
            type="text"
            className="font-headline"
            style={{
              flex: 1,
              fontStyle: 'italic',
              fontSize: '0.95rem',
              color: 'var(--on-surface)'
            }}
            placeholder={
              quickType === 'checklist'
                ? 'Add checklist task...'
                : quickType === 'reminder'
                ? 'Remind me to...'
                : 'Write a thought...'
            }
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            autoFocus
          />

          <button
            type="submit"
            className="dock-primary-fab"
            style={{ width: '36px', height: '36px' }}
            title="Save thought"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              arrow_forward
            </span>
          </button>
        </form>
      ) : (
        <nav className="action-dock-pill" aria-label="Quick Actions Dock">
          {/* 1. Checklist Action */}
          <button
            type="button"
            className="dock-action-btn"
            onClick={() => onOpenCreate('checklist')}
            title="New Checklist"
            aria-label="New checklist"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '21px' }}>
              checklist
            </span>
          </button>

          {/* 2. Voice Audio Memo */}
          <button
            type="button"
            className="dock-action-btn"
            onClick={() => onOpenCreate('audio')}
            title="Voice Audio Memo"
            aria-label="Voice memo"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '21px', color: 'var(--secondary)' }}>
              mic
            </span>
          </button>

          {/* 3. Smart Reminder */}
          <button
            type="button"
            className="dock-action-btn"
            onClick={() => onOpenCreate('reminder')}
            title="Schedule Reminder"
            aria-label="Schedule reminder"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '21px', color: 'var(--primary)' }}>
              alarm
            </span>
          </button>

          {/* 4. Link & Instagram Reel */}
          <button
            type="button"
            className="dock-action-btn"
            onClick={() => onOpenCreate('link')}
            title="Bookmark Link or Reel"
            aria-label="Bookmark link"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '21px' }}>
              link
            </span>
          </button>

          {/* Vertical Divider */}
          <div className="dock-divider" />

          {/* 5. Circular Ochre Primary Button (+) */}
          <button
            type="button"
            className="dock-primary-fab"
            onClick={() => onOpenCreate('note')}
            title="Create New Note"
            aria-label="Create new note"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
              edit_note
            </span>
          </button>
        </nav>
      )}
    </div>
  );
};
