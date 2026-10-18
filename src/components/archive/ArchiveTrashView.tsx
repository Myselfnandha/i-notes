import React from 'react';
import { ArrowLeft, Archive, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { Note, Checklist } from '../../types';

interface ArchiveTrashViewProps {
  mode: 'archive' | 'trash';
  notes: Note[];
  checklists: Checklist[];
  onBack: () => void;
  onRestoreNote: (note: Note) => void;
  onRestoreChecklist: (cl: Checklist) => void;
  onPermanentDeleteNote: (id: string) => void;
  onPermanentDeleteChecklist: (id: string) => void;
  onEmptyTrash?: () => void;
}

export const ArchiveTrashView: React.FC<ArchiveTrashViewProps> = ({
  mode,
  notes,
  checklists,
  onBack,
  onRestoreNote,
  onRestoreChecklist,
  onPermanentDeleteNote,
  onPermanentDeleteChecklist,
  onEmptyTrash,
}) => {
  const isArchive = mode === 'archive';

  const targetNotes = notes.filter(n => isArchive ? (n.archived && !n.trashed) : n.trashed);
  const targetChecklists = checklists.filter(c => isArchive ? (c.archived && !c.trashed) : c.trashed);

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 sm:px-6">
      <header className="pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-black/5"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-medium text-ink-primary leading-tight flex items-center gap-2">
              {isArchive ? (
                <>
                  <Archive className="w-5 h-5 text-[#51604e]" />
                  Archive Box
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5 text-red-600" />
                  Trash Bin
                </>
              )}
            </h1>
            <p className="text-xs text-ink-secondary">
              {isArchive
                ? 'Preserved thoughts kept safe from the daily feed'
                : 'Items stored here are permanently removed after 30 days'}
            </p>
          </div>
        </div>

        {!isArchive && targetNotes.length + targetChecklists.length > 0 && onEmptyTrash && (
          <button
            onClick={onEmptyTrash}
            className="px-3.5 py-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Empty Trash
          </button>
        )}
      </header>

      {targetNotes.length === 0 && targetChecklists.length === 0 ? (
        <div className="mt-12 text-center py-12 px-6 bg-white/70 border border-hairline rounded-card shadow-resting">
          <p className="text-sm text-ink-secondary font-serif italic">
            {isArchive ? 'The archive box is currently empty.' : 'The trash bin is currently empty.'}
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {targetNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white border border-hairline rounded-card p-4 shadow-resting flex items-center justify-between"
            >
              <div>
                <h4 className="font-serif font-medium text-ink-primary text-base">
                  {note.title}
                </h4>
                <p className="text-xs text-ink-secondary line-clamp-1">{note.snippet}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRestoreNote(note)}
                  title={isArchive ? 'Unarchive' : 'Restore note'}
                  className="px-3 py-1.5 rounded-lg bg-recessed hover:bg-white border border-hairline text-xs font-medium text-ink-secondary hover:text-ink-primary flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restore
                </button>
                {!isArchive && (
                  <button
                    onClick={() => onPermanentDeleteNote(note.id)}
                    title="Delete permanently"
                    className="p-1.5 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {targetChecklists.map((cl) => (
            <div
              key={cl.id}
              className="bg-white border border-hairline rounded-card p-4 shadow-resting flex items-center justify-between"
            >
              <div>
                <h4 className="font-serif font-medium text-ink-primary text-base">
                  {cl.title}
                </h4>
                <p className="text-xs text-ink-secondary font-mono">
                  {cl.items.length} checklist items
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRestoreChecklist(cl)}
                  title={isArchive ? 'Unarchive' : 'Restore checklist'}
                  className="px-3 py-1.5 rounded-lg bg-recessed hover:bg-white border border-hairline text-xs font-medium text-ink-secondary hover:text-ink-primary flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restore
                </button>
                {!isArchive && (
                  <button
                    onClick={() => onPermanentDeleteChecklist(cl.id)}
                    title="Delete permanently"
                    className="p-1.5 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
