"use client";

import { useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { cn } from "@/lib/utils";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  SquareCode,
  Link as LinkIcon,
  Link2Off,
  RemoveFormatting,
} from "lucide-react";
import * as React from "react";

// ── Types ─────────────────────────────────────────────────────────────────
export interface RichTextEditorProps {
  /** Current content as an HTML string */
  value: string;
  /** Called with the new HTML string on every edit */
  onChange: (html: string) => void;
  /** Placeholder shown when the editor is empty */
  placeholder?: string;
  /** Minimum height of the editable area in px */
  minHeight?: number;
  className?: string;
}

// ── Toolbar button ─────────────────────────────────────────────────────────
interface ToolbarButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({ label, active, disabled, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors",
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px shrink-0 bg-border" />;
}

// ── Component ──────────────────────────────────────────────────────────────
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something…",
  minHeight = 220,
  className,
}: RichTextEditorProps) {
  const [linkBarOpen, setLinkBarOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          "notice-prose min-h-[160px] px-4 py-3 text-sm focus:outline-none",
        ),
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  // Keep the editor in sync when the value changes externally (e.g. edit mode)
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value ?? "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const openLinkBar = () => {
    if (!editor) return;
    const current = editor.getAttributes("link").href as string | undefined;
    setLinkUrl(current ?? "");
    setLinkBarOpen((o) => !o);
  };

  const applyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    const href = linkUrl.trim();
    if (href) {
      const normalized = href.startsWith("http") || href.startsWith("/") || href.startsWith("#")
        ? href
        : `https://${href}`;
      editor.chain().focus().setLink({ href: normalized }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setLinkBarOpen(false);
  };

  const removeLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
    setLinkBarOpen(false);
  };

  const commands = useMemo(
    () => ({
      undo: () => editor?.chain().focus().undo().run(),
      redo: () => editor?.chain().focus().redo().run(),
      bold: () => editor?.chain().focus().toggleBold().run(),
      italic: () => editor?.chain().focus().toggleItalic().run(),
      underline: () => editor?.chain().focus().toggleUnderline().run(),
      strike: () => editor?.chain().focus().toggleStrike().run(),
      heading2: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      heading3: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      bulletList: () => editor?.chain().focus().toggleBulletList().run(),
      orderedList: () => editor?.chain().focus().toggleOrderedList().run(),
      blockquote: () => editor?.chain().focus().toggleBlockquote().run(),
      code: () => editor?.chain().focus().toggleCode().run(),
      codeBlock: () => editor?.chain().focus().toggleCodeBlock().run(),
      clear: () => editor?.chain().focus().clearNodes().unsetAllMarks().run(),
    }),
    [editor],
  );

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border/70 bg-background focus-within:ring-[3px] focus-within:ring-ring/50",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border/60 bg-muted/30 px-2 py-1.5">
        <ToolbarButton label="Undo" onClick={commands.undo} disabled={!editor.can().undo()}>
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={commands.redo} disabled={!editor.can().redo()}>
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={commands.bold}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={commands.italic}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={commands.underline}>
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Strikethrough" active={editor.isActive("strike")} onClick={commands.strike}>
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={commands.heading2}>
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={commands.heading3}>
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={commands.bulletList}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={commands.orderedList}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Blockquote" active={editor.isActive("blockquote")} onClick={commands.blockquote}>
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton label="Inline code" active={editor.isActive("code")} onClick={commands.code}>
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Code block" active={editor.isActive("codeBlock")} onClick={commands.codeBlock}>
          <SquareCode className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          label="Add link"
          active={editor.isActive("link") || linkBarOpen}
          onClick={openLinkBar}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        {editor.isActive("link") && (
          <ToolbarButton label="Remove link" onClick={removeLink}>
            <Link2Off className="h-4 w-4" />
          </ToolbarButton>
        )}

        <Divider />

        <ToolbarButton label="Clear formatting" onClick={commands.clear}>
          <RemoveFormatting className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Link bar */}
      {linkBarOpen && (
        <form
          onSubmit={applyLink}
          className="flex items-center gap-2 border-b border-border/60 bg-background px-3 py-2"
        >
          <LinkIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="h-8 w-full min-w-0 rounded-md border border-border/70 bg-muted/30 px-3 text-xs focus:border-primary focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="h-8 shrink-0 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Set link
          </button>
          <button
            type="button"
            onClick={removeLink}
            className="flex h-8 shrink-0 items-center gap-1 rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Remove
          </button>
        </form>
      )}

      {/* Editable area */}
      <EditorContent editor={editor} style={{ minHeight }} />
    </div>
  );
}