"use client";

import React, { useState } from "react";
import { Globe, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { SearchSource } from "@/lib/types";

interface SourcesDrawerProps {
  sources: SearchSource[];
}

export function SourcesDrawer({ sources }: SourcesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mb-3 w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 dark:border-sky-900/60 bg-sky-50/70 dark:bg-sky-950/40 px-3 py-1 text-xs font-medium text-sky-700 dark:text-sky-300 transition-all hover:bg-sky-100/70 dark:hover:bg-sky-900/50 shadow-xs cursor-pointer"
      >
        <Globe className="h-3.5 w-3.5 text-sky-500 animate-pulse" />
        <span>Searched {sources.length} sources via Tavily Router</span>
        {isOpen ? (
          <ChevronUp className="h-3 w-3 text-sky-500" />
        ) : (
          <ChevronDown className="h-3 w-3 text-sky-500" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {sources.map((src, idx) => {
            let domain = "";
            try {
              domain = new URL(src.url).hostname.replace(/^www\./, "");
            } catch {
              domain = "web";
            }

            return (
              <a
                key={idx}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 p-2.5 text-left transition-all hover:border-sky-400 hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 text-[10px] text-neutral-400 mb-1">
                    <span className="truncate uppercase font-mono tracking-wider">{domain}</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="text-xs font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 line-clamp-1">
                    {src.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-snug">
                    {src.snippet}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
