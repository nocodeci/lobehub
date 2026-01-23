"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bold, Italic, List, ListOrdered, Code, Eye, EyeOff } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Écrivez vos instructions en Markdown...",
  className = "",
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // Restaurer la sélection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatBold = () => insertText("**", "**");
  const formatItalic = () => insertText("*", "*");
  const formatCode = () => insertText("`", "`");
  const formatList = () => insertText("- ", "");
  const formatOrderedList = () => insertText("1. ", "");

  const renderMarkdown = (text: string) => {
    if (!text.trim()) return "";

    // Split by lines
    const lines = text.split("\n");
    const result: string[] = [];
    let inList = false;
    let listType: "ul" | "ol" | null = null;
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        const tag = listType === "ol" ? "ol" : "ul";
        const className = listType === "ol" 
          ? "list-decimal ml-6 mb-2 space-y-1" 
          : "list-disc ml-6 mb-2 space-y-1";
        result.push(`<${tag} class="${className}">${listItems.join("")}</${tag}>`);
        listItems = [];
      }
      inList = false;
      listType = null;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Headers
      if (trimmed.startsWith("### ")) {
        flushList();
        result.push(`<h3 class="text-sm font-bold text-white mt-3 mb-2">${trimmed.substring(4)}</h3>`);
        continue;
      }
      if (trimmed.startsWith("## ")) {
        flushList();
        result.push(`<h2 class="text-base font-bold text-white mt-4 mb-2">${trimmed.substring(3)}</h2>`);
        continue;
      }
      if (trimmed.startsWith("# ")) {
        flushList();
        result.push(`<h1 class="text-lg font-bold text-white mt-4 mb-3">${trimmed.substring(2)}</h1>`);
        continue;
      }

      // Lists
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (!inList || listType !== "ul") {
          flushList();
          inList = true;
          listType = "ul";
        }
        const content = processInlineMarkdown(trimmed.substring(2));
        listItems.push(`<li class="text-white/80">${content}</li>`);
        continue;
      }
      if (/^\d+\.\s/.test(trimmed)) {
        if (!inList || listType !== "ol") {
          flushList();
          inList = true;
          listType = "ol";
        }
        const content = processInlineMarkdown(trimmed.replace(/^\d+\.\s/, ""));
        listItems.push(`<li class="text-white/80">${content}</li>`);
        continue;
      }

      // Empty line
      if (trimmed === "") {
        flushList();
        if (result.length > 0 && !result[result.length - 1].endsWith("</p>")) {
          result.push("</p>");
        }
        continue;
      }

      // Regular paragraph
      flushList();
      const processed = processInlineMarkdown(trimmed);
      if (result.length > 0 && result[result.length - 1].endsWith("</p>")) {
        result[result.length - 1] = result[result.length - 1].replace("</p>", "<br />" + processed + "</p>");
      } else {
        result.push(`<p class="text-white/80 mb-2 leading-relaxed">${processed}</p>`);
      }
    }

    flushList();
    return result.join("");
  };

  const processInlineMarkdown = (text: string): string => {
    return text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-white'>$1</strong>")
      // Italic (not inside bold)
      .replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, "<em class='italic text-white/90'>$1</em>")
      // Code
      .replace(/`([^`]+?)`/g, "<code class='bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono text-[#10a37f]'>$1</code>");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
          <button
            type="button"
            onClick={formatBold}
            className="h-7 w-7 rounded hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            title="Gras (Ctrl+B)"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={formatItalic}
            className="h-7 w-7 rounded hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            title="Italique (Ctrl+I)"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={formatCode}
            className="h-7 w-7 rounded hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            title="Code"
          >
            <Code className="h-3.5 w-3.5" />
          </button>
          <div className="h-4 w-px bg-white/20 mx-1" />
          <button
            type="button"
            onClick={formatList}
            className="h-7 w-7 rounded hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            title="Liste à puces"
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={formatOrderedList}
            className="h-7 w-7 rounded hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            title="Liste numérotée"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="h-7 px-2 rounded hover:bg-white/10 flex items-center gap-1 text-white/70 hover:text-white text-xs transition-colors"
        >
          {showPreview ? (
            <>
              <EyeOff className="h-3.5 w-3.5" />
              Éditer
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              Aperçu
            </>
          )}
        </button>
      </div>

      {/* Editor or Preview */}
      {showPreview ? (
        <div
          className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white/80 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value || "") }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors resize-none font-mono"
          onKeyDown={(e) => {
            // Raccourcis clavier
            if (e.ctrlKey || e.metaKey) {
              if (e.key === "b") {
                e.preventDefault();
                formatBold();
              } else if (e.key === "i") {
                e.preventDefault();
                formatItalic();
              }
            }
          }}
        />
      )}
    </div>
  );
}
