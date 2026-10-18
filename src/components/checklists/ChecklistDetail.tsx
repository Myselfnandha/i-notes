import React, { useState } from 'react';
import {
  ArrowLeft,
  Pin,
  Bell,
  SlidersHorizontal,
  GripVertical,
  Check,
  Plus,
  Volume2,
  Paperclip,
  Share2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Users,
  Eye,
  Clock,
  Mic,
  MoreVertical
} from 'lucide-react';
import { Checklist, ChecklistItem, ColorWash } from '../../types';
import { WaveformPlayer } from '../audio/WaveformPlayer';
import { BrandLogo } from '../common/BrandLogo';

interface ChecklistDetailProps {
  checklist: Checklist;
  onBack: () => void;
  onSaveChecklist: (updated: Checklist) => void;
  onDeleteChecklist: (cl: Checklist) => void;
  onOpenVoiceRecorder: () => void;
}

export const ChecklistDetail: React.FC<ChecklistDetailProps> = ({
  checklist,
  onBack,
  onSaveChecklist,
  onDeleteChecklist,
  onOpenVoiceRecorder,
}) => {
  const [items, setItems] = useState<ChecklistItem[]>(checklist.items || []);
  const [title, setTitle] = useState(checklist.title);
  const [subtitle, setSubtitle] = useState(checklist.subtitle || '');
  const [category, setCategory] = useState(checklist.category || 'General');
  const [pinned, setPinned] = useState(checklist.pinned);
  const [reminderTime, setReminderTime] = useState(checklist.reminder_time || '');
  const [reminderLocation, setReminderLocation] = useState(checklist.reminder_location || '');
  const [newItemText, setNewItemText] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Sync to parent
  const syncUpdate = (newItems: ChecklistItem[], newPinned = pinned, newTitle = title, newSub = subtitle) => {
    const updated: Checklist = {
      ...checklist,
      title: newTitle,
      subtitle: newSub,
      category,
      pinned: newPinned,
      reminder_time: reminderTime,
      reminder_location: reminderLocation,
      items: newItems,
      updated_at: new Date().toISOString(),
    };
    onSaveChecklist(updated);
  };

  const toggleItemCompleted = (itemId: string) => {
    const next = items.map(i => i.id === itemId ? { ...i, completed: !i.completed } : i);
    setItems(next);
    syncUpdate(next);
  };

  const handleAddItem = (e: React.FormEvent, customPriority?: string) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      text: newItemText.trim(),
      completed: false,
      priority: (customPriority as 'High' | 'Medium' | 'Normal') || null,
      order: items.length,
    };
    const next = [...items, newItem];
    setItems(next);
    setNewItemText('');
    syncUpdate(next);
  };

  const deleteItem = (itemId: string) => {
    const next = items.filter(i => i.id !== itemId);
    setItems(next);
    syncUpdate(next);
  };

  // Drag and drop reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const reordered = [...items];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, moved);
    setDraggedIndex(index);
    setItems(reordered);
    syncUpdate(reordered);
  };

  const inProgressItems = items.filter(i => !i.completed);
  const completedItems = items.filter(i => i.completed);
  const totalCount = items.length;
  const completedCount = completedItems.length;
  const percentCompleted = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#FBFBFA] pb-28">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-hairline px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-black/5"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <BrandLogo size={24} />
            <span className="font-serif font-medium text-base text-ink-primary">
              Checklists
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const nextPin = !pinned;
              setPinned(nextPin);
              syncUpdate(items, nextPin);
            }}
            className={`p-2 rounded-full transition-colors ${
              pinned ? 'text-ochre bg-ochre/10' : 'text-ink-secondary hover:text-ink-primary hover:bg-black/5'
            }`}
          >
            <Pin className={`w-4 h-4 ${pinned ? 'fill-ochre' : ''}`} />
          </button>
          <button
            onClick={() => onDeleteChecklist(checklist)}
            className="p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-ochre/15 border border-ochre/30 flex items-center justify-center text-ochre font-serif font-bold text-xs">
            N
          </div>
        </div>
      </header>

      {/* Main Checklist Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-5">
        {/* Category Pill */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 rounded-full bg-[#EAD7C1]/40 text-[#8d4b00] text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ochre" />
            CHECKLIST · {category}
          </span>
        </div>

        {/* Smart Scheduled Reminder Card (when set) */}
        {reminderTime && (
          <div className="mb-5 bg-white border border-hairline rounded-2xl p-4 shadow-resting">
            <div className="flex items-center justify-between text-xs text-ochre font-medium mb-1">
              <span className="flex items-center gap-1.5 font-semibold">
                <Bell className="w-4 h-4" />
                Scheduled Reminder
              </span>
              <span className="flex items-center gap-1 text-ink-tertiary">
                <Clock className="w-3.5 h-3.5" />
                Active
              </span>
            </div>
            <div className="text-sm font-semibold text-ink-primary">
              {reminderTime} {reminderLocation ? `· ${reminderLocation}` : ''}
            </div>
          </div>
        )}

        {/* Checklist Title & Subtitle */}
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            syncUpdate(items, pinned, e.target.value, subtitle);
          }}
          placeholder="Checklist title..."
          className="w-full bg-transparent font-serif text-2xl sm:text-3xl text-ink-primary font-medium focus:outline-none mb-1.5"
        />

        <input
          type="text"
          value={subtitle}
          onChange={(e) => {
            setSubtitle(e.target.value);
            syncUpdate(items, pinned, title, e.target.value);
          }}
          placeholder="Optional description or context..."
          className="w-full bg-transparent text-sm text-ink-secondary focus:outline-none mb-4"
        />

        {/* Progress Bar Card (Screen 4) */}
        <div className="mb-6 bg-white border border-hairline rounded-2xl p-4 shadow-resting">
          <div className="flex items-center justify-between text-sm mb-2 font-medium">
            <span className="flex items-center gap-2 text-ink-primary">
              <Check className="w-4 h-4 text-ochre stroke-[3]" />
              {completedCount} of {totalCount} items completed
            </span>
            <span className="text-ochre font-mono font-bold">{percentCompleted}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-recessed overflow-hidden">
            <div
              className="bg-ochre h-full transition-all duration-300 rounded-full"
              style={{ width: `${percentCompleted}%` }}
            />
          </div>
        </div>

        {/* IN PROGRESS Section */}
        <section className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-ink-tertiary mb-3">
            <span>IN PROGRESS</span>
            <span className="text-emerald-700 font-mono">Auto-synced</span>
          </div>

          <div className="space-y-2.5">
            {inProgressItems.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                className="group flex items-start gap-3 bg-white border border-hairline rounded-2xl p-3.5 shadow-resting hover:shadow-lifted transition-all"
              >
                {/* Drag handle */}
                <button
                  type="button"
                  title="Drag to reorder"
                  className="cursor-grab text-ink-tertiary hover:text-ink-primary mt-0.5 active:cursor-grabbing"
                >
                  <GripVertical className="w-4 h-4" />
                </button>

                {/* Checkbox */}
                <button
                  onClick={() => toggleItemCompleted(item.id)}
                  aria-label="Toggle task"
                  className="w-5 h-5 rounded-md border-1.5 border-[#A8A29E] hover:border-ochre flex items-center justify-center transition-colors mt-0.5 flex-shrink-0"
                >
                  {item.completed && <Check className="w-3.5 h-3.5 text-white" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-ink-primary font-medium leading-snug">
                      {item.text}
                    </span>
                    {item.priority === 'High' && (
                      <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                        ⚑ High
                      </span>
                    )}
                    {item.badge && (
                      <span className="text-[10px] font-medium text-ink-secondary bg-recessed px-2 py-0.5 rounded-full border border-hairline">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Inline Audio player clip if present */}
                  {item.audio_clip && (
                    <div className="mt-2 max-w-xs">
                      <WaveformPlayer duration={42} />
                    </div>
                  )}

                  {item.assignee && (
                    <p className="text-[11px] text-ink-tertiary mt-1">
                      Assigned to {item.assignee}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-ink-tertiary hover:text-red-600 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Add Item Input */}
          <form onSubmit={handleAddItem} className="mt-4">
            <div className="flex items-center gap-2 bg-white border border-dashed border-[#D5CEBF] rounded-2xl px-4 py-3 shadow-resting focus-within:border-ochre">
              <Plus className="w-4 h-4 text-ochre flex-shrink-0" />
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add an item, action, or note..."
                className="w-full bg-transparent text-sm text-ink-primary focus:outline-none placeholder:text-ink-tertiary"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-ochre hover:bg-ochre-dark text-white text-xs font-medium rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-2 px-1 text-xs text-ink-tertiary">
              <span>Quick tags:</span>
              {['#design', '#dev', '#slides', '!urgent'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewItemText(prev => `${prev} ${t}`.trim())}
                  className="px-2 py-0.5 rounded-full bg-recessed hover:bg-white border border-hairline text-[11px] font-mono text-ink-secondary"
                >
                  {t}
                </button>
              ))}
            </div>
          </form>
        </section>

        {/* Collapsible Completed Accordion (Screen 4) */}
        {completedItems.length > 0 && (
          <section className="mb-6">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full flex items-center justify-between py-2 text-xs font-semibold text-ink-tertiary uppercase tracking-wider hover:text-ink-primary"
            >
              <span className="flex items-center gap-1.5">
                {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Completed ({completedItems.length})
              </span>
              <span className="text-[11px] font-normal normal-case">
                {showCompleted ? 'Tap to hide' : 'Tap to show'}
              </span>
            </button>

            {showCompleted && (
              <div className="space-y-2 mt-2">
                {completedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-white/60 border border-hairline rounded-2xl p-3 text-xs opacity-75"
                  >
                    <button
                      onClick={() => toggleItemCompleted(item.id)}
                      className="w-5 h-5 rounded-md bg-ochre flex items-center justify-center text-white"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <span className="flex-1 line-through text-ink-tertiary">
                      {item.text}
                    </span>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-ink-tertiary hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Attached Media Card (Screen 4) */}
        <section className="mb-6 bg-white border border-hairline rounded-2xl p-4 shadow-resting flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/icon-192.png"
              alt="Moodboard"
              className="w-12 h-12 rounded-xl object-cover border border-hairline"
            />
            <div>
              <h4 className="text-xs font-semibold text-ink-primary flex items-center gap-1.5 font-mono">
                <Paperclip className="w-3.5 h-3.5 text-ochre" />
                Moodboard_Keynote_v4.png
              </h4>
              <p className="text-[11px] text-ink-tertiary">
                Referenced for presentation slide palette
              </p>
            </div>
          </div>
          <button
            onClick={() => window.open('/icon-512.png', '_blank')}
            className="p-2 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-recessed"
          >
            <Eye className="w-4 h-4" />
          </button>
        </section>
      </main>

      {/* Bottom Action Dock (Screen 4) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-hairline py-3 px-6 shadow-dock">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Color dots */}
          <div className="flex items-center gap-2">
            {['#FDF8F6', '#EDE4D5', '#D6E0D4', '#F2D7CE'].map((c, i) => (
              <span
                key={i}
                className="w-5 h-5 rounded-full border border-black/10"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenVoiceRecorder}
              className="p-2 rounded-full hover:bg-recessed text-ink-secondary hover:text-ochre"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={() => alert(`Reminder set for: ${reminderTime}`)}
              className="p-2 rounded-full hover:bg-recessed text-ink-secondary hover:text-ochre"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-recessed text-ink-secondary">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
