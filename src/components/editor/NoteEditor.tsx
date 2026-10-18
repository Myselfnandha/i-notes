import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Pin,
  Share2,
  MoreVertical,
  Folder as FolderIcon,
  Bold,
  Italic,
  ListTodo,
  Image as ImageIcon,
  Mic,
  Volume2,
  Check,
  Sparkles,
  Heading1,
  Heading2,
  Quote,
  Lightbulb,
  Plus,
  Trash2,
  Archive,
  Eye
} from 'lucide-react';
import { Note, Folder, ColorWash } from '../../types';
import { TiptapCanvas } from './TiptapCanvas';
import { WaveformPlayer } from '../audio/WaveformPlayer';
import { BrandLogo } from '../common/BrandLogo';

interface NoteEditorProps {
  note: Note;
  folders: Folder[];
  onBack: () => void;
  onSaveNote: (updatedNote: Note) => void;
  onDeleteNote: (note: Note) => void;
  onToggleArchive: (note: Note) => void;
  onOpenVoiceRecorder: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  folders,
  onBack,
  onSaveNote,
  onDeleteNote,
  onToggleArchive,
  onOpenVoiceRecorder,
}) => {
  const [title, setTitle] = useState(note.title);
  const [contentHtml, setContentHtml] = useState(note.content_html || '');
  const [colorWash, setColorWash] = useState<ColorWash>(note.color_wash || 'white');
  const [pinned, setPinned] = useState(note.pinned);
  const [folderId, setFolderId] = useState<string | null>(note.folder_id || null);
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [newTagInput, setNewTagInput] = useState('');
  const [wordCount, setWordCount] = useState(note.word_count || 0);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [showHeadingsMenu, setShowHeadingsMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const editorRef = useRef<any>(null);

  // Background wash styles matching DESIGN.md
  const washStyles: Record<ColorWash, string> = {
    white: 'bg-white',
    cream: 'bg-[#FDFBF7]',
    sage: 'bg-[#F4F7F3]',
    peach: 'bg-[#FDF6F3]',
    chamois: 'bg-[#FAF5ED]',
    lavender: 'bg-[#F6F5FA]',
  };

  // Auto-save debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      const readingTime = Math.max(1, Math.ceil(wordCount / 180));
      // Extract first 140 chars as snippet
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = contentHtml;
      const snippet = tempDiv.textContent?.slice(0, 160) || '';

      const updated: Note = {
        ...note,
        title: title.trim() || 'Untitled Note',
        content_html: contentHtml,
        snippet,
        color_wash: colorWash,
        pinned,
        folder_id: folderId,
        tags,
        word_count: wordCount,
        reading_time: readingTime,
        updated_at: new Date().toISOString(),
      };
      onSaveNote(updated);
    }, 500);

    return () => clearTimeout(timer);
  }, [title, contentHtml, colorWash, pinned, folderId, tags, wordCount]);

  const currentFolder = folders.find(f => f.id === folderId);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Note',
          text: title + '\n\n' + (note.snippet || ''),
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(title + '\n\n' + (note.snippet || ''));
      alert('Note copied to clipboard!');
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      const clean = newTagInput.trim().replace(/^#/, '');
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const insertImage = () => {
    const url = prompt('Enter image URL or asset path (e.g. /app-icon.jpg):', '/app-icon.jpg');
    if (url && editorRef.current) {
      editorRef.current.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className={`min-h-screen ${washStyles[colorWash]} transition-colors duration-200 pb-28`}>
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
            <span className="font-serif font-medium text-base text-ink-primary hidden sm:inline">
              Note Editor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            title="Share Note"
            className="p-2 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-black/5"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPinned(!pinned)}
            title={pinned ? 'Unpin' : 'Pin'}
            className={`p-2 rounded-full transition-colors ${
              pinned ? 'text-ochre bg-ochre/10' : 'text-ink-secondary hover:text-ink-primary hover:bg-black/5'
            }`}
          >
            <Pin className={`w-4 h-4 ${pinned ? 'fill-ochre' : ''}`} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-black/5"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <div
                className="absolute right-0 top-9 z-50 w-44 bg-white border border-hairline rounded-xl shadow-lifted py-1 text-xs"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={() => {
                    onToggleArchive(note);
                    setShowMenu(false);
                    onBack();
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-ink-secondary hover:bg-recessed"
                >
                  <Archive className="w-3.5 h-3.5" />
                  {note.archived ? 'Unarchive' : 'Archive note'}
                </button>
                <button
                  onClick={() => {
                    onDeleteNote(note);
                    setShowMenu(false);
                    onBack();
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Move to Trash
                </button>
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-ochre/15 border border-ochre/30 flex items-center justify-center text-ochre font-serif font-bold text-xs">
            N
          </div>
        </div>
      </header>

      {/* Editor Content Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-8 pt-6">
        {/* Breadcrumb Folder Selector */}
        <div className="relative flex items-center gap-1.5 text-xs text-ink-tertiary mb-3">
          <FolderIcon className="w-3.5 h-3.5 text-ochre" />
          <button
            onClick={() => setShowFolderDropdown(!showFolderDropdown)}
            className="hover:text-ink-primary underline-offset-2 hover:underline flex items-center gap-1"
          >
            {currentFolder ? currentFolder.name : 'Personal > Unassigned'}
          </button>

          {showFolderDropdown && (
            <div
              className="absolute left-0 top-6 z-30 w-56 bg-white border border-hairline rounded-xl shadow-lifted py-1 text-xs"
              onMouseLeave={() => setShowFolderDropdown(false)}
            >
              <div className="px-3 py-1 font-semibold text-[10px] text-ink-tertiary uppercase">
                Assign to Folder
              </div>
              <button
                onClick={() => {
                  setFolderId(null);
                  setShowFolderDropdown(false);
                }}
                className="w-full px-3 py-1.5 text-left text-ink-secondary hover:bg-recessed"
              >
                (None - Unassigned)
              </button>
              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFolderId(f.id);
                    setShowFolderDropdown(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-ink-secondary hover:bg-recessed flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color || '#8d4b00' }} />
                  {f.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Metadata info row */}
        <div className="flex items-center gap-3 text-xs text-ink-tertiary mb-4 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Last edited recently
          </span>
          <span>·</span>
          <span>{wordCount} words · {Math.max(1, Math.ceil(wordCount / 180))} min read</span>
        </div>

        {/* Large Note Title in Newsreader Serif */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full bg-transparent font-serif text-3xl sm:text-4xl text-ink-primary placeholder:text-ink-tertiary placeholder:font-serif focus:outline-none mb-3 font-medium leading-tight"
        />

        {/* Status Badge from Screen 3 */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ochre/15 text-ochre text-xs font-semibold">
            <Sparkles className="w-3 h-3" />
            Focus Draft
          </span>
          <span className="text-xs text-ink-tertiary">Modified Nov 14</span>
        </div>

        {/* Embedded Waveform Player if note has voice memo */}
        {note.audio_url && (
          <div className="mb-6 p-4 bg-white/80 border border-hairline rounded-2xl shadow-resting">
            <div className="flex items-center gap-2 text-xs font-semibold text-ochre uppercase tracking-wider mb-2">
              <Volume2 className="w-4 h-4" />
              Attached Voice Memo Dictation
            </div>
            <WaveformPlayer audioUrl={note.audio_url} duration={note.audio_duration || 42} />
          </div>
        )}

        {/* Main Tiptap Prose Canvas */}
        <TiptapCanvas
          contentHtml={contentHtml}
          onChange={(html, words) => {
            setContentHtml(html);
            setWordCount(words);
          }}
          editorRef={editorRef}
        />

        {/* Key Themes / Callout Card from Screen 3 */}
        <div className="my-6 p-5 bg-[#FAF5EE] border border-[#EAD7C1] rounded-2xl shadow-resting">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-primary font-serif">
              <Lightbulb className="w-4 h-4 text-ochre" />
              Key Themes to Explore
            </div>
            <span className="text-xs text-ink-tertiary">3 insights</span>
          </div>
          <ul className="space-y-2 text-xs text-ink-secondary leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-ochre font-bold">•</span>
              <span><strong>Dual Vantage Points:</strong> Contrasting childhood recollection against adult interpretation in rural Brittany.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-ochre font-bold">•</span>
              <span><strong>Ritual as Vessel:</strong> How repetitive domestic actions form the structural armature for memory retrieval.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-ochre font-bold">•</span>
              <span><strong>Silence & White Space:</strong> Letting unsaid confrontations carry equal gravity as dialogue.</span>
            </li>
          </ul>

          {/* Tags in card */}
          <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-[#EAD7C1]">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-white/80 border border-hairline text-[11px] font-medium text-ink-secondary flex items-center gap-1"
              >
                #{tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-600 text-ink-tertiary ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="+ add tag"
              className="bg-transparent text-xs text-ink-secondary focus:outline-none placeholder:text-ink-tertiary w-20"
            />
          </div>
        </div>
      </main>

      {/* Floating Paper Tint Dock + Bottom Editor Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-hairline py-2 px-4 shadow-dock">
        <div className="max-w-2xl mx-auto">
          {/* Paper Wash Swatches (Screen 3) */}
          <div className="flex items-center justify-center gap-3 py-1.5 mb-1.5 border-b border-hairline/60">
            {([
              { id: 'white', color: '#FFFFFF', border: '#EBE8E1' },
              { id: 'cream', color: '#FDFBF7', border: '#EDE4D5' },
              { id: 'sage', color: '#F4F7F3', border: '#D6E0D4' },
              { id: 'peach', color: '#FDF6F3', border: '#F2D7CE' },
              { id: 'chamois', color: '#FAF5ED', border: '#EAD7C1' },
              { id: 'lavender', color: '#F6F5FA', border: '#DED8F0' },
            ] as const).map((swatch) => (
              <button
                key={swatch.id}
                onClick={() => setColorWash(swatch.id)}
                title={`Paper wash: ${swatch.id}`}
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                  colorWash === swatch.id
                    ? 'ring-2 ring-ochre scale-110 shadow-resting'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: swatch.color, borderColor: swatch.border }}
              >
                {colorWash === swatch.id && <Check className="w-3.5 h-3.5 text-ochre stroke-[3]" />}
              </button>
            ))}
          </div>

          {/* Editor Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Heading selector */}
              <div className="relative">
                <button
                  onClick={() => setShowHeadingsMenu(!showHeadingsMenu)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-ink-primary hover:bg-recessed flex items-center gap-1"
                >
                  Title ▾
                </button>
                {showHeadingsMenu && (
                  <div
                    className="absolute left-0 bottom-10 z-50 w-32 bg-white border border-hairline rounded-xl shadow-lifted py-1 text-xs"
                    onMouseLeave={() => setShowHeadingsMenu(false)}
                  >
                    <button
                      onClick={() => {
                        editorRef.current?.chain().focus().toggleHeading({ level: 1 }).run();
                        setShowHeadingsMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-recessed font-serif font-bold"
                    >
                      Heading 1
                    </button>
                    <button
                      onClick={() => {
                        editorRef.current?.chain().focus().toggleHeading({ level: 2 }).run();
                        setShowHeadingsMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-recessed font-serif font-semibold"
                    >
                      Heading 2
                    </button>
                    <button
                      onClick={() => {
                        editorRef.current?.chain().focus().setParagraph().run();
                        setShowHeadingsMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-recessed"
                    >
                      Normal Text
                    </button>
                  </div>
                )}
              </div>

              {/* Bold */}
              <button
                onClick={() => editorRef.current?.chain().focus().toggleBold().run()}
                title="Bold"
                className="p-2 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-recessed"
              >
                <Bold className="w-4 h-4" />
              </button>

              {/* Italic */}
              <button
                onClick={() => editorRef.current?.chain().focus().toggleItalic().run()}
                title="Italic"
                className="p-2 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-recessed"
              >
                <Italic className="w-4 h-4" />
              </button>

              {/* Checklist */}
              <button
                onClick={() => editorRef.current?.chain().focus().toggleTaskList().run()}
                title="Checklist"
                className="p-2 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-recessed"
              >
                <ListTodo className="w-4 h-4" />
              </button>

              {/* Blockquote */}
              <button
                onClick={() => editorRef.current?.chain().focus().toggleBlockquote().run()}
                title="Blockquote"
                className="p-2 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-recessed"
              >
                <Quote className="w-4 h-4" />
              </button>

              {/* Image */}
              <button
                onClick={insertImage}
                title="Attach Image"
                className="p-2 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-recessed"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Mic Dictation Trigger button */}
            <button
              onClick={onOpenVoiceRecorder}
              title="Record Voice Memo into Note"
              className="w-10 h-10 rounded-full bg-ochre hover:bg-ochre-dark text-white flex items-center justify-center shadow-lifted active:scale-95 transition-transform"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
