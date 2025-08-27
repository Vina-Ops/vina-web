import React from "react";
import { cn } from "@/lib/utils";

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
  placeholder = "Start typing...",
  readOnly = false,
  className,
  minHeight = "200px",
  maxHeight = "500px",
  toolbar = true,
  toolbarClassName,
  editorClassName,
}: RichTextEditorProps) {
  return (
    <div className={cn("w-full", className)}>
      {toolbar && (
        <div
          className={cn(
            "mb-2 flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-white p-2",
            toolbarClassName
          )}
        >
          <div className="text-sm text-gray-500">
            Rich text editor temporarily disabled
          </div>
        </div>
      )}
      <div
        className={cn(
          "rounded-lg border border-gray-200 bg-white p-3 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500",
          editorClassName
        )}
        style={{ minHeight, maxHeight }}
      >
        <textarea
          value={content}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className="w-full resize-none border-none bg-transparent p-0 text-gray-900 placeholder-gray-500 focus:outline-none"
          style={{
            minHeight: `calc(${minHeight} - 24px)`,
            maxHeight: `calc(${maxHeight} - 24px)`,
          }}
        />
      </div>
    </div>
  );
}
