"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  Menu,
  Sparkles,
  ArrowUp,
  Globe,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Plus,
  FileText,
  Image as ImageIcon,
  Music,
  File,
  Layers,
  Search,
} from "lucide-react";
import { ChatMessage, ChatSession, AttachmentItem, SearchSource } from "@/lib/types";
import { MarkdownRenderer } from "./markdown-renderer";
import { AttachmentUploader } from "./attachment-uploader";
import { GeminiGreeting } from "./greeting";
import { SourcesDrawer } from "./sources-drawer";
import { ChatSidebar } from "./sidebar";

export function ChatInterface() {
  const { user } = useUser();
  const userName = user?.firstName || user?.username || "Explorer";

  // State
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [forceWebSearch, setForceWebSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Load chat sessions on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch messages whenever activeChatId changes
  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
    } else {
      setMessages([]);
    }
  }, [activeChatId]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      }
    } catch (e) {
      console.error("Error fetching chats:", e);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error("Error fetching messages:", e);
    }
  };

  const handleNewChat = () => {
    setActiveChatId(undefined);
    setMessages([]);
    setInput("");
    setAttachments([]);
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, { method: "DELETE" });
      if (res.ok) {
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        if (activeChatId === chatId) {
          handleNewChat();
        }
      }
    } catch (e) {
      console.error("Error deleting chat:", e);
    }
  };

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        setChats((prev) =>
          prev.map((c) => (c.id === chatId ? { ...c, title: newTitle } : c))
        );
      }
    } catch (e) {
      console.error("Error renaming chat:", e);
    }
  };

  const handleSendMessage = async (customPrompt?: string, forceSearchOverride?: boolean) => {
    const textToSend = customPrompt !== undefined ? customPrompt : input;
    if (!textToSend.trim() && attachments.length === 0) return;

    const useSearch = forceSearchOverride !== undefined ? forceSearchOverride : forceWebSearch;
    const currentAttachments = [...attachments];

    // Optimistic user message
    const tempUserMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      chatId: activeChatId || "new",
      role: "user",
      content: textToSend,
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
      createdAt: new Date().toISOString(),
    };

    const newMessages = [...messages, tempUserMsg];
    setMessages(newMessages);
    setInput("");
    setAttachments([]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          chatId: activeChatId,
          explicitSearch: useSearch,
          attachments: currentAttachments,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = data.message;
        setMessages((prev) => [...prev, assistantMsg]);

        // If new chat session was created, update active ID and refresh chats
        if (data.chatId && data.chatId !== activeChatId) {
          setActiveChatId(data.chatId);
          fetchChats();
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        console.error("API error:", errJson);
        const fallbackMsg: ChatMessage = {
          id: `err_${Date.now()}`,
          chatId: activeChatId || "new",
          role: "assistant",
          content: "I ran into a temporary hiccup processing your request. Please try sending your message again.",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      const fallbackMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        chatId: activeChatId || "new",
        role: "assistant",
        content: "Network or connection error. Please verify your connection and try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 500));
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(id);
    window.speechSynthesis.speak(utterance);
  };

  const renderAttachmentIcon = (type: string) => {
    if (type?.startsWith("image/")) return <ImageIcon className="h-3.5 w-3.5 text-blue-500" />;
    if (type?.startsWith("audio/")) return <Music className="h-3.5 w-3.5 text-violet-500" />;
    return <FileText className="h-3.5 w-3.5 text-emerald-500" />;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100">
      {/* Collapsible Sidebar */}
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => setActiveChatId(id)}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Workspace */}
      <div className="flex flex-1 flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="flex h-14 items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 px-4 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
              title="Toggle sidebar"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
                PORTAL.AI
              </span>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Grok-2 Core</span>
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                <span>Tavily Router</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Real-time search toggle pill */}
            <button
              type="button"
              onClick={() => setForceWebSearch(!forceWebSearch)}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                forceWebSearch
                  ? "bg-sky-500 text-white shadow-xs"
                  : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 border border-neutral-200/80 dark:border-neutral-800/80"
              }`}
              title="Toggle real-time web search"
            >
              <Globe className={`h-3.5 w-3.5 ${forceWebSearch ? "text-white" : "text-sky-500"}`} />
              <span className="hidden sm:inline">Web Search:</span>
              <span className="font-semibold">{forceWebSearch ? "ON" : "AUTO"}</span>
            </button>

            {/* Clerk User Button */}
            <UserButton />
          </div>

        </header>

        {/* Message View Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
          {messages.length === 0 ? (
            <GeminiGreeting
              userName={userName}
              onSelectPrompt={(prompt, forceSearch) => handleSendMessage(prompt, forceSearch)}
            />
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((msg) => {
                const isUser = msg.role === "user";

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
                  >
                    {/* Assistant Avatar */}
                    {!isUser && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-xs shadow-indigo-500/20 mt-1">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    )}

                    {/* Message Container */}
                    <div className={`flex flex-col max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                      {/* Attachments if present on user message */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {msg.attachments.map((att) => (
                            <div
                              key={att.id}
                              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80 px-2.5 py-1 text-xs text-neutral-700 dark:text-neutral-300 shadow-xs"
                            >
                              {renderAttachmentIcon(att.type)}
                              <span className="max-w-[120px] truncate font-medium">
                                {att.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Content Bubble */}
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                          isUser
                            ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-tr-xs"
                            : "border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/60 backdrop-blur-sm text-neutral-800 dark:text-neutral-200 rounded-tl-xs w-full"
                        }`}
                      >
                        {/* Tavily Sources Drawer for Assistant */}
                        {!isUser && msg.sources && msg.sources.length > 0 && (
                          <SourcesDrawer sources={msg.sources} />
                        )}

                        {isUser ? (
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        ) : (
                          <MarkdownRenderer content={msg.content} />
                        )}
                      </div>

                      {/* Assistant Actions Bar */}
                      {!isUser && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-neutral-400 text-xs pl-1">
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.content)}
                            title="Copy response"
                            className="rounded p-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                          >
                            {copiedMsgId === msg.id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSpeak(msg.id, msg.content)}
                            title={speakingMsgId === msg.id ? "Stop speaking" : "Listen to response"}
                            className="rounded p-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                          >
                            {speakingMsgId === msg.id ? (
                              <VolumeX className="h-3.5 w-3.5 text-indigo-500" />
                            ) : (
                              <Volume2 className="h-3.5 w-3.5" />
                            )}
                          </button>

                          {msg.metadata?.model && (
                            <span className="text-[10px] font-mono text-neutral-400 pl-2">
                              {msg.metadata.model}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3.5 items-start animate-in fade-in duration-300">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-xs shadow-indigo-500/20 animate-pulse mt-1">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/60 px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400 shadow-xs">
                    <div className="flex space-x-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" />
                    </div>
                    <span>
                      {forceWebSearch
                        ? "Searching web with Tavily and synthesizing with Grok..."
                        : "Thinking with Grok intelligence..."}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Gemini-Style Floating Bottom Input Bar */}
        <div className="p-4 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-neutral-950 dark:via-neutral-950/95 dark:to-transparent shrink-0">
          <div className="mx-auto max-w-3xl">
            <div className="relative flex flex-col rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 p-3 shadow-lg backdrop-blur-xl transition-all focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/10">
              {/* Attachment chips if any */}
              <div className="flex flex-col w-full">
                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    forceWebSearch
                      ? "Search the web with Tavily & Grok..."
                      : "Ask PORTAL.AI anything, attach files, or query code..."
                  }
                  rows={1}
                  disabled={isLoading}
                  className="w-full resize-none bg-transparent px-2 py-1 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden leading-relaxed max-h-44"
                />

                {/* Bottom Input Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    {/* Attachment uploader */}
                    <AttachmentUploader
                      attachments={attachments}
                      onAddAttachment={(att) => setAttachments((prev) => [...prev, att])}
                      onRemoveAttachment={(id) =>
                        setAttachments((prev) => prev.filter((a) => a.id !== id))
                      }
                      disabled={isLoading}
                    />

                    {/* Quick Web Search toggle icon */}
                    <button
                      type="button"
                      onClick={() => setForceWebSearch(!forceWebSearch)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors cursor-pointer ${
                        forceWebSearch
                          ? "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-300 dark:border-sky-800"
                          : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      title={forceWebSearch ? "Force Web Search is ON" : "Turn ON Web Search"}
                    >
                      <Globe className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || (!input.trim() && attachments.length === 0)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-30 disabled:hover:bg-neutral-900 dark:disabled:hover:bg-white cursor-pointer shadow-sm active:scale-95"
                    title="Send message"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Attribution Footnote */}
            <p className="mt-2 text-center text-[11px] text-neutral-400 dark:text-neutral-500 font-normal">
              PORTAL.AI can make mistakes. Verify critical facts. Built by <strong>Luis Dem</strong> @ <strong>DemLabs</strong>. Powered by Grok xAI & Tavily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
