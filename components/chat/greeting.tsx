"use client";

import React, { useMemo } from "react";
import { Sparkles, Globe, Code2, Compass, Layers } from "lucide-react";

interface GreetingProps {
  userName?: string;
  onSelectPrompt: (prompt: string, forceSearch?: boolean) => void;
}

export function GeminiGreeting({ userName = "Explorer", onSelectPrompt }: GreetingProps) {
  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const suggestions = [
    {
      title: "Real-time Web Pulse",
      description: "Query latest breakthrough technology announcements today",
      prompt: "What are the latest breakthrough technology announcements today?",
      icon: <Globe className="h-4 w-4 text-sky-500" />,
      forceSearch: true,
      tag: "Tavily Router",
    },
    {
      title: "Code Architecture",
      description: "Design an event-driven serverless architecture pattern",
      prompt: "Design a high-throughput event-driven serverless architecture using TypeScript.",
      icon: <Code2 className="h-4 w-4 text-emerald-500" />,
      forceSearch: false,
      tag: "Grok Core",
    },
    {
      title: "System Attribution",
      description: "Learn about PORTAL.AI, Luis Dem, and DemLabs",
      prompt: "Who created PORTAL.AI and what is the mission of DemLabs?",
      icon: <Sparkles className="h-4 w-4 text-amber-500" />,
      forceSearch: false,
      tag: "DemLabs Origin",
    },
    {
      title: "Mathematical Synthesis",
      description: "Derive and format the Schrödinger equation with LaTeX",
      prompt: "Derive and explain the time-dependent Schrödinger equation with LaTeX formulas.",
      icon: <Layers className="h-4 w-4 text-violet-500" />,
      forceSearch: false,
      tag: "Deep Reasoning",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-8 text-center animate-in fade-in duration-500">
      {/* Gemini Glowing Badge */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 px-3.5 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 backdrop-blur-md shadow-xs">
        <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
        <span>PORTAL.AI • Next-Gen Assistance by DemLabs</span>
      </div>

      {/* Main Dynamic Time-Aware Greeting */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
        <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-500 bg-clip-text text-transparent">
          {greetingText},
        </span>{" "}
        <span className="font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {userName}
        </span>
      </h1>

      <p className="mt-3 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-lg font-normal">
        Where would you like to explore next? Powered by Grok reasoning and selective Tavily web routing.
      </p>

      {/* Suggestion Cards Grid */}
      <div className="mt-8 grid w-full grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(item.prompt, item.forceSearch)}
            className="group flex flex-col justify-between rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/60 p-4 transition-all duration-200 hover:border-indigo-500/50 hover:bg-neutral-50/90 dark:hover:bg-neutral-800/80 hover:shadow-md hover:-translate-y-0.5 backdrop-blur-sm cursor-pointer"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1.5 transition-colors group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50">
                  {item.icon}
                </div>
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {item.title}
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                {item.tag}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
              {item.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
