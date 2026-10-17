import React, { useState } from 'react';
import { Item } from '../types';
import { Pin, Edit3, Trash2, ExternalLink, Play, Copy, Check, Clock, AlertCircle, Share2, Eye } from 'lucide-react';

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
  onCopyUrl
}) => {
  const [copied, setCopied] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);

  // Format relative time
  const formatTime = (ts: number): string => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Reminder countdown logic
  const getReminderCountdown = () => {
    if (!item.due_date) return { text: 'No due date', urgency: 'upcoming' };
    const now = Date.now();
    const due = new Date(item.due_date).getTime();
    const diffMins = Math.round((due - now) / 60000);

    if (item.is_completed) {
      return { text: 'Completed ✓', urgency: 'completed' };
    }
    if (diffMins < 0) {
      const overHours = Math.floor(Math.abs(diffMins) / 60);
      const text = overHours > 0 ? `Overdue by ${overHours}h ${Math.abs(diffMins) % 60}m` : `Overdue by ${Math.abs(diffMins)}m`;
      return { text, urgency: 'urgent' };
    }
    if (diffMins <= 60) {
      return { text: `Due in ${diffMins} mins`, urgency: 'urgent' };
    }
    if (diffMins <= 1440) {
      const timeStr = new Date(due).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { text: `Today at ${timeStr}`, urgency: 'today' };
    }
    return {
      text: new Date(due).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      urgency: 'upcoming'
    };
  };

  const reminderInfo = item.type === 'reminder' ? getReminderCountdown() : null;

  // Checklist calculations
  const totalChecklist = item.checklist?.length || 0;
  const completedChecklist = item.checklist?.filter(c => c.done).length || 0;
  const checklistPercent = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

  // Word count & read time for notes
  const wordCount = item.content ? item.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readTimeMins = Math.ceil(wordCount / 200);

  const handleCopyContent = () => {
    const textToCopy = item.url ? item.url : `${item.title}\n\n${item.content || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className={`item-card color-${item.color || 'slate'} type-${item.type} ${item.is_pinned ? 'is-pinned-card' : ''}`}>
      {/* Top Header: Badge + Actions */}
      <div className="card-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {item.type === 'note' && <span className="card-badge type-note">📝 Note</span>}
          {item.type === 'reminder' && <span className="card-badge type-reminder">⏰ Reminder</span>}
          {item.type === 'instagram' && (
            <span className="card-badge type-instagram">
              📸 Instagram {item.metadata?.igType === 'reel' ? 'Reel' : 'Post'}
            </span>
          )}
          {item.type === 'link' && <span className="card-badge type-link">🌐 Link</span>}

          {item.priority === 'high' && (
            <span className="priority-tag high" title="High Priority">
              🔴 High
            </span>
          )}
          {item.priority === 'low' && (
            <span className="priority-tag low" title="Low Priority">
              🟢 Low
            </span>
          )}
        </div>

        <div className="card-top-actions">
          {item._offline_pending && (
            <span className="offline-pending-badge" title="Pending sync to cloud backend">
              ⏳ Queued
            </span>
          )}

          <button
            className={`card-icon-btn ${item.is_pinned ? 'pinned' : ''}`}
            title={item.is_pinned ? 'Unpin note' : 'Pin to top of list'}
            onClick={() => onTogglePin(item.id)}
          >
            <Pin size={15} fill={item.is_pinned ? 'currentColor' : 'none'} />
          </button>
          <button className="card-icon-btn" title="Edit Item" onClick={() => onEdit(item)}>
            <Edit3 size={15} />
          </button>
          <button className="card-icon-btn danger" title="Delete" onClick={() => onDelete(item.id)}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="card-title">{item.title}</h3>

      {/* Instagram Media Card */}
      {item.type === 'instagram' && (
        <div className="instagram-card-body">
          {!showEmbed ? (
            <div className="ig-media-thumb" onClick={() => setShowEmbed(true)}>
              <img
                src={item.metadata?.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                alt="Instagram Preview"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="ig-play-overlay">
                <div className="ig-play-circle" title="Play / Preview Reel">
                  <Play size={18} fill="#000" />
                </div>
              </div>
            </div>
          ) : (
            <div className="ig-embed-frame">
              {item.metadata?.embedUrl ? (
                <iframe
                  src={item.metadata.embedUrl}
                  title="Instagram Embed"
                  allowTransparency
                  frameBorder="0"
                  scrolling="no"
                  style={{ width: '100%', minHeight: '380px', borderRadius: '12px' }}
                />
              ) : (
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <p>Preview player requires opening Instagram.</p>
                </div>
              )}
              <button
                type="button"
                className="banner-btn secondary"
                style={{ width: '100%', marginTop: 8, fontSize: '0.78rem' }}
                onClick={() => setShowEmbed(false)}
              >
                Close Interactive Embed
              </button>
            </div>
          )}

          <div className="ig-action-bar">
            <a
              href={item.metadata?.cleanUrl || item.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="open-ig-btn"
            >
              <ExternalLink size={14} />
              <span>Open in Instagram</span>
            </a>
            {item.metadata?.embedUrl && !showEmbed && (
              <button className="copy-url-btn" onClick={() => setShowEmbed(true)}>
                <Eye size={13} style={{ display: 'inline', marginRight: 4 }} />
                Preview
              </button>
            )}
            {item.url && (
              <button className="copy-url-btn" onClick={() => onCopyUrl(item.url!)}>
                <Copy size={13} style={{ display: 'inline', marginRight: 4 }} />
                Copy
              </button>
            )}
          </div>
        </div>
      )}

      {/* Website Link Bookmark Card */}
      {item.type === 'link' && (
        <div className="link-card-body">
          {item.metadata?.image && (
            <div className="link-thumb">
              <img src={item.metadata.image} alt="Site Thumbnail" loading="lazy" />
            </div>
          )}
          <div className="link-info">
            <div className="link-domain">
              {item.metadata?.favicon && (
                <img
                  className="domain-favicon"
                  src={item.metadata.favicon}
                  alt="Favicon"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}
              <span>{item.metadata?.siteName || (item.url ? new URL(item.url).hostname : 'Web Link')}</span>
            </div>
            {item.metadata?.description && <p className="link-desc">{item.metadata.description}</p>}
          </div>
          <div className="ig-action-bar">
            <a
              href={item.metadata?.cleanUrl || item.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn primary small"
            >
              <ExternalLink size={13} style={{ display: 'inline', marginRight: 4 }} />
              Visit Website
            </a>
            {item.url && (
              <button className="copy-url-btn" onClick={() => onCopyUrl(item.url!)}>
                Copy Link
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reminder Strip */}
      {item.type === 'reminder' && reminderInfo && (
        <div className="reminder-status-strip">
          <div className={`due-countdown ${reminderInfo.urgency}`}>
            <Clock size={15} />
            <span>{reminderInfo.text}</span>
          </div>
          <div className="reminder-quick-actions" style={{ position: 'relative' }}>
            {!item.is_completed && (
              <div style={{ display: 'inline-block', position: 'relative' }}>
                <button
                  type="button"
                  className="snooze-btn"
                  onClick={() => setShowSnoozeMenu(!showSnoozeMenu)}
                  title="Snooze reminder"
                >
                  Snooze
                </button>
                {showSnoozeMenu && (
                  <div className="snooze-dropdown">
                    <button onClick={() => { onSnooze(item.id, 15); setShowSnoozeMenu(false); }}>+15 minutes</button>
                    <button onClick={() => { onSnooze(item.id, 60); setShowSnoozeMenu(false); }}>+1 hour</button>
                    <button onClick={() => { onSnooze(item.id, 1440); setShowSnoozeMenu(false); }}>Tomorrow</button>
                  </div>
                )}
              </div>
            )}
            <button
              className={`pill-btn small ${item.is_completed ? 'secondary' : 'success'}`}
              onClick={() => onToggleComplete(item.id)}
            >
              {item.is_completed ? 'Undo' : 'Done ✓'}
            </button>
          </div>
        </div>
      )}

      {/* Content / Markdown Text */}
      {item.content && (
        <div className="card-content">
          <div className="content-markdown">{item.content}</div>
          {item.type === 'note' && wordCount > 0 && (
            <div className="word-count-tag">
              {wordCount} {wordCount === 1 ? 'word' : 'words'} • {readTimeMins}m read
            </div>
          )}
        </div>
      )}

      {/* Interactive Checklist with Progress Bar */}
      {totalChecklist > 0 && (
        <div className="card-checklist-container">
          <div className="checklist-progress-bar">
            <div className="progress-fill" style={{ width: `${checklistPercent}%` }}></div>
          </div>
          <div className="checklist-header-row">
            <span className="checklist-stats">
              {completedChecklist} of {totalChecklist} done ({checklistPercent}%)
            </span>
          </div>
          <div className="card-checklist">
            {item.checklist!.map((task, index) => (
              <label key={index} className={`checklist-row ${task.done ? 'done' : ''}`}>
                <input
                  type="checkbox"
                  className="checklist-checkbox"
                  checked={task.done}
                  onChange={() => onToggleChecklist(item.id, index)}
                />
                <span className="checklist-text">{task.text}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {Array.isArray(item.tags) && item.tags.length > 0 && (
        <div className="card-tags">
          {item.tags.map((tag) => (
            <span key={tag} className="card-tag" onClick={() => onTagClick(tag)}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="card-footer">
        <span>Updated {formatTime(item.updated_at)}</span>
        <div className="card-footer-actions">
          <button className="btn-card-action" onClick={handleCopyContent} title="Copy note text or URL to clipboard">
            {copied ? (
              <>
                <Check size={13} style={{ display: 'inline', marginRight: 4, color: '#10b981' }} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={13} style={{ display: 'inline', marginRight: 4 }} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
