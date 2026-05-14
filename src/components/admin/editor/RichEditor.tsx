// src/components/admin/editor/RichEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Youtube } from "@tiptap/extension-youtube";
import { EditorToolbar } from "./EditorToolbar";
import { useEffect } from "react";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

export function RichEditor({
  value = "",
  onChange,
  placeholder = "Tulis konten artikel di sini...",
  minHeight = 420,
}: Props) {
  const editor = useEditor({
    extensions: [
      // StarterKit sudah include: Bold, Italic, Strike, Code, CodeBlock,
      // Heading, BulletList, OrderedList, Blockquote, HorizontalRule,
      // History (undo/redo), Paragraph, Text, Document, HardBreak,
      // ListItem, Underline, Link (tergantung versi)
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // Nonaktifkan yang akan kita override
        link: false,
      }),

      // Override Link dengan konfigurasi custom
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),

      // Extensions tambahan (tidak ada di StarterKit)
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({
        HTMLAttributes: { class: "editor-image" },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        width: 640,
        height: 360,
        nocookie: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    onCreate: ({ editor }) => {
      // Debug — cari method YouTube
      const allCmds = Object.keys(editor.commands);
      const ytCmds = allCmds.filter(
        (k) =>
          k.toLowerCase().includes("youtube") ||
          k.toLowerCase().includes("video"),
      );
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor-body",
        style: `min-height: ${minHeight}px`,
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  const words = editor.storage.characterCount.words();
  const chars = editor.storage.characterCount.characters();

  return (
    <div className="tiptap-editor-wrap">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="tiptap-footer">
        <div className="tiptap-footer-count">
          <span>{words} kata</span>
          <span>·</span>
          <span>{chars} karakter</span>
        </div>
        <span style={{ fontSize: "11px", color: "var(--color-ink-5)" }}>
          HTML · TipTap
        </span>
      </div>
    </div>
  );
}
