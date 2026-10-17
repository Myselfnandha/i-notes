import React, { useState, useEffect, useRef } from 'react';
import {
  Item,
  ItemType,
  ColorAccent,
  PriorityLevel,
  RecurrenceRule,
  ChecklistTask,
  UrlMetadata
} from '../types';
import { fetchUrlMetadataApi } from '../services/api';

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
  const [deck, setDeck] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [color, setColor] = useState<ColorAccent>('paper');
  const [folder, setFolder] = useState<string>('Personal');
  const [isPinned, setIsPinned] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [recurrence, setRecurrence] = useState<RecurrenceRule>('none');
  const [checklist, setChecklist] = useState<ChecklistTask[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [metadata, setMetadata] = useState<UrlMetadata | null>(null);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [isDictating, setIsDictating] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingItem) {
      setType(editingItem.type);
      setTitle(editingItem.title);
      setDeck(editingItem.deck || '');
      setContent(editingItem.content || '');
      setUrl(editingItem.url || '');
      setTagsStr((editingItem.tags || []).join(', '));
      setColor(editingItem.color || 'paper');
      setFolder(editingItem.folderId || 'Personal');
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
      setDeck('');
      setContent('');
      setUrl('');
      setTagsStr('');
      setColor(defaultType === 'reminder' ? 'ochre' : 'paper');
      setFolder('Personal');
      setIsPinned(false);
      setChecklist([]);
      setMetadata(null);

      const nextDate = new Date(Date.now() + 2 * 3600000);
      nextDate.setMinutes(nextDate.getMinutes() - nextDate.getTimezoneOffset());
      setDueDate(nextDate.toISOString().slice(0, 16));
      setPriority('medium');
      setRecurrence('none');
    }
  }, [editingItem, defaultType, isOpen]);

  if (!isOpen) return null;

  // Word count & read time
  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readTimeMins = Math.max(1, Math.ceil(wordCount / 200));

  // Swatch tone color mapper
  const getCanvasBackground = () => {
    switch (color) {
      case 'oat':
        return 'var(--swatch-oat)';
      case 'sage':
        return 'var(--swatch-sage)';
      case 'ochre':
        return 'var(--swatch-ochre)';
      case 'terracotta':
        return 'var(--swatch-terracotta)';
      case 'lilac':
        return 'var(--swatch-lilac)';
      default:
        return 'var(--swatch-paper)';
    }
  };

  // Web Speech API Voice Dictation
  const toggleVoiceDictation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isDictating) {
      setIsDictating(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsDictating(true);
      recognition.onend = () => setIsDictating(false);
      recognition.onerror = () => setIsDictating(false);

      recognition.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult && lastResult[0]) {
          const spokenText = lastResult[0].transcript;
          setContent((prev) => (prev ? `${prev} ${spokenText}` : spokenText));
        }
      };

      recognition.start();
    } catch (e) {
      console.warn('Voice dictation error:', e);
      setIsDictating(false);
    }
  };

  const handleFetchPreview = async () => {
    const targetUrl = url.trim();
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
        setColor('terracotta');
      } else {
        setType('link');
        setColor('ochre');
      }
    } catch (e) {
      console.warn('Metadata preview error:', e);
    } finally {
      setFetchingMeta(false);
    }
  };

  const handleAddChecklistTask = () => {
    if (!newChecklistText.trim()) return;
    setChecklist([...checklist, { text: newChecklistText.trim(), done: false }]);
    setNewChecklistText('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const itemData: Partial<Item> = {
      id: editingItem?.id,
      type,
      title: title.trim() || (type === 'instagram' ? 'Saved Instagram Reel' : 'Untitled Thought'),
      deck: deck.trim() || undefined,
      content: content.trim(),
      url: url.trim(),
      metadata: metadata || undefined,
      folderId: folder,
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
    onClose();
  };

  return (
    <div className="editor-overlay" onClick={onClose}>
      <div
        className="editor-sheet"
        style={{ backgroundColor: getCanvasBackground() }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Breadcrumb & Status Navigation */}
        <div className="editor-top-nav">
          <div className="editor-breadcrumbs">
            <button
              type="button"
              className="card-action-btn"
              onClick={onClose}
              title="Close editor"
              aria-label="Back"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                arrow_back
              </span>
            </button>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)' }}>
              folder_open
            </span>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--on-surface)',
                cursor: 'pointer'
              }}
            >
              <option value="Personal">Personal</option>
              <option value="Work & Drafts">Work & Drafts</option>
              <option value="Book Ideas">Book Ideas</option>
              <option value="Recipes">Recipes</option>
              <option value="Archive">Archive</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="editor-autosave-status">
              <span className="sync-pulse connected" />
              <span>
                {wordCount} words · {readTimeMins} min read
              </span>
            </div>

            <button
              type="button"
              className={`card-action-btn ${isPinned ? 'active-pin' : ''}`}
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? 'Unpin' : 'Pin note'}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '18px',
                  fontVariationSettings: isPinned ? "'FILL' 1" : "'FILL' 0"
                }}
              >
                push_pin
              </span>
            </button>
          </div>
        </div>

        {/* Scrollable Paper Canvas */}
        <div className="editor-scroll-area">
          {/* Note Title Input */}
          <input
            type="text"
            className="editor-title-input"
            placeholder="Untitled Thought..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          {/* Editorial Subtitle / Deck (Optional) */}
          <input
            type="text"
            className="font-headline"
            style={{
              fontSize: '0.95rem',
              color: 'var(--primary)',
              fontStyle: 'italic',
              width: '100%'
            }}
            placeholder="Add an editorial quote or subtitle... (optional)"
            value={deck}
            onChange={(e) => setDeck(e.target.value)}
          />

          {/* Web URL / Instagram Link Field (if link/reel type) */}
          {(type === 'link' || type === 'instagram' || url) && (
            <div
              style={{
                display: 'flex',
                gap: 8,
                background: 'var(--surface-container-low)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                alignItems: 'center'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary)' }}>
                link
              </span>
              <input
                type="url"
                style={{ flex: 1, fontSize: '0.85rem', color: 'var(--on-surface)' }}
                placeholder="https://instagram.com/reel/... or web link"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                type="button"
                className="editorial-chip"
                style={{ padding: '3px 10px', fontSize: '0.72rem' }}
                onClick={handleFetchPreview}
                disabled={fetchingMeta}
              >
                {fetchingMeta ? 'Fetching...' : 'Preview'}
              </button>
            </div>
          )}

          {/* Note Body Textarea */}
          <textarea
            ref={textareaRef}
            className="editor-body-textarea"
            placeholder="Write freely. Your work is saved as you go..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Interactive Checklists Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Checklist Tasks ({checklist.filter((c) => c.done).length}/{checklist.length})
            </span>

            {checklist.map((task, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  className={`custom-checkbox ${task.done ? 'checked' : ''}`}
                  onClick={() => {
                    const next = [...checklist];
                    next[idx].done = !next[idx].done;
                    setChecklist(next);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {task.done && (
                    <span className="material-symbols-outlined" style={{ fontSize: '12px', fontWeight: 700 }}>
                      check
                    </span>
                  )}
                </span>
                <input
                  type="text"
                  style={{
                    flex: 1,
                    fontSize: '0.85rem',
                    textDecoration: task.done ? 'line-through' : 'none',
                    color: task.done ? 'var(--outline)' : 'var(--on-surface)'
                  }}
                  value={task.text}
                  onChange={(e) => {
                    const next = [...checklist];
                    next[idx].text = e.target.value;
                    setChecklist(next);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setChecklist(checklist.filter((_, i) => i !== idx))}
                  title="Remove task"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--outline)' }}>
                    close
                  </span>
                </button>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <input
                type="text"
                style={{
                  flex: 1,
                  background: 'var(--surface-container-low)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  color: 'var(--on-surface)'
                }}
                placeholder="+ Add checklist task and press enter..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistTask();
                  }
                }}
              />
              <button
                type="button"
                className="editorial-chip"
                onClick={handleAddChecklistTask}
              >
                Add
              </button>
            </div>
          </div>

          {/* Reminder Scheduler (if reminder type) */}
          {(type === 'reminder' || dueDate) && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                background: 'var(--surface-container-low)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                marginTop: 8
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 200 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary)' }}>
                  alarm
                </span>
                <input
                  type="datetime-local"
                  style={{ fontSize: '0.82rem', color: 'var(--on-surface)', width: '100%' }}
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    setType('reminder');
                  }}
                />
              </div>

              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as RecurrenceRule)}
                style={{ fontSize: '0.8rem', color: 'var(--on-surface)', cursor: 'pointer' }}
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekdays">Every weekday</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                style={{ fontSize: '0.8rem', color: 'var(--on-surface)', cursor: 'pointer' }}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          )}

          {/* Tags Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--outline)' }}>
              tag
            </span>
            <input
              type="text"
              style={{ flex: 1, fontSize: '0.82rem', color: 'var(--on-surface)' }}
              placeholder="Tags separated by commas (e.g. writing, ideas, draft)"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
            />
          </div>

          {/* Warm Pastel Swatch Palette Strip */}
          <div className="swatches-strip">
            <span style={{ fontSize: '0.72rem', color: 'var(--outline)', fontWeight: 600 }}>
              Paper Tone:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                className={`swatch-circle-btn ${color === 'paper' ? 'active' : ''}`}
                style={{ background: 'var(--swatch-paper)' }}
                onClick={() => setColor('paper')}
                title="Paper White"
              />
              <button
                type="button"
                className={`swatch-circle-btn ${color === 'oat' ? 'active' : ''}`}
                style={{ background: 'var(--swatch-oat)' }}
                onClick={() => setColor('oat')}
                title="Oat Linen"
              />
              <button
                type="button"
                className={`swatch-circle-btn ${color === 'sage' ? 'active' : ''}`}
                style={{ background: 'var(--swatch-sage)' }}
                onClick={() => setColor('sage')}
                title="Muted Sage"
              />
              <button
                type="button"
                className={`swatch-circle-btn ${color === 'ochre' ? 'active' : ''}`}
                style={{ background: 'var(--swatch-ochre)' }}
                onClick={() => setColor('ochre')}
                title="Warm Ochre"
              />
              <button
                type="button"
                className={`swatch-circle-btn ${color === 'terracotta' ? 'active' : ''}`}
                style={{ background: 'var(--swatch-terracotta)' }}
                onClick={() => setColor('terracotta')}
                title="Soft Terracotta"
              />
              <button
                type="button"
                className={`swatch-circle-btn ${color === 'lilac' ? 'active' : ''}`}
                style={{ background: 'var(--swatch-lilac)' }}
                onClick={() => setColor('lilac')}
                title="Dusty Lilac"
              />
            </div>
          </div>
        </div>

        {/* Bottom Formatting & Save Bar */}
        <div className="editor-bottom-bar">
          <div className="formatting-tools">
            <button
              type="button"
              className="format-btn"
              title="Add heading"
              onClick={() => setContent((prev) => `${prev}\n### `)}
            >
              <span className="font-headline" style={{ fontWeight: 700, fontSize: '15px' }}>
                H
              </span>
            </button>

            <button
              type="button"
              className="format-btn"
              title="Bold"
              onClick={() => setContent((prev) => `${prev} **bold text** `)}
            >
              <strong style={{ fontSize: '14px' }}>B</strong>
            </button>

            <button
              type="button"
              className="format-btn"
              title="Italic"
              onClick={() => setContent((prev) => `${prev} _italic text_ `)}
            >
              <em className="font-headline" style={{ fontSize: '14px' }}>
                I
              </em>
            </button>

            <button
              type="button"
              className="format-btn"
              title="Insert Checklist Item"
              onClick={() => {
                setChecklist([...checklist, { text: 'New task', done: false }]);
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                checklist
              </span>
            </button>

            <button
              type="button"
              className="format-btn"
              title="Quote Callout"
              onClick={() => setContent((prev) => `${prev}\n> “Spontaneous reflection...”\n`)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                format_quote
              </span>
            </button>

            <button
              type="button"
              className={`format-btn ${isDictating ? 'text-primary' : ''}`}
              title={isDictating ? 'Stop dictation' : 'Speech-to-text voice dictation'}
              onClick={toggleVoiceDictation}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '18px',
                  color: isDictating ? 'var(--error)' : 'var(--secondary)'
                }}
              >
                {isDictating ? 'mic_off' : 'mic'}
              </span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="editorial-chip active"
              onClick={() => handleSubmit()}
            >
              Save & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
