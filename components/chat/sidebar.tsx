"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { ChatSession } from "@/lib/types";

interface SidebarProps {
  chats: ChatSession[];
  activeChatId?: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  isOpen,
  onToggleOpen,
}: SidebarProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const startRename = (chat: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const saveRename = (chatId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggleOpen}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col border-r border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${
          isOpen ? "w-72 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-r-0"
        }`}
      >
        {/* Header: App Brand & New Chat */}
        <div className="flex flex-col gap-3 p-4 border-b border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-sm shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-50">
                    PORTAL.AI
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                    v2.5
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium">DemLabs Core</span>
              </div>
            </Link>

            <button
              onClick={onToggleOpen}
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={onNewChat}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-white dark:text-neutral-900 px-3.5 py-2.5 text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full rounded-lg border border-neutral-200/70 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/60 pl-8 pr-3 py-1.5 text-xs text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold tracking-wider uppercase text-neutral-400 font-mono">
            Recent Sessions ({filteredChats.length})
          </div>

          {filteredChats.length === 0 ? (
            <div className="p-4 text-center text-xs text-neutral-400">
              {searchFilter ? "No sessions match filter" : "No previous conversations"}
            </div>
          ) : (
            filteredChats.map((chat) => {
              const isActive = chat.id === activeChatId;
              const isEditing = editingId === chat.id;

              return (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer ${
                    isActive
                      ? "bg-neutral-200/80 dark:bg-neutral-800/80 font-medium text-neutral-900 dark:text-neutral-50 shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-neutral-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-indigo-500" : "text-neutral-400"}`} />
                    {isEditing ? (
                      <form
                        onSubmit={(e) => saveRename(chat.id, e)}
                        className="flex items-center gap-1 flex-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          autoFocus
                          className="w-full rounded border border-indigo-400 bg-white dark:bg-neutral-950 px-1.5 py-0.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                        />
                        <button
                          type="submit"
                          className="text-emerald-500 hover:text-emerald-600 p-0.5"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-neutral-400 hover:text-neutral-600 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </form>
                    ) : (
                      <span className="truncate text-xs font-normal">
                        {chat.title}
                      </span>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="hidden items-center gap-1 group-hover:flex ml-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => startRename(chat, e)}
                        title="Rename"
                        className="rounded p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        title="Delete"
                        className="rounded p-1 text-neutral-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Clerk User & DemLabs attribution */}
        <div className="border-t border-neutral-200/80 dark:border-neutral-800/80 p-3 bg-neutral-100/40 dark:bg-neutral-950/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <UserButton />
              <div className="flex flex-col">

                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  Account Session
                </span>
                <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-0.5">
                  <ShieldCheck className="h-2.5 w-2.5" /> Clerk Protected
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-neutral-200/50 dark:bg-neutral-900/60 p-2 text-[10px] text-neutral-500 dark:text-neutral-400 flex flex-col gap-0.5">
            <div className="flex items-center justify-between font-semibold text-neutral-700 dark:text-neutral-300">
              <span>PORTAL.AI Platform</span>
              <span className="text-indigo-500">DemLabs</span>
            </div>
            <span>Lead Architect: <strong>Luis Dem</strong></span>
          </div>
        </div>
      </aside>
    </>
  );
}
