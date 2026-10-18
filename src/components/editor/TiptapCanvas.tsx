import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';

interface TiptapCanvasProps {
  contentHtml?: string;
  onChange: (html: string, wordCount: number) => void;
  editorRef?: React.MutableRefObject<any>;
}

export const TiptapCanvas: React.FC<TiptapCanvasProps> = ({
  contentHtml = '',
  onChange,
  editorRef,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        blockquote: {},
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: false }),
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({
        placeholder: 'Write without hurry. The ink flows where deliberate thoughts dwell...',
      }),
    ],
    content: contentHtml,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[300px] text-base sm:text-lg text-ink-primary font-sans leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      onChange(html, words);
    },
  });

  useEffect(() => {
    if (editorRef) {
      editorRef.current = editor;
    }
  }, [editor, editorRef]);

  // Sync content when note changes externally
  useEffect(() => {
    if (editor && contentHtml !== editor.getHTML()) {
      editor.commands.setContent(contentHtml);
    }
  }, [contentHtml, editor]);

  return (
    <div className="editorial-canvas py-2">
      <EditorContent editor={editor} />
    </div>
  );
};
