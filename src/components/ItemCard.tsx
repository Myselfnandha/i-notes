import React, { useState } from 'react';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onToggleChecklist: (itemId: string, index: number) => void;
  onSnooze: (id: string, mins: number) => void;
  onTagClick: (tag: string) => void;
  onCopyUrl: (url: string) => void;
  onPlayChime?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleComplete,
  onToggleChecklist,
  onSnooze,
  onTagClick,
  onCopyUrl,
  onPlayChime
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Map color to warm paper swatch
  const getSwatchClass = (color: string) => {
    switch (color) {
      case 'oat':
        return 'swatch-oat';
      case 'sage':
      case 'emerald':
        return 'swatch-sage';
      case 'ochre':
      case 'amber':
        return 'swatch-ochre';
      case 'terracotta':
      case 'rose':
        return 'swatch-terracotta';
      case 'lilac':
      case 'violet':
        return 'swatch-lilac';
      default:
        return 'swatch-paper';
    }
  };

  // Format relative timestamp
  const formatTime = (ts: number): string => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Reminder countdown calculation
  const getReminderState = () => {
    if (!item.due_date) return null;
    const now = Date.now();
    const due = new Date(item.due_date).getTime();
    const diffMins = Math.round((due - now) / 60000);

    if (item.is_completed) {
      return { text: 'Completed', isUrgent: false, isOverdue: false };
    }
    if (diffMins < 0) {
      const overHours = Math.floor(Math.abs(diffMins) / 60);
      const text =
        overHours > 0
          ? `Overdue by ${overHours}h ${Math.abs(diffMins) % 60}m`
          : `Overdue by ${Math.abs(diffMins)}m`;
      return { text, isUrgent: true, isOverdue: true };
    }
    if (diffMins <= 60) {
      return { text: `Due in ${diffMins}m`, isUrgent: true, isOverdue: false };
    }
    if (diffMins <= 1440) {
      const timeStr = new Date(due).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { text: `Today at ${timeStr}`, isUrgent: false, isOverdue: false };
    }
    return {
      text: new Date(due).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      isUrgent: false,
      isOverdue: false
    };
  };

  const reminderInfo = item.type === 'reminder' ? getReminderState() : null;

  // Checklist counts
  const totalChecklist = item.checklist?.length || 0;
  const completedChecklist = item.checklist?.filter((c) => c.done).length || 0;

  const handleAudioPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingAudio(true);
    if (onPlayChime) onPlayChime();
    setTimeout(() => setIsPlayingAudio(false), 2400);
  };

  return (
    <article
      className={`editorial-card ${getSwatchClass(item.color)}`}
      onClick={() => onEdit(item)}
      style={{ cursor: 'pointer' }}
    >
      {/* Card Top Metadata & Controls */}
      <div className="card-top-bar" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {item.type === 'reminder' && (
            <span className="card-badge reminder">
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                alarm
              </span>
              Reminder
            </span>
          )}

          {item.type === 'audio' && (
            <span className="card-badge" style={{ color: 'var(--primary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                graphic_eq
              </span>
              Voice Memo
            </span>
          )}

          {item.type === 'instagram' && (
            <span className="card-badge" style={{ color: 'var(--primary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                video_library
              </span>
              Instagram {item.metadata?.igType === 'reel' ? 'Reel' : 'Post'}
            </span>
          )}

          {item.type === 'link' && (
            <span className="card-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                link
              </span>
              {item.metadata?.siteName || 'Web Link'}
            </span>
          )}

          {item.priority === 'high' && (
            <span
              className="card-badge"
              style={{ background: 'var(--error-container)', color: 'var(--on-error-container)' }}
            >
              High
            </span>
          )}

          {item._offline_pending && (
            <span
              className="card-badge"
              style={{ background: 'var(--primary-fixed)', color: 'var(--on-primary-fixed)' }}
            >
              Queued
            </span>
          )}
        </div>

        {/* Quick Icon Actions */}
        <div className="card-actions-quick">
          <button
            type="button"
            className={`card-action-btn ${item.is_pinned ? 'active-pin' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(item.id);
            }}
            title={item.is_pinned ? 'Unpin' : 'Pin to top'}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '18px',
                fontVariationSettings: item.is_pinned ? "'FILL' 1" : "'FILL' 0"
              }}
            >
              push_pin
            </span>
          </button>

          <button
            type="button"
            className="card-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            title="Delete note"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              delete
            </span>
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="card-title">{item.title}</h3>

      {/* Editorial Deck / Subtitle */}
      {item.deck && <p className="card-deck">{item.deck}</p>}

      {/* Media Thumbnail (Instagram Reel or Web Link) */}
      {(item.type === 'instagram' || item.type === 'link') && item.metadata?.image && (
        <div
          className="card-media-preview"
          onClick={(e) => {
            e.stopPropagation();
            if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
          }}
        >
          <img src={item.metadata.image} alt="Preview" loading="lazy" />
          <div className="media-play-overlay">
            <div className="media-play-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                open_in_new
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Audio Waveform Simulator */}
      {item.type === 'audio' && (
        <div className="card-waveform-box" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="waveform-play-btn"
            onClick={handleAudioPlay}
            title={isPlayingAudio ? 'Playing chime...' : 'Play memo'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {isPlayingAudio ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <div className="waveform-bars">
            <div className="waveform-bar" style={{ height: '8px' }} />
            <div className="waveform-bar" style={{ height: '18px' }} />
            <div className="waveform-bar" style={{ height: '12px' }} />
            <div className="waveform-bar" style={{ height: '22px' }} />
            <div className="waveform-bar" style={{ height: '14px' }} />
            <div className="waveform-bar" style={{ height: '20px' }} />
            <div className="waveform-bar" style={{ height: '10px' }} />
            <div className="waveform-bar" style={{ height: '16px' }} />
            <div className="waveform-bar" style={{ height: '6px' }} />
          </div>
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--outline)' }}>
            {item.audio_duration || '0:45'}
          </span>
        </div>
      )}

      {/* Note Body Text */}
      {item.content && <p className="card-content">{item.content}</p>}

      {/* Interactive Checklists */}
      {totalChecklist > 0 && (
        <div className="card-checklist" onClick={(e) => e.stopPropagation()}>
          {item.checklist?.slice(0, 4).map((task, idx) => (
            <label key={idx} className="checklist-label">
              <span
                className={`custom-checkbox ${task.done ? 'checked' : ''}`}
                onClick={() => onToggleChecklist(item.id, idx)}
              >
                {task.done && (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '12px', fontWeight: 700 }}
                  >
                    check
                  </span>
                )}
              </span>
              <span
                className={`checklist-text ${task.done ? 'checked' : ''}`}
                onClick={() => onToggleChecklist(item.id, idx)}
              >
                {task.text}
              </span>
            </label>
          ))}
          {totalChecklist > 4 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--outline)', marginTop: 2 }}>
              +{totalChecklist - 4} more tasks
            </span>
          )}
        </div>
      )}

      {/* Smart Reminder Due Banner */}
      {reminderInfo && (
        <div className="card-reminder-banner" onClick={(e) => e.stopPropagation()}>
          <div className="banner-left">
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
              notifications_active
            </span>
            <span>{reminderInfo.text}</span>
          </div>
          {!item.is_completed && (
            <button
              type="button"
              className="banner-snooze-btn"
              onClick={() => onSnooze(item.id, 60)}
              title="Snooze for 1 hour"
            >
              +1h Snooze
            </button>
          )}
        </div>
      )}

      {/* Card Bottom: Tags & Relative Timestamp */}
      <div className="card-bottom-row" onClick={(e) => e.stopPropagation()}>
        <div className="card-tags-list">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="card-tag-pill"
              onClick={() => onTagClick(tag)}
              title={`Filter by #${tag}`}
            >
              #{tag}
            </span>
          ))}
          {totalChecklist > 0 && (
            <span
              className="card-tag-pill"
              style={{ background: 'var(--surface-container-high)', color: 'var(--secondary)' }}
            >
              {completedChecklist} of {totalChecklist} done
            </span>
          )}
        </div>

        <time>{formatTime(item.updated_at || item.created_at)}</time>
      </div>
    </article>
  );
};
