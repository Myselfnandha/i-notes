import React, { useState } from 'react';
import { FileText, Clock, Link as LinkIcon, ArrowRight, Sparkles } from 'lucide-react';
import { ItemType } from '../types';

interface QuickAddBarProps {
  onQuickSubmit: (text: string, type: ItemType, detectedUrl: string | null) => void;
  onOpenWithUrl: (url: string) => void;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({ onQuickSubmit, onOpenWithUrl }) => {
  const [activeType, setActiveType] = useState<ItemType>('note');
  const [text, setText] = useState('');

  const extractUrl = (str: string): string | null => {
    const match = str.match(/(https?:\/\/[^\s]+)/i);
    return match ? match[0] : null;
  };

  const detectedUrl = extractUrl(text);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    let finalType = activeType;
    if (detectedUrl) {
      finalType = /instagram\.com/i.test(detectedUrl) ? 'instagram' : 'link';
    }

    onQuickSubmit(text.trim(), finalType, detectedUrl);
    setText('');
  };

  return (
    <section className="capture-box">
      <form onSubmit={handleSubmit} className="capture-form">
        <div className="capture-type-row">
          <button
            type="button"
            className={`capture-chip ${activeType === 'note' ? 'active' : ''}`}
            onClick={() => setActiveType('note')}
          >
            <FileText size={13} />
            <span>Note</span>
          </button>
          <button
            type="button"
            className={`capture-chip ${activeType === 'reminder' ? 'active' : ''}`}
            onClick={() => setActiveType('reminder')}
          >
            <Clock size={13} />
            <span>Reminder</span>
          </button>
          <button
            type="button"
            className={`capture-chip ${activeType === 'link' || activeType === 'instagram' ? 'active' : ''}`}
            onClick={() => setActiveType('link')}
          >
            <LinkIcon size={13} />
            <span>Link / Reel</span>
          </button>
        </div>

        <div className="capture-input-row">
          <input
            type="text"
            className="capture-input"
            placeholder={
              activeType === 'reminder'
                ? 'Set a reminder... (e.g. Call dentist tomorrow at 4pm)'
                : activeType === 'link'
                ? 'Paste an Instagram reel or web URL...'
                : 'Quick jot a note or thought...'
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="capture-submit-btn" title="Save" aria-label="Save">
            <ArrowRight size={17} />
          </button>
        </div>

        {detectedUrl && (
          <div className="detected-link-bar">
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
              <Sparkles size={13} style={{ color: 'var(--accent-cyan)' }} />
              Link:
            </span>
            <span className="detected-link-text">{detectedUrl}</span>
            <button
              type="button"
              className="strip-btn"
              style={{ background: 'var(--accent-rose)', color: '#fff', border: 'none' }}
              onClick={() => {
                onOpenWithUrl(detectedUrl);
                setText('');
              }}
            >
              Preview & Save
            </button>
          </div>
        )}
      </form>
    </section>
  );
};
