export interface AttachmentItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  data?: string; // base64 or preview text
  category?: "image" | "document" | "audio" | "other";
}

export interface SearchSource {
  title: string;
  url: string;
  snippet: string;
  score?: number;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  role: "user" | "assistant" | "system";
  content: string;
  sources?: SearchSource[];
  attachments?: AttachmentItem[];
  metadata?: {
    model?: string;
    searchUsed?: boolean;
    latencyMs?: number;
    developerAttribution?: string;
  };
  createdAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
}
