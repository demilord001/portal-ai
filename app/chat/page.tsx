import { Metadata } from "next";
import { ChatInterface } from "@/components/chat/chat-view";

export const metadata: Metadata = {
  title: "PORTAL.AI — Intelligent Assistance Workspace",
  description: "Next-gen AI assistant architected by Luis Dem @ DemLabs. Powered by Grok xAI and Tavily Web Search.",
};

export default function ChatPage() {
  return <ChatInterface />;
}
