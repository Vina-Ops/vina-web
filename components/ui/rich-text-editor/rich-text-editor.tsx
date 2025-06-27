import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";

export interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  toolbar?: boolean;
  toolbarClassName?: string;
  editorClassName?: string;
}

export function RichTextEditor({
  content = "",
  onChange,
  placeholder,
  readOnly = false,
  className,
  minHeight = "200px",
  maxHeight = "500px",
  toolbar = true,
  toolbarClassName,
  editorClassName,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary-600 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-lg",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {toolbar && (
        <div
          className={cn(
            "mb-2 flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-white p-2",
            toolbarClassName
          )}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "rounded p-2 hover:bg-gray-100",
              editor.isActive("bold") && "bg-gray-100"
            )}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "rounded p-2 hover:bg-gray-100",
              editor.isActive("italic") && "bg-gray-100"
            )}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              "rounded p-2 hover:bg-gray-100",
              editor.isActive("underline") && "bg-gray-100"
            )}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(
              "rounded p-2 hover:bg-gray-100",
              editor.isActive("strike") && "bg-gray-100"
            )}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
          <div className="mx-1 h-6 w-px bg-gray-200" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "rounded p-2 hover:bg-gray-100",
              editor.isActive("bulletList") && "bg-gray-100"
            )}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "rounded p-2 hover:bg-gray-100",
              editor.isActive("orderedList") && "bg-gray-100"
            )}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <div className="mx-1 h-6 w-px bg-gray-200" />
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={cn(
              "rounded p-2 hover:bg-gray-100",
              editor.isActive({ textAlign: "left" }) && "bg-gray-100"
            )}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={cn(
              "rounded p-2 hover:bg-gray-100",
              editor.isActive({ textAlign: "center" }) && "bg-gray-100"
            )}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={cn(
              "rounded p-2 hover:bg-gray-100",
              editor.isActive({ textAlign: "right" }) && "bg-gray-100"
            )}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={cn(
              "rounded p-2 hover:bg-gray-100",
              editor.isActive({ textAlign: "justify" }) && "bg-gray-100"
            )}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </button>
          <div className="mx-1 h-6 w-px bg-gray-200" />
          <button
            onClick={addLink}
            className={cn(
              "rounded p-2 hover:bg-gray-100",
              editor.isActive("link") && "bg-gray-100"
            )}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            onClick={addImage}
            className="rounded p-2 hover:bg-gray-100"
            title="Add Image"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <div className="mx-1 h-6 w-px bg-gray-200" />
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>
      )}
      <div
        className={cn(
          "prose prose-sm max-w-none rounded-lg border border-gray-200 bg-white p-4 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500",
          editorClassName
        )}
        style={{ minHeight, maxHeight }}
      >
        <EditorContent
          editor={editor}
          className={cn(
            "outline-none",
            readOnly && "cursor-default",
            placeholder &&
              "before:content-[attr(data-placeholder)] before:absolute before:opacity-50"
          )}
          data-placeholder={placeholder}
        />
      </div>
    </div>
  );
}
