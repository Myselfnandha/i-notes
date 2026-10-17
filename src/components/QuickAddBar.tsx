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
    <section className="quick-add-section">
      <div className="quick-add-card">
        <form onSubmit={handleSubmit} className="quick-add-input-row">
          <div className="quick-type-selector">
            <button
              type="button"
              className={`type-chip ${activeType === 'note' ? 'active' : ''}`}
              onClick={() => setActiveType('note')}
            >
              <FileText size={14} />
              <span>Note</span>
            </button>
            <button
              type="button"
              className={`type-chip ${activeType === 'reminder' ? 'active' : ''}`}
              onClick={() => setActiveType('reminder')}
            >
              <Clock size={14} />
              <span>Reminder</span>
            </button>
            <button
              type="button"
              className={`type-chip ${activeType === 'link' || activeType === 'instagram' ? 'active' : ''}`}
              onClick={() => setActiveType('link')}
            >
              <LinkIcon size={14} />
              <span>Link / Reel</span>
            </button>
          </div>

          <div className="quick-input-box">
            <input
              type="text"
              placeholder="Quickly jot a note, reminder, or paste an Instagram link (e.g. instagram.com/reel/...)..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="quick-btn-go" title="Save Immediately">
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        {detectedUrl && (
          <div className="quick-detected-bar">
            <span className="detected-badge">
              <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
              Link Detected
            </span>
            <span className="detected-url">{detectedUrl}</span>
            <button
              type="button"
              className="save-link-btn"
              onClick={() => {
                onOpenWithUrl(detectedUrl);
                setText('');
              }}
            >
              Save With Full Preview
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
