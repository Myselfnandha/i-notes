import React, { useState } from 'react';
import {
  Pin,
  Archive,
  Trash2,
  MoreVertical,
  Volume2,
  Calendar,
  Tag as TagIcon,
  CheckCircle2,
  Bookmark,
  MapPin,
  Star
} from 'lucide-react';
import { Note, ColorWash } from '../../types';
import { WaveformPlayer } from '../audio/WaveformPlayer';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onTogglePin: (note: Note) => void;
  onToggleArchive: (note: Note) => void;
  onDelete: (note: Note) => void;
  onChangeColorWash?: (note: Note, wash: ColorWash) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onTogglePin,
  onToggleArchive,
  onDelete,
  onChangeColorWash,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Background wash styles matching DESIGN.md
  const washStyles: Record<ColorWash, string> = {
    white: 'bg-white border-[#EBE8E1]',
    cream: 'bg-[#FDFBF7] border-[#EDE4D5]',
    sage: 'bg-[#F4F7F3] border-[#D6E0D4]',
    peach: 'bg-[#FDF6F3] border-[#F2D7CE]',
    chamois: 'bg-[#FAF5ED] border-[#EAD7C1]',
    lavender: 'bg-[#F6F5FA] border-[#DED8F0]',
  };

  const washColor = washStyles[note.color_wash || 'white'] || washStyles.white;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const now = new Date();
      const diffHours = Math.round((now.getTime() - d.getTime()) / (1000 * 60 * 60));
      if (diffHours < 24) {
        return diffHours <= 1 ? 'Just now' : `${diffHours}h ago`;
      }
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div
      onClick={() => onEdit(note)}
      className={`group relative rounded-card p-4 sm:p-5 border shadow-resting hover:shadow-lifted transition-all duration-200 cursor-pointer ${washColor}`}
    >
      {/* Top Header metadata & menu */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {note.audio_url && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ochre bg-ochre/10 px-2 py-0.5 rounded-full">
              <Volume2 className="w-3 h-3" />
              Voice Memo
            </span>
          )}
          {note.tags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium text-ink-secondary bg-[#1C1B1A]/5 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onTogglePin(note)}
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
            className={`p-1 rounded-full transition-colors ${
              note.pinned ? 'text-ochre' : 'text-ink-tertiary opacity-0 group-hover:opacity-100 hover:text-ink-primary'
            }`}
          >
            <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-ochre' : ''}`} />
          </button>

          <button
            onClick={() => setShowMenu(!showMenu)}
            aria-label="More options"
            className="p-1 rounded-full text-ink-tertiary hover:text-ink-primary hover:bg-black/5"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {/* Context Dropdown */}
          {showMenu && (
            <div
              className="absolute right-0 top-6 z-30 w-44 bg-white border border-hairline rounded-xl shadow-lifted py-1.5 text-xs animate-in fade-in"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => {
                  onTogglePin(note);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-ink-secondary hover:bg-recessed"
              >
                <Pin className="w-3.5 h-3.5" />
                {note.pinned ? 'Unpin note' : 'Pin to top'}
              </button>
              <button
                onClick={() => {
                  onToggleArchive(note);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-ink-secondary hover:bg-recessed"
              >
                <Archive className="w-3.5 h-3.5" />
                {note.archived ? 'Unarchive' : 'Archive note'}
              </button>
              <div className="border-t border-hairline my-1" />
              <div className="px-3 py-1 text-[10px] uppercase font-semibold text-ink-tertiary">
                Paper Wash Tint
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5">
                {(['white', 'cream', 'sage', 'peach', 'chamois', 'lavender'] as ColorWash[]).map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      onChangeColorWash?.(note, w);
                      setShowMenu(false);
                    }}
                    className={`w-4 h-4 rounded-full border border-black/10 transition-transform hover:scale-125 ${
                      w === 'white' ? 'bg-white' :
                      w === 'cream' ? 'bg-[#EDE4D5]' :
                      w === 'sage' ? 'bg-[#D6E0D4]' :
                      w === 'peach' ? 'bg-[#F2D7CE]' :
                      w === 'chamois' ? 'bg-[#EAD7C1]' : 'bg-[#DED8F0]'
                    } ${note.color_wash === w ? 'ring-2 ring-ochre' : ''}`}
                  />
                ))}
              </div>
              <div className="border-t border-hairline my-1" />
              <button
                onClick={() => {
                  onDelete(note);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Move to trash
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-serif text-lg font-medium text-ink-primary leading-snug mb-1.5 group-hover:text-primary transition-colors">
        {note.title || 'Untitled Thought'}
      </h3>

      {/* Snippet / Content Preview */}
      {note.snippet && (
        <p className="text-xs sm:text-[13px] text-ink-secondary line-clamp-3 leading-relaxed mb-3 font-sans">
          {note.snippet}
        </p>
      )}

      {/* Embedded Waveform Player if audio note */}
      {note.audio_url && (
        <div className="my-2.5" onClick={(e) => e.stopPropagation()}>
          <WaveformPlayer audioUrl={note.audio_url} duration={note.audio_duration || 42} />
        </div>
      )}

      {/* Footer metadata */}
      <div className="flex items-center justify-between text-[11px] text-ink-tertiary pt-2 border-t border-black/[0.04]">
        <span>{formatDate(note.updated_at)}</span>
        {note.word_count ? (
          <span>{note.word_count} words</span>
        ) : (
          <span>{note.reading_time || 1} min read</span>
        )}
      </div>
    </div>
  );
};
