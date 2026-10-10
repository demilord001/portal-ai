"use client";

import React, { useRef } from "react";
import { Paperclip, X, FileText, Image as ImageIcon, Music, File } from "lucide-react";
import { AttachmentItem } from "@/lib/types";

interface AttachmentUploaderProps {
  attachments: AttachmentItem[];
  onAddAttachment: (item: AttachmentItem) => void;
  onRemoveAttachment: (id: string) => void;
  disabled?: boolean;
}

export function AttachmentUploader({
  attachments,
  onAddAttachment,
  onRemoveAttachment,
  disabled,
}: AttachmentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const id = `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      let category: "image" | "document" | "audio" | "other" = "other";

      if (file.type.startsWith("image/")) {
        category = "image";
      } else if (file.type.startsWith("audio/")) {
        category = "audio";
      } else if (
        file.type.includes("pdf") ||
        file.type.includes("text") ||
        file.type.includes("json") ||
        file.type.includes("csv") ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".md") ||
        file.name.endsWith(".json") ||
        file.name.endsWith(".csv") ||
        file.name.endsWith(".pdf")
      ) {
        category = "document";
      }

      // Read content for text/small docs or create object URL
      let dataPreview = "";
      if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".json") || file.name.endsWith(".csv")) {
        try {
          dataPreview = await file.text();
        } catch {
          dataPreview = "";
        }
      } else if (file.type.startsWith("image/") && file.size < 2 * 1024 * 1024) {
        // Read base64 for small images
        try {
          dataPreview = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        } catch {
          dataPreview = "";
        }
      }

      onAddAttachment({
        id,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        category,
        data: dataPreview,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderIcon = (category?: string) => {
    switch (category) {
      case "image":
        return <ImageIcon className="h-3.5 w-3.5 text-blue-500" />;
      case "audio":
        return <Music className="h-3.5 w-3.5 text-violet-500" />;
      case "document":
        return <FileText className="h-3.5 w-3.5 text-emerald-500" />;
      default:
        return <File className="h-3.5 w-3.5 text-neutral-500" />;
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,audio/*,.pdf,.txt,.json,.csv,.md,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        title="Attach files, documents, images or audio"
        className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60 transition-colors disabled:opacity-50"
      >
        <Paperclip className="h-4 w-4" />
      </button>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 w-full pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60 mb-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/80 px-2.5 py-1 text-xs text-neutral-700 dark:text-neutral-300 shadow-sm backdrop-blur-sm"
            >
              {renderIcon(att.category)}
              <span className="max-w-[140px] truncate font-medium">
                {att.name}
              </span>
              <span className="text-[10px] text-neutral-400">
                ({(att.size / 1024).toFixed(0)}KB)
              </span>
              <button
                type="button"
                onClick={() => onRemoveAttachment(att.id)}
                className="ml-1 text-neutral-400 hover:text-rose-500 transition-colors"
                title="Remove attachment"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
