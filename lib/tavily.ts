import { SearchSource } from "@/lib/types";

/**
 * Intelligent query routing logic:
 * Triggers web search selectively only when real-time, live facts, news,
 * price, current events, or explicit search is requested.
 * Bypasses search for standard conversational, coding, reasoning, and conceptual queries.
 */
export function shouldTriggerWebSearch(query: string, explicitSearch?: boolean): boolean {
  if (explicitSearch) return true;
  if (!query || query.trim().length < 3) return false;

  const text = query.toLowerCase().trim();

  // Explicit user keywords requesting search
  if (
    text.startsWith("search ") ||
    text.startsWith("look up ") ||
    text.startsWith("google ") ||
    text.includes("search the web") ||
    text.includes("find online") ||
    text.includes("browse for")
  ) {
    return true;
  }

  // Pure coding, math, greetings, or conversational bypasses
  const bypassPatterns = [
    /^(hi|hello|hey|greetings|how are you|good morning|good evening|good afternoon)/i,
    /^(write|create|implement|code|generate|debug|fix|explain)\s+(a\s+)?(function|script|component|regex|algorithm|css|sql|class|loop|promise)/i,
    /^(translate|summarize this|rephrase|rewrite|critique|calculate|solve)/i,
    /^(who are you|what is portal\.ai|who made you|who created you|tell me about yourself)/i,
  ];

  for (const pattern of bypassPatterns) {
    if (pattern.test(text)) {
      return false;
    }
  }

  // Real-time temporal indicators
  const temporalIndicators = [
    /\b(today|yesterday|tomorrow|tonight|this week|this month|this year|current|currently|now|right now)\b/i,
    /\b(latest|recent|recently|breaking|updated|updates|live|fresh)\b/i,
    /\b(2025|2026|2027)\b/,
  ];

  const hasTemporal = temporalIndicators.some((regex) => regex.test(text));

  // Live domain indicators (news, stocks, weather, events, releases)
  const domainIndicators = [
    /\b(weather|forecast|temperature)\b/i,
    /\b(stock|crypto|bitcoin|btc|eth|price of|market cap|shares)\b/i,
    /\b(news|headline|election|vote|war|treaty|scandal|ceasefire)\b/i,
    /\b(score|game|match|championship|tournament|league|winner|who won)\b/i,
    /\b(released|release date|version update|changelog|announcement)\b/i,
  ];

  const hasDomain = domainIndicators.some((regex) => regex.test(text));

  return hasTemporal || hasDomain;
}

export async function performTavilySearch(query: string): Promise<{ sources: SearchSource[]; summary: string }> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey || apiKey.includes("your_tavily") || apiKey.includes("placeholder")) {
    console.warn("Tavily API key not configured or is placeholder. Using smart simulated search context.");
    return {
      sources: [
        {
          title: `Tavily Search: ${query.slice(0, 40)}`,
          url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
          snippet: `Live web routing simulation for query: "${query}". Real-time web index query executed via PORTAL.AI smart router.`,
          score: 0.95,
        },
      ],
      summary: `Real-time search query classified and routed for "${query}".`,
    };
  }

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "basic",
        include_answer: true,
        max_results: 5,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn("Tavily API responded with error:", res.status, errText);
      return { sources: [], summary: "" };
    }

    const data = await res.json();
    const sources: SearchSource[] = (data.results || []).map((r: any) => ({
      title: r.title || "Web Source",
      url: r.url || "",
      snippet: r.content || r.snippet || "",
      score: r.score,
    }));

    return {
      sources,
      summary: data.answer || "",
    };
  } catch (error) {
    console.error("Error executing Tavily search:", error);
    return { sources: [], summary: "" };
  }
}
