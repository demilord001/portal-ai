import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { shouldTriggerWebSearch, performTavilySearch } from "@/lib/tavily";
import { generateGrokResponse } from "@/lib/grok";
import {
  upsertUser,
  createChatSession,
  createChatMessage,
  getChatsByUserId,
} from "@/lib/db-service";
import { AttachmentItem, SearchSource } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, chatId: incomingChatId, explicitSearch, attachments } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: messages array is required" },
        { status: 400 }
      );
    }

    // Resolve user from Clerk or fallback
    let userId = "user_default";
    let userName = "Luis";
    let userEmail = "user@portal.ai";
    let userImage = "";

    try {
      const clerkUser = await currentUser();
      if (clerkUser) {
        userId = clerkUser.id;
        userName =
          clerkUser.firstName ||
          clerkUser.username ||
          "Explorer";
        userEmail = clerkUser.emailAddresses?.[0]?.emailAddress || "";
        userImage = clerkUser.imageUrl || "";
      }
    } catch {
      // Clerk keys unconfigured or client offline
    }

    // Sync user in database
    await upsertUser({
      id: userId,
      name: userName,
      email: userEmail,
      imageUrl: userImage,
    });

    // Resolve or create chat session
    let chatId = incomingChatId;
    const latestUserMsg = messages[messages.length - 1]?.content || "New Conversation";

    if (!chatId) {
      chatId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const title =
        latestUserMsg.length > 36
          ? `${latestUserMsg.slice(0, 36).trim()}...`
          : latestUserMsg.trim() || "New Chat";
      await createChatSession(chatId, userId, title);
    }

    // Persist user's message
    const userMsgId = `msg_u_${Date.now()}`;
    await createChatMessage({
      id: userMsgId,
      chatId,
      role: "user",
      content: latestUserMsg,
      attachments: (attachments as AttachmentItem[]) || undefined,
    });

    // Smart query routing for Tavily Search
    const searchNeeded = shouldTriggerWebSearch(latestUserMsg, Boolean(explicitSearch));
    let searchSources: SearchSource[] = [];
    let searchSummary = "";

    if (searchNeeded) {
      const searchRes = await performTavilySearch(latestUserMsg);
      searchSources = searchRes.sources;
      searchSummary = searchRes.summary;
    }

    // Call Grok xAI reasoning engine
    const grokRes = await generateGrokResponse({
      messages,
      searchSources,
      attachments,
    });

    // Persist assistant message in DB
    const assistantMsgId = `msg_a_${Date.now()}`;
    const savedAssistantMsg = await createChatMessage({
      id: assistantMsgId,
      chatId,
      role: "assistant",
      content: grokRes.content,
      sources: searchSources.length > 0 ? searchSources : undefined,
      metadata: {
        model: grokRes.model,
        searchUsed: searchNeeded,
        sourcesCount: searchSources.length,
        developerAttribution: "Luis Dem (DemLabs)",
      },
    });

    return NextResponse.json({
      message: savedAssistantMsg,
      chatId,
      searchUsed: searchNeeded,
      sources: searchSources,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
