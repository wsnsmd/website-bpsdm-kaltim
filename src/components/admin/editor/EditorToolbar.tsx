// src/components/admin/editor/EditorToolbar.tsx
"use client";

import type { Editor } from "@tiptap/react";
import { useState, useCallback, useRef, useEffect } from "react";

type Props = { editor: Editor };

function Btn({
  onClick,
  active,
  disabled,
  title,
  children,
  wide,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        // Prevent editor losing focus
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={[
        "tiptap-btn",
        active ? "is-active" : "",
        wide ? "tiptap-btn-wide" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="tiptap-toolbar-sep" />;
}

export function EditorToolbar({ editor }: Props) {
  const [showLink, setShowLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showYt, setShowYt] = useState(false);
  const [ytUrl, setYtUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);
  const ytInputRef = useRef<HTMLInputElement>(null);

  // Focus input saat panel muncul
  useEffect(() => {
    if (showLink) {
      setTimeout(() => linkInputRef.current?.focus(), 50);
    }
  }, [showLink]);

  useEffect(() => {
    if (showYt) {
      setTimeout(() => ytInputRef.current?.focus(), 50);
    }
  }, [showYt]);

  const applyLink = useCallback(() => {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
      setShowLink(false);
      return;
    }
    const href = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    editor.chain().focus().setLink({ href, target: "_blank" }).run();
    setShowLink(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const applyYoutube = useCallback(() => {
    if (!ytUrl.trim()) return;
    try {
      // TipTap v3 nama method: setYoutubeVideo (lowercase t)
      (editor.commands as any).setYoutubeVideo({ src: ytUrl });
    } catch {
      try {
        (editor.commands as any).setYouTubeVideo({ src: ytUrl });
      } catch (e) {
        console.error("YouTube insert error:", e);
      }
    }
    setShowYt(false);
    setYtUrl("");
  }, [editor, ytUrl]);

  const openLink = () => {
    const existing = editor.getAttributes("link").href ?? "";
    setLinkUrl(existing);
    setShowYt(false);
    setShowLink((v) => !v);
  };

  const openYt = () => {
    setShowLink(false);
    setShowYt((v) => !v);
  };

  const insertImage = () => {
    const url = window.prompt("Masukkan URL gambar:");
    if (url?.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  };

  return (
    <div>
      {/* ── Toolbar utama ── */}
      <div className="tiptap-toolbar">
        {/* Undo / Redo */}
        <Btn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 14 4 9 9 4" />
            <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
          </svg>
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 14 20 9 15 4" />
            <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
          </svg>
        </Btn>

        <Sep />

        {/* Heading */}
        <select
          className="tiptap-select"
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
                ? "h2"
                : editor.isActive("heading", { level: 3 })
                  ? "h3"
                  : "p"
          }
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") {
              editor.chain().focus().setParagraph().run();
            } else {
              const level = parseInt(v.replace("h", "")) as 1 | 2 | 3;
              editor.chain().focus().toggleHeading({ level }).run();
            }
          }}
        >
          <option value="p">Paragraf</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <Sep />

        {/* Format */}
        <Btn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          </svg>
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="19" y1="4" x2="10" y2="4" />
            <line x1="14" y1="20" x2="5" y2="20" />
            <line x1="15" y1="4" x2="9" y2="20" />
          </svg>
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17.3 4.9c-2.3-.6-4.4-1-6.2-.9-2.7 0-5.3.7-5.3 3.6 0 1.5 1.8 3.3 6.4 3.9h.1m6.9 6.8c-.2 3.7-3.2 4.8-7 4.8-1.9 0-4-.2-5.8-.7M4 11.5h16" />
          </svg>
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
          title="Highlight"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 3h6l3 9H6L9 3z" />
            <path d="M3 21h18" />
            <path d="M12 12v9" />
          </svg>
        </Btn>

        <Sep />

        {/* Lists */}
        <Btn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="10" y1="6" x2="21" y2="6" />
            <line x1="10" y1="12" x2="21" y2="12" />
            <line x1="10" y1="18" x2="21" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
          </svg>
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
          </svg>
        </Btn>

        <Sep />

        {/* Alignment */}
        <Btn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Rata Kiri"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="18" y2="18" />
          </svg>
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Rata Tengah"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Rata Kanan"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="9" y1="12" x2="21" y2="12" />
            <line x1="6" y1="18" x2="21" y2="18" />
          </svg>
        </Btn>

        <Sep />

        {/* Code */}
        <Btn
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline Code"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
          </svg>
        </Btn>

        <Sep />

        {/* Link */}
        <Btn
          onClick={openLink}
          active={editor.isActive("link") || showLink}
          title={editor.isActive("link") ? "Edit / Hapus Link" : "Insert Link"}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </Btn>

        {/* Gambar */}
        <Btn onClick={insertImage} title="Insert Gambar dari URL">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </Btn>

        {/* YouTube */}
        <Btn onClick={openYt} active={showYt} title="Embed Video YouTube">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
            <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
          </svg>
        </Btn>

        <Sep />

        {/* HR */}
        <Btn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Garis Pemisah"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Btn>

        {/* Table */}
        <Btn
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          title="Insert Tabel"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
          </svg>
        </Btn>

        {/* Clear format */}
        <Btn
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          title="Hapus Semua Formatting"
          wide
        >
          Tx
        </Btn>
      </div>

      {/* ── Panel Link ── */}
      {showLink && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "10px 12px",
            background: "var(--color-ink-8)",
            borderBottom: "1px solid var(--color-ink-6)",
            alignItems: "center",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: "var(--color-ink-4)", flexShrink: 0 }}
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <input
            ref={linkInputRef}
            type="url"
            className="admin-input"
            placeholder="https://contoh.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
              if (e.key === "Escape") setShowLink(false);
            }}
            style={{
              flex: 1,
              height: "34px",
              padding: "0 10px",
              fontSize: "13px",
            }}
          />
          {editor.isActive("link") && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setShowLink(false);
              }}
              className="admin-btn-cancel"
              style={{
                height: "34px",
                padding: "0 10px",
                fontSize: "12.5px",
                color: "#dc2626",
                borderColor: "#fecaca",
              }}
            >
              Hapus Link
            </button>
          )}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={applyLink}
            className="admin-btn-save"
            style={{ height: "34px", padding: "0 14px", fontSize: "12.5px" }}
          >
            Terapkan
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowLink(false)}
            className="admin-btn-cancel"
            style={{ height: "34px", padding: "0 10px", fontSize: "12.5px" }}
          >
            Batal
          </button>
        </div>
      )}

      {/* ── Panel YouTube ── */}
      {showYt && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "10px 12px",
            background: "var(--color-ink-8)",
            borderBottom: "1px solid var(--color-ink-6)",
            alignItems: "center",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: "#dc2626", flexShrink: 0 }}
          >
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
            <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
          </svg>
          <input
            ref={ytInputRef}
            type="url"
            className="admin-input"
            placeholder="https://www.youtube.com/watch?v=..."
            value={ytUrl}
            onChange={(e) => setYtUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyYoutube();
              }
              if (e.key === "Escape") setShowYt(false);
            }}
            style={{
              flex: 1,
              height: "34px",
              padding: "0 10px",
              fontSize: "13px",
            }}
          />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={applyYoutube}
            className="admin-btn-save"
            style={{ height: "34px", padding: "0 14px", fontSize: "12.5px" }}
          >
            Embed
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowYt(false)}
            className="admin-btn-cancel"
            style={{ height: "34px", padding: "0 10px", fontSize: "12.5px" }}
          >
            Batal
          </button>
        </div>
      )}
    </div>
  );
}
