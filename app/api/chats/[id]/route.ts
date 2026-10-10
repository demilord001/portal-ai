import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  getMessagesByChatId,
  updateChatTitle,
  deleteChatSession,
} from "@/lib/db-service";

async function resolveUserId(): Promise<string> {
  try {
    const user = await currentUser();
    if (user?.id) return user.id;
  } catch {
    // Clerk offline
  }
  return "user_default";
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const messages = await getMessagesByChatId(id);
    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error("GET /api/chats/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch messages" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = await resolveUserId();
    const body = await req.json();
    const title = body.title;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const updated = await updateChatTitle(id, userId, title);
    return NextResponse.json({ success: updated });
  } catch (error: any) {
    console.error("PATCH /api/chats/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update title" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = await resolveUserId();
    const deleted = await deleteChatSession(id, userId);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    console.error("DELETE /api/chats/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete chat" }, { status: 500 });
  }
}
