import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getChatsByUserId, createChatSession } from "@/lib/db-service";

async function resolveUserId(): Promise<string> {
  try {
    const user = await currentUser();
    if (user?.id) return user.id;
  } catch {
    // Clerk offline
  }
  return "user_default";
}

export async function GET() {
  try {
    const userId = await resolveUserId();
    const chats = await getChatsByUserId(userId);
    return NextResponse.json({ chats });
  } catch (error: any) {
    console.error("GET /api/chats error:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch chats" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await resolveUserId();
    const body = await req.json();
    const title = body.title || "New Chat";
    const id = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newChat = await createChatSession(id, userId, title);
    return NextResponse.json({ chat: newChat });
  } catch (error: any) {
    console.error("POST /api/chats error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create chat" }, { status: 500 });
  }
}
