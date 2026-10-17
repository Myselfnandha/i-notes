import React, { useState, useEffect } from 'react';
import { Item, ItemType, ColorAccent, PriorityLevel, RecurrenceRule, ChecklistTask, UrlMetadata } from '../types';
import { fetchUrlMetadataApi } from '../services/api';
import { X, Loader2, Sparkles, Calendar, Tag, CheckSquare, Palette } from 'lucide-react';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Partial<Item>) => void;
  editingItem: Item | null;
  defaultType?: ItemType;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  defaultType = 'note'
}) => {
  const [type, setType] = useState<ItemType>(defaultType);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [color, setColor] = useState<ColorAccent>('slate');
  const [isPinned, setIsPinned] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [recurrence, setRecurrence] = useState<RecurrenceRule>('none');
  const [checklist, setChecklist] = useState<ChecklistTask[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [metadata, setMetadata] = useState<UrlMetadata | null>(null);
  const [fetchingMeta, setFetchingMeta] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setType(editingItem.type);
      setTitle(editingItem.title);
      setContent(editingItem.content || '');
      setUrl(editingItem.url || '');
      setTagsStr((editingItem.tags || []).join(', '));
      setColor(editingItem.color || 'slate');
      setIsPinned(editingItem.is_pinned);
      setChecklist(editingItem.checklist || []);
      setMetadata(editingItem.metadata || null);

      if (editingItem.due_date) {
        const d = new Date(editingItem.due_date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        setDueDate(d.toISOString().slice(0, 16));
      } else {
        setDueDate('');
      }
      setPriority(editingItem.priority || 'medium');
      setRecurrence(editingItem.reminder_recurrence || 'none');
    } else {
      setType(defaultType);
      setTitle('');
      setContent('');
      setUrl('');
      setTagsStr('');
      setColor(defaultType === 'instagram' ? 'rose' : (defaultType === 'link' ? 'cyan' : 'slate'));
      setIsPinned(false);
      setChecklist([]);
      setMetadata(null);

      // Default due date to 2 hours from now
      const nextDate = new Date(Date.now() + 2 * 3600000);
      nextDate.setMinutes(nextDate.getMinutes() - nextDate.getTimezoneOffset());
      setDueDate(nextDate.toISOString().slice(0, 16));
      setPriority('medium');
      setRecurrence('none');
    }
  }, [editingItem, defaultType, isOpen]);

  if (!isOpen) return null;

  const handleFetchPreview = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl || url).trim();
    if (!targetUrl) return;
    setFetchingMeta(true);
    try {
      const meta = await fetchUrlMetadataApi(targetUrl);
      setMetadata(meta);
      if (!title.trim() && meta.title) {
        setTitle(meta.title);
      }
      if (/instagram\.com/i.test(targetUrl)) {
        setType('instagram');
        setColor('rose');
      } else if (!type || type === 'note') {
        setType('link');
        setColor('cyan');
      }
    } catch (e) {
      console.warn('Metadata preview error:', e);
    } finally {
      setFetchingMeta(false);
    }
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    // If user pasted a full URL, auto-trigger metadata preview after a short debounce
    if (/^https?:\/\//i.test(newUrl.trim()) && !metadata) {
      if (/instagram\.com/i.test(newUrl)) {
        setType('instagram');
      }
    }
  };

  const handleAddChecklistTask = () => {
    if (!newChecklistText.trim()) return;
    setChecklist([...checklist, { text: newChecklistText.trim(), done: false }]);
    setNewChecklistText('');
  };

  const setPresetDueDate = (hoursAhead: number) => {
    const d = new Date(Date.now() + hoursAhead * 3600000);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setDueDate(d.toISOString().slice(0, 16));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const itemData: Partial<Item> = {
      id: editingItem?.id,
      type,
      title: title.trim() || (type === 'instagram' ? 'Saved Instagram Reel' : 'Untitled Note'),
      content: content.trim(),
      url: url.trim(),
      metadata: metadata || undefined,
      tags,
      color,
      is_pinned: isPinned,
      checklist
    };

    if (type === 'reminder') {
      itemData.due_date = dueDate ? new Date(dueDate).toISOString() : null;
      itemData.priority = priority;
      itemData.reminder_recurrence = recurrence;
    }

    onSave(itemData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.2rem' }}>
              {editingItem ? '✏️' : '✨'}
            </span>
            <h3>{editingItem ? 'Edit Item' : 'Create New Item'}</h3>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Type Switcher Tabs */}
        <div className="modal-type-tabs">
          <button
            type="button"
            className={`modal-tab ${type === 'note' ? 'active' : ''}`}
            onClick={() => setType('note')}
          >
            <span>📝 Note</span>
          </button>
          <button
            type="button"
            className={`modal-tab ${type === 'reminder' ? 'active' : ''}`}
            onClick={() => setType('reminder')}
          >
            <span>⏰ Reminder</span>
          </button>
          <button
            type="button"
            className={`modal-tab ${type === 'instagram' ? 'active' : ''}`}
            onClick={() => { setType('instagram'); setColor('rose'); }}
          >
            <span>📸 Instagram Reel</span>
          </button>
          <button
            type="button"
            className={`modal-tab ${type === 'link' ? 'active' : ''}`}
            onClick={() => { setType('link'); setColor('cyan'); }}
          >
            <span>🌐 Web Bookmark</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* URL Input (for Link and Instagram) */}
          {(type === 'link' || type === 'instagram') && (
            <div className="form-group">
              <label htmlFor="formUrl">
                {type === 'instagram' ? 'Instagram Reel or Post URL' : 'Website URL'}
              </label>
              <div className="url-fetch-wrap">
                <input
                  type="url"
                  id="formUrl"
                  placeholder={type === 'instagram' ? 'https://www.instagram.com/reel/C8qXYZ123/...' : 'https://example.com/article...'}
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  autoFocus
                />
                <button type="button" className="fetch-btn" onClick={() => handleFetchPreview()} disabled={fetchingMeta}>
                  {fetchingMeta ? <Loader2 size={16} className="spinner" /> : <span>Fetch Preview</span>}
                </button>
              </div>

              {metadata && (
                <div className="url-preview-box">
                  {metadata.image && (
                    <div className="preview-thumb-wrap">
                      <img src={metadata.image} alt="Preview" />
                    </div>
                  )}
                  <div className="preview-details">
                    <span className="preview-site">{metadata.siteName || 'Scraped Link Details'}</span>
                    <h5 className="preview-title">{metadata.title}</h5>
                    {metadata.description && <p className="preview-desc">{metadata.description}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label htmlFor="formTitle">Title</label>
            <input
              type="text"
              id="formTitle"
              placeholder="e.g. Project brainstorm / Doctor visit at 4 PM / Instagram Desk Setup"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Content / Markdown Textarea */}
          <div className="form-group">
            <label htmlFor="formContent">Notes & Details (Markdown supported)</label>
            <textarea
              id="formContent"
              rows={4}
              placeholder="Type notes, key takeaways, links, or instructions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Interactive Checklist Manager */}
          <div className="form-group">
            <label>
              <CheckSquare size={14} style={{ display: 'inline', marginRight: 4 }} />
              Checklist Tasks ({checklist.length})
            </label>
            {checklist.length > 0 && (
              <div className="checklist-items">
                {checklist.map((item, idx) => (
                  <div key={idx} className="checklist-form-item">
                    <span>{item.text}</span>
                    <button
                      type="button"
                      className="checklist-del-btn"
                      onClick={() => setChecklist(checklist.filter((_, i) => i !== idx))}
                      title="Remove task"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="checklist-add-row">
              <input
                type="text"
                placeholder="Add task and press Enter..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistTask();
                  }
                }}
              />
              <button type="button" className="add-sub-btn" onClick={handleAddChecklistTask}>
                + Add
              </button>
            </div>
          </div>

          {/* Reminder Specific Fields */}
          {type === 'reminder' && (
            <div className="reminder-fields">
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="formDueDate">
                    <Calendar size={14} style={{ display: 'inline', marginRight: 4 }} />
                    Due Date & Time
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button type="button" className="pill-btn secondary small" onClick={() => setPresetDueDate(1)}>
                      +1h
                    </button>
                    <button type="button" className="pill-btn secondary small" onClick={() => setPresetDueDate(3)}>
                      +3h
                    </button>
                    <button type="button" className="pill-btn secondary small" onClick={() => setPresetDueDate(24)}>
                      Tomorrow
                    </button>
                  </div>
                </div>
                <input
                  type="datetime-local"
                  id="formDueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label htmlFor="formPriority">Priority Level</label>
                  <select
                    id="formPriority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority (Urgent)</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label htmlFor="formRecurrence">Repeat Cycle</label>
                  <select
                    id="formRecurrence"
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as RecurrenceRule)}
                  >
                    <option value="none">One-time (Does not repeat)</option>
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays (Mon-Fri)</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Color & Tags */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label>
                <Palette size={14} style={{ display: 'inline', marginRight: 4 }} />
                Card Color Theme
              </label>
              <div className="color-picker-row">
                {(['slate', 'emerald', 'cyan', 'amber', 'rose', 'violet'] as ColorAccent[]).map((c) => (
                  <label key={c} className="color-radio" title={c}>
                    <input
                      type="radio"
                      name="colorAccent"
                      value={c}
                      checked={color === c}
                      onChange={() => setColor(c)}
                    />
                    <span className={`color-dot color-${c}`} />
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="formTags">
                <Tag size={14} style={{ display: 'inline', marginRight: 4 }} />
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="formTags"
                placeholder="Work, Ideas, Health, Instagram"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
              />
            </div>
          </div>

          {/* Pin Option */}
          <div className="form-options-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              <span>📌 Pin this item to top of the feed</span>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="pill-btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="pill-btn primary">
              {editingItem ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
