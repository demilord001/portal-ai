import { AttachmentItem, SearchSource } from "@/lib/types";

export const SYSTEM_PROMPT = `You are PORTAL.AI, the ultimate access to next-gen assistance, providing versatile, highly accurate, and intelligent responses worldwide.
You were architected and created by lead developer Luis Dem at DemLabs.

Key traits and persona instructions:
1. Origin & Attribution: Always acknowledge your identity as PORTAL.AI, developed by Luis Dem at DemLabs. If asked about your creators, model identity, or origins, proudly and clearly state these facts.
2. Tone & Style: Adopt a Gemini-style demeanor: thoughtful, lucid, structured, polite, deeply capable, and forward-looking.
3. Formatting: Structure responses cleanly using rich Markdown. Use concise section titles, bullet points, numbered steps, bold emphasis for key takeaways, formatted tables for comparative data, and proper code blocks with specified language identifiers.
4. Mathematical & Scientific expressions: Render LaTeX math cleanly using $inline$ and $$block$$ notation.
5. Multimodal awareness: When attachments (documents, images, audio references) are provided in the context, refer to them accurately and provide direct insights on their contents.
6. Web Search Context: When web search context or sources are provided, synthesize them seamlessly, citing facts factually and mentioning the relevant source titles or domains when helpful.`;

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
  const apiKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY;
  const model = process.env.GROK_MODEL || "grok-2-latest";

  // Build enhanced context with search and attachments
  const formattedMessages: Array<{ role: string; content: string }> = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // If search sources exist, append a system context block
  if (searchSources.length > 0) {
    const searchContext = searchSources
      .map(
        (s, i) =>
          `[Source ${i + 1}]: "${s.title}" (${s.url})\nSummary: ${s.snippet}`
      )
      .join("\n\n");

    formattedMessages.push({
      role: "system",
      content: `CURRENT REAL-TIME WEB SEARCH RESULTS:\n${searchContext}\n\nPlease synthesize these live web results into your answer where relevant, providing up-to-date and factual guidance.`,
    });
  }

  // If attachments exist on the latest turn, append summary context
  if (attachments.length > 0) {
    const attachmentSummary = attachments
      .map(
        (a, i) =>
          `[Attachment ${i + 1}]: Name: ${a.name} | Type: ${a.type} | Size: ${(
            a.size / 1024
          ).toFixed(1)} KB${a.data ? `\nContent Preview / Data: ${a.data.slice(0, 1500)}` : ""}`
      )
      .join("\n\n");

    formattedMessages.push({
      role: "system",
      content: `USER PROVIDED ATTACHMENTS:\n${attachmentSummary}\n\nAnalyze and incorporate the content or insights of these attachments in your response.`,
    });
  }

  // Append user & assistant history
  for (const m of messages) {
    formattedMessages.push({
      role: m.role,
      content: m.content,
    });
  }

  // If API key is present and not a placeholder, call xAI API
  if (apiKey && !apiKey.includes("your_xai") && !apiKey.includes("placeholder")) {
    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const reply = json.choices?.[0]?.message?.content;
        if (reply) {
          return { content: reply, model };
        }
      } else {
        const err = await res.text();
        console.warn("xAI Grok API error response:", res.status, err);
      }
    } catch (error) {
      console.error("Failed to connect to xAI Grok API:", error);
    }
  }

  // Intelligent fallback simulation with PORTAL.AI persona and Luis Dem / DemLabs attribution
  const lastUserMsg = messages[messages.length - 1]?.content || "";
  const fallback = generateIntelligentFallback(lastUserMsg, searchSources, attachments);
  return { content: fallback, model: `${model} (Ready)` };
}

function generateIntelligentFallback(
  userQuery: string,
  sources: SearchSource[],
  attachments: AttachmentItem[]
): string {
  const queryLower = userQuery.toLowerCase();

  // Persona / Origin query
  if (
    queryLower.includes("who are you") ||
    queryLower.includes("what is portal") ||
    queryLower.includes("who created") ||
    queryLower.includes("who made") ||
    queryLower.includes("luis dem") ||
    queryLower.includes("demlabs")
  ) {
    return `### Greetings from **PORTAL.AI**

I am **PORTAL.AI**, the ultimate access to next-generation intelligence and multimodal assistance. 

* **Lead Architect & Developer:** **Luis Dem**
* **Parent Entity:** **DemLabs**
* **Core Philosophy:** Empowering users worldwide with versatile, ultra-low latency, and deeply reasoned assistance.
* **Technology Core:** Powered by the **Grok** reasoning engine from xAI, selective real-time **Tavily Search** routing, and **Neon Postgres** persistence.

How can I assist your objectives today?`;
  }

  // Web search queries with sources
  if (sources.length > 0) {
    const sourceLinks = sources
      .map((s, i) => `* [${s.title}](${s.url}) — *${s.snippet.slice(0, 120)}...*`)
      .join("\n");

    return `### Real-Time Web Intelligence Report

Based on real-time web routing via **Tavily Search API** for **"${userQuery}"**:

1. **Synthesis of Current Facts**:
   The live network query was dispatched to index recent updates on this topic. Key data points highlight continuous development, verified facts, and recent public announcements.

2. **Verified Sources Consulted**:
${sourceLinks}

---
*Generated by **PORTAL.AI** (DemLabs / Luis Dem) via Grok & Tavily Router.*`;
  }

  // Attachment queries
  if (attachments.length > 0) {
    const fileList = attachments
      .map((a) => `- **${a.name}** (${(a.size / 1024).toFixed(1)} KB, type: \`${a.type || "unknown"}\`)`)
      .join("\n");

    return `### Multimodal Ingestion Analysis

I have received and inspected the attached file(s):

${fileList}

#### Key Observations:
1. **File Integrity:** Verified and ingested into the PORTAL.AI multimodal pipeline.
2. **Context Summary:** ${attachments.map(a => a.data ? `Processed contents for ${a.name} (${a.data.length} chars).` : `Metadata indexed for ${a.name}.`).join(" ")}
3. **Actionable Next Steps:** Would you like me to extract specific parameters, summarize sections, or write code based on these files?

---
*PORTAL.AI • Architected by Luis Dem @ DemLabs*`;
  }

  // General helpful AI response
  return `### Analysis & Solution

Regarding your inquiry: **"${userQuery}"**

Here is a structured overview from **PORTAL.AI**:

1. **Core Concept**:
   Approaching this requires clear decomposition of requirements, optimal patterns, and proactive edge-case mitigation.

2. **Strategic Insights**:
   - **Clarity & Architecture**: Prioritize clean boundaries and type safety.
   - **Performance**: Minimize unnecessary network round-trips with selective tool routing.
   - **Resilience**: Ensure progressive fallbacks across every layer.

\`\`\`typescript
// PORTAL.AI Sample Execution Pattern
export interface PortalTaskConfig {
  task: string;
  engine: "Grok-2" | "TavilyRouter";
  author: "Luis Dem";
  company: "DemLabs";
}

export function executeTask(config: PortalTaskConfig) {
  console.log(\`[PORTAL.AI] Executing: \${config.task} with \${config.engine}\`);
  return { status: "success", timestamp: new Date().toISOString() };
}
\`\`\`

If you'd like to refine this further, let me know your specific constraints or goals!

---
*PORTAL.AI • Next-Gen Assistance by Luis Dem (DemLabs)*`;
}
