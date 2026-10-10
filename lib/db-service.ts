import { db, chats, messages, users } from "@/db";
import { eq, desc } from "drizzle-orm";
import { ChatSession, ChatMessage, AttachmentItem, SearchSource } from "@/lib/types";

// In-memory fallback cache for resilient local operation when DB is unreachable
const memoryFallback = {
  users: new Map<string, any>(),
  chats: new Map<string, ChatSession>(),
  messages: new Map<string, ChatMessage[]>(),
};

const isDbUsable = () => {
  const url = process.env.DATABASE_URL;
  return Boolean(
    url &&
    !url.includes("your_password") &&
    !url.includes("placeholder")
  );
};

export async function upsertUser(user: { id: string; name?: string | null; email?: string | null; imageUrl?: string | null }) {
  if (isDbUsable()) {
    try {
      await db.insert(users)
        .values({
          id: user.id,
          name: user.name || null,
          email: user.email || null,
          imageUrl: user.imageUrl || null,
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            name: user.name || null,
            email: user.email || null,
            imageUrl: user.imageUrl || null,
            updatedAt: new Date(),
          },
        });
      return;
    } catch (err) {
      console.warn("Neon DB upsertUser error, falling back to local memory:", err);
    }
  }
  memoryFallback.users.set(user.id, { ...user, updatedAt: new Date().toISOString() });
}

export async function getChatsByUserId(userId: string): Promise<ChatSession[]> {
  if (isDbUsable()) {
    try {
      const records = await db
        .select()
        .from(chats)
        .where(eq(chats.userId, userId))
        .orderBy(desc(chats.updatedAt));

      return records.map((c) => ({
        id: c.id,
        userId: c.userId,
        title: c.title,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      }));
    } catch (err) {
      console.warn("Neon DB getChats error, falling back to local memory:", err);
    }
  }

  const userChats = Array.from(memoryFallback.chats.values())
    .filter((c) => c.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return userChats;
}

export async function createChatSession(id: string, userId: string, title: string): Promise<ChatSession> {
  const newChat: ChatSession = {
    id,
    userId,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isDbUsable()) {
    try {
      await db.insert(chats).values({
        id,
        userId,
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return newChat;
    } catch (err) {
      console.warn("Neon DB createChat error, falling back to local memory:", err);
    }
  }

  memoryFallback.chats.set(id, newChat);
  return newChat;
}

export async function updateChatTitle(chatId: string, userId: string, title: string): Promise<boolean> {
  if (isDbUsable()) {
    try {
      await db.update(chats)
        .set({ title, updatedAt: new Date() })
        .where(eq(chats.id, chatId));
      return true;
    } catch (err) {
      console.warn("Neon DB updateChatTitle error, falling back to local memory:", err);
    }
  }

  const session = memoryFallback.chats.get(chatId);
  if (session && session.userId === userId) {
    session.title = title;
    session.updatedAt = new Date().toISOString();
    return true;
  }
  return false;
}

export async function deleteChatSession(chatId: string, userId: string): Promise<boolean> {
  if (isDbUsable()) {
    try {
      await db.delete(chats).where(eq(chats.id, chatId));
      return true;
    } catch (err) {
      console.warn("Neon DB deleteChat error, falling back to local memory:", err);
    }
  }

  memoryFallback.chats.delete(chatId);
  memoryFallback.messages.delete(chatId);
  return true;
}

export async function getMessagesByChatId(chatId: string): Promise<ChatMessage[]> {
  if (isDbUsable()) {
    try {
      const msgs = await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, chatId))
        .orderBy(messages.createdAt);

      return msgs.map((m) => ({
        id: m.id,
        chatId: m.chatId,
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
        sources: (m.sources as SearchSource[]) || undefined,
        attachments: (m.attachments as AttachmentItem[]) || undefined,
        metadata: (m.metadata as any) || undefined,
        createdAt: m.createdAt.toISOString(),
      }));
    } catch (err) {
      console.warn("Neon DB getMessages error, falling back to local memory:", err);
    }
  }

  return memoryFallback.messages.get(chatId) || [];
}

export async function createChatMessage(msg: {
  id: string;
  chatId: string;
  role: "user" | "assistant" | "system";
  content: string;
  sources?: SearchSource[];
  attachments?: AttachmentItem[];
  metadata?: any;
}): Promise<ChatMessage> {
  const createdMsg: ChatMessage = {
    ...msg,
    createdAt: new Date().toISOString(),
  };

  if (isDbUsable()) {
    try {
      await db.insert(messages).values({
        id: msg.id,
        chatId: msg.chatId,
        role: msg.role,
        content: msg.content,
        sources: msg.sources || null,
        attachments: msg.attachments || null,
        metadata: msg.metadata || null,
        createdAt: new Date(),
      });

      await db.update(chats)
        .set({ updatedAt: new Date() })
        .where(eq(chats.id, msg.chatId));

      return createdMsg;
    } catch (err) {
      console.warn("Neon DB createChatMessage error, falling back to local memory:", err);
    }
  }

  const existing = memoryFallback.messages.get(msg.chatId) || [];
  existing.push(createdMsg);
  memoryFallback.messages.set(msg.chatId, existing);

  const session = memoryFallback.chats.get(msg.chatId);
  if (session) {
    session.updatedAt = new Date().toISOString();
  }

  return createdMsg;
}
