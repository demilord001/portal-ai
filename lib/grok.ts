import { AttachmentItem, SearchSource } from "@/lib/types";

export const SYSTEM_PROMPT = `You are PORTAL.AI, a highly capable, natural, and friendly AI assistant created by lead developer Luis Dem at DemLabs.

Core Behavior & Persona Guidelines:
1. Natural Conversation: Respond normally, warmly, and conversationally. Do NOT respond in rigid corporate templates or start responses with "### Analysis & Solution" or forced sections unless the user explicitly asks for a formal structured analysis.
2. Direct & Helpful: Answer questions directly and concisely. If greeted, say hello warmly like a human assistant.
3. Clarity & Markdown: Use clean, natural Markdown when formatting answers (paragraphs, bullet points, bold emphasis, code blocks with syntax highlighting).
4. Coding & Technical: Provide working, idiomatic code examples with concise explanations.
5. Multimodal Attachments: When files, code, or images are attached, review their contents and provide direct, helpful answers.
6. Web Search Context: When live web search results are supplied, weave the facts naturally into your answer and cite the source domains or names organically.
7. Identity: If asked who created you or what you are, proudly acknowledge you are PORTAL.AI, architected by Luis Dem at DemLabs.`;

interface GrokCallParams {
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  searchSources?: SearchSource[];
  attachments?: AttachmentItem[];
}

export async function generateGrokResponse({
  messages,
  searchSources = [],
  attachments = [],
}: GrokCallParams): Promise<{ content: string; model: string }> {
  // Read configured keys
  const groqKey = process.env.GROQ_API_KEY;
  const xaiKey = process.env.XAI_API_KEY;
  const rawKey = groqKey || xaiKey || process.env.GROK_API_KEY || "";

  // Build messages array
  const formattedMessages: Array<{ role: string; content: string }> = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // If search sources exist, append real-time web facts
  if (searchSources.length > 0) {
    const searchContext = searchSources
      .map(
        (s, i) =>
          `[Source ${i + 1} - ${s.title}] (${s.url}):\n${s.snippet}`
      )
      .join("\n\n");

    formattedMessages.push({
      role: "system",
      content: `LIVE REAL-TIME WEB SEARCH CONTEXT:\n${searchContext}\n\nPlease synthesize these facts naturally into your response, keeping information fresh, accurate, and directly answering the user.`,
    });
  }

  // If attachments exist, append context
  if (attachments.length > 0) {
    const attachmentSummary = attachments
      .map(
        (a, i) =>
          `[Attachment ${i + 1}]: Name: ${a.name} | Type: ${a.type} | Size: ${(
            a.size / 1024
          ).toFixed(1)} KB${a.data ? `\nContent:\n${a.data.slice(0, 4000)}` : ""}`
      )
      .join("\n\n");

    formattedMessages.push({
      role: "system",
      content: `USER ATTACHMENTS:\n${attachmentSummary}\n\nReview the attached content and address the user's inquiry regarding it.`,
    });
  }

  // Append user & assistant conversation history
  for (const m of messages) {
    formattedMessages.push({
      role: m.role,
      content: m.content,
    });
  }

  // Check if key is Groq (starts with gsk_) or configured for Groq
  const isGroq =
    rawKey.startsWith("gsk_") ||
    Boolean(groqKey && !groqKey.includes("placeholder"));

  // Check if key is xAI (starts with xai-)
  const isXai =
    rawKey.startsWith("xai-") ||
    (Boolean(xaiKey && !xaiKey.startsWith("gsk_") && !xaiKey.includes("placeholder")));

  // 1. Try Groq LPU inference (Ultra-low latency, real-time response)
  if (isGroq && rawKey && !rawKey.includes("placeholder")) {
    const groqModels = [
      process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-20b",
    ];

    for (const model of groqModels) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rawKey}`,
          },
          body: JSON.stringify({
            model,
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 3000,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const reply = json.choices?.[0]?.message?.content;
          if (reply) {
            const displayModel = model.includes("120b")
              ? "GPT-OSS 120B (Groq)"
              : model.includes("qwen")
              ? "Qwen 3.8 (Groq)"
              : "Groq LPU Engine";
            return { content: reply, model: displayModel };
          }
        } else {
          const errText = await res.text();
          console.warn(`Groq model ${model} failed with status ${res.status}:`, errText);
        }
      } catch (err) {
        console.warn(`Groq request error for model ${model}:`, err);
      }
    }
  }

  // 2. Try xAI Grok API if key is xAI
  if (isXai && rawKey && !rawKey.includes("placeholder")) {
    const xaiModel = process.env.GROK_MODEL || "grok-2-latest";
    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${rawKey}`,
        },
        body: JSON.stringify({
          model: xaiModel,
          messages: formattedMessages,
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const reply = json.choices?.[0]?.message?.content;
        if (reply) {
          return { content: reply, model: "Grok-2 (xAI)" };
        }
      } else {
        const errText = await res.text();
        console.warn(`xAI API returned status ${res.status}:`, errText);
      }
    } catch (err) {
      console.warn("xAI API request error:", err);
    }
  }

  // 3. Fallback: Normal, conversational response (NEVER robotic "Analysis & Solution" template)
  const lastUserMsg = messages[messages.length - 1]?.content || "";
  const naturalReply = generateConversationalResponse(lastUserMsg, searchSources, attachments);
  return { content: naturalReply, model: "PORTAL.AI Core" };
}

/**
 * Natural, conversational fallback handler
 */
function generateConversationalResponse(
  userQuery: string,
  sources: SearchSource[],
  attachments: AttachmentItem[]
): string {
  const queryLower = userQuery.toLowerCase().trim();

  // Greetings
  if (
    queryLower === "hi" ||
    queryLower === "hello" ||
    queryLower === "hey" ||
    queryLower.startsWith("hi ") ||
    queryLower.startsWith("hello ") ||
    queryLower.startsWith("hey ") ||
    queryLower.includes("good morning") ||
    queryLower.includes("good evening") ||
    queryLower.includes("good afternoon")
  ) {
    return `Hello! 👋 How can I help you today? Whether you have questions, need code assistance, want to search the web, or review documents, I'm here to assist.`;
  }

  // Identity & Creator
  if (
    queryLower.includes("who are you") ||
    queryLower.includes("what is portal") ||
    queryLower.includes("who created you") ||
    queryLower.includes("who made you") ||
    queryLower.includes("luis dem") ||
    queryLower.includes("demlabs")
  ) {
    return `I am **PORTAL.AI**, an AI assistant architected by lead developer **Luis Dem** at **DemLabs**.

I'm designed to provide responsive, accurate, and conversational assistance — complete with real-time web search capabilities and multimodal file processing.

What would you like to explore or build today?`;
  }

  // Web search results synthesis
  if (sources.length > 0) {
    const list = sources
      .slice(0, 4)
      .map(
        (s) => `• **[${s.title}](${s.url})**: ${s.snippet.slice(0, 160).trim()}...`
      )
      .join("\n\n");

    return `Here are the latest findings from the web regarding **"${userQuery}"**:\n\n${list}\n\nFeel free to ask if you would like me to dive deeper into any of these sources or synthesize specific details!`;
  }

  // Attachments review
  if (attachments.length > 0) {
    const fileList = attachments
      .map(
        (a) =>
          `• **${a.name}** (${(a.size / 1024).toFixed(1)} KB${
            a.type ? `, ${a.type}` : ""
          })`
      )
      .join("\n");

    return `I've received your attached file(s):\n\n${fileList}\n\nWhat would you like me to do with them? I can analyze the contents, extract key data, answer questions, or generate code based on them.`;
  }

  // General conversational answer
  return `Thank you for asking about **"${userQuery}"**.

Here is what you need to know:

PORTAL.AI is ready to assist you directly. To give you the best possible answer, please let me know any specific details, constraints, or examples you'd like included, and I'll jump right on it!`;
}
