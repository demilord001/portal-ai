"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Sparkles,
  ArrowRight,
  Globe,
  Zap,
  Shield,
  Database,
  FileCode,
  Layers,
  CheckCircle2,
  Cpu,
  Search,
  ChevronRight,
  Bot,
  Terminal,
  Paperclip,
  Share2,
} from "lucide-react";

export default function LandingPage() {
  const [activePreviewTab, setActivePreviewTab] = useState<"search" | "code" | "persona">("search");

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-sans">
      {/* Background Ambient Glow Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-pink-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-[600px] -right-40 h-[400px] w-[600px] rounded-full bg-gradient-to-br from-sky-600/15 to-indigo-600/10 blur-[120px]" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">PORTAL.AI</span>
                <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.2 text-[10px] font-mono font-semibold text-indigo-400">
                  v1.0
                </span>
              </div>
              <span className="text-[10px] font-medium text-neutral-400">DemLabs</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#routing" className="hover:text-white transition-colors">
              Smart Router
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              Architecture
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <Link
                href="/sign-in?redirect_url=/chat"
                className="hidden sm:inline-flex rounded-xl px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-neutral-950 px-4 py-2 text-xs font-semibold shadow-md hover:bg-neutral-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Launch Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Go to Chat</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center">
        {/* Dynamic Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-4 py-1.5 text-xs text-neutral-300 backdrop-blur-md shadow-xs mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-white">Next-Gen Assistance</span>
          <span className="text-neutral-500">•</span>
          <span>Architected @ DemLabs</span>
        </div>

        {/* Hero Title */}
        <h1 className="mx-auto max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Unleash frontier intelligence through{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            PORTAL.AI
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-neutral-400 leading-relaxed font-light">
          The ultimate access to next-gen AI assistance, selective real-time routing and multimodal attachment ingestion in an ultra-sleek workspace.
        </p>

        {/* CTA Group */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/chat"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Enter Chat Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/sign-up"
            className="flex items-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-neutral-200 hover:text-white backdrop-blur-md transition-all"
          >
            <span>Create Free Account</span>
          </Link>
        </div>

        {/* Interactive Gemini-Style Preview Sandbox */}
        <div className="mt-16 mx-auto max-w-4xl rounded-3xl border border-neutral-800/80 bg-neutral-900/60 p-2 shadow-2xl backdrop-blur-2xl">
          {/* Preview Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-neutral-500">portal.ai/preview</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-neutral-950 p-1 text-xs">
              <button
                type="button"
                onClick={() => setActivePreviewTab("search")}
                className={`rounded-lg px-3 py-1 font-medium transition-all ${
                  activePreviewTab === "search"
                    ? "bg-neutral-800 text-white shadow-xs"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Live Web Router
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab("code")}
                className={`rounded-lg px-3 py-1 font-medium transition-all ${
                  activePreviewTab === "code"
                    ? "bg-neutral-800 text-white shadow-xs"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                AI Architecture
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab("persona")}
                className={`rounded-lg px-3 py-1 font-medium transition-all ${
                  activePreviewTab === "persona"
                    ? "bg-neutral-800 text-white shadow-xs"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                DemLabs Identity
              </button>
            </div>
          </div>

          {/* Interactive Chat Box Mock */}
          <div className="p-6 text-left space-y-4">
            {activePreviewTab === "search" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-xs bg-white text-neutral-950 px-4 py-2.5 text-xs font-medium max-w-md shadow-xs">
                    What are the latest updates in commercial quantum computing this week?
                  </div>
                </div>

                {/* Assistant Response with Tavily Pill */}
                <div className="flex gap-3 items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shrink-0 mt-1">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-xs border border-neutral-800 bg-neutral-950/80 p-4 text-xs text-neutral-300 leading-relaxed max-w-xl">
                    <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-sky-800/60 bg-sky-950/50 px-2.5 py-0.5 text-[11px] text-sky-300">
                      <Globe className="h-3 w-3 text-sky-400" />
                      <span>Tavily Router: 5 real-time sources synthesized</span>
                    </div>
                    <p className="mb-2">
                      Recent reports indicate breakthrough progress in fault-tolerant quantum error correction and topological qubit fidelity:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-neutral-400">
                      <li>Quantum logic gates achieved sub-0.1% error margins across 128 logical qubits.</li>
                      <li>Hybrid quantum-classical cloud pipelines reduced algorithmic latency by 4x.</li>
                    </ul>
                    <div className="mt-3 pt-2 border-t border-neutral-800 text-[10px] text-neutral-500 font-mono">
                      Engine: Grok-2 • Verified via Tavily Real-Time Index • Luis Dem @ DemLabs
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === "code" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-xs bg-white text-neutral-950 px-4 py-2.5 text-xs font-medium max-w-md shadow-xs">
                    Show me the selective Tavily search classifier in TypeScript.
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shrink-0 mt-1">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-xs border border-neutral-800 bg-neutral-950/80 p-4 text-xs text-neutral-300 leading-relaxed max-w-xl font-mono">
                    <div className="text-neutral-400 mb-2">// Zero-waste search routing classifier</div>
                    <div className="bg-neutral-900 rounded-lg p-3 text-[11px] text-indigo-300 overflow-x-auto leading-relaxed border border-neutral-800">
                      {`export function shouldTriggerWebSearch(query: string): boolean {
  if (isConversationalOrCoding(query)) return false; // 0ms bypass
  return hasTemporalSignals(query) || hasLiveEntitySignals(query);
}`}
                    </div>
                    <div className="mt-2 text-neutral-400 text-[11px]">
                      By bypassing standard conversational prompts, PORTAL.AI preserves your Tavily API credits while maximizing response velocity.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === "persona" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-xs bg-white text-neutral-950 px-4 py-2.5 text-xs font-medium max-w-md shadow-xs">
                    Who created you and what is your core mission?
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shrink-0 mt-1">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-xs border border-neutral-800 bg-neutral-950/80 p-4 text-xs text-neutral-300 leading-relaxed max-w-xl">
                    <h4 className="font-semibold text-white mb-1">PORTAL.AI System Attestation</h4>
                    <p className="mb-2">
                      I am <strong>PORTAL.AI</strong>, architected by lead developer <strong>Luis Dem</strong> at <strong>DemLabs</strong>.
                    </p>
                    <p className="text-neutral-400">
                      Our mission is to provide the ultimate access to next-gen assistance, providing versatile, highly accurate, and intelligent responses worldwide.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-neutral-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-semibold mb-2">
            Engineered For Excellence
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Six pillars of next-gen intelligence
          </h3>
          <p className="mt-3 text-sm text-neutral-400">
            Every layer in PORTAL.AI is built for responsiveness, precision, and privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Grok Core */}
          <div className="group rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-neutral-900/80 hover:-translate-y-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="h-5 w-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Grok (xAI) Intelligence Core</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Powered by xAI frontier models offering razor-sharp analytical reasoning, nuanced language comprehension, and deep code synthesis.
            </p>
          </div>

          {/* Card 2: Tavily Search */}
          <div className="group rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 transition-all duration-300 hover:border-sky-500/50 hover:bg-neutral-900/80 hover:-translate-y-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 mb-4 group-hover:scale-110 transition-transform">
              <Globe className="h-5 w-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Selective Tavily Web Search</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Intelligent query routing triggers web searches strictly when real-time information is needed, bypassing conversational prompts to preserve credits.
            </p>
          </div>

          {/* Card 3: Multimodal */}
          <div className="group rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 transition-all duration-300 hover:border-purple-500/50 hover:bg-neutral-900/80 hover:-translate-y-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Paperclip className="h-5 w-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Multimodal Attachments</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Upload code files, PDF documents, CSV/JSON datasets, high-res images, and audio tracks directly into the prompt bar for multimodal analysis.
            </p>
          </div>

          {/* Card 4: Neon DB */}
          <div className="group rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 transition-all duration-300 hover:border-emerald-500/50 hover:bg-neutral-900/80 hover:-translate-y-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Database className="h-5 w-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Neon Serverless Postgres</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              End-to-end conversation persistence with Drizzle ORM. Instant session retrieval, rename operations, and cascade deletion support.
            </p>
          </div>

          {/* Card 5: Clerk Auth */}
          <div className="group rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 transition-all duration-300 hover:border-amber-500/50 hover:bg-neutral-900/80 hover:-translate-y-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Shield className="h-5 w-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Clerk Zero-Trust Auth</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Next-generation authentication with user profile management, session verification via Next.js middleware, and personalized time greetings.
            </p>
          </div>

          {/* Card 6: Gemini Design */}
          <div className="group rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 transition-all duration-300 hover:border-pink-500/50 hover:bg-neutral-900/80 hover:-translate-y-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 mb-4 group-hover:scale-110 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Sleek UI System</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Minimalist layout, glassmorphic floating bars, LaTeX math formatting, syntax-highlighted code blocks with copy buttons, and voice playback.
            </p>
          </div>
        </div>
      </section>

      {/* Smart Query Router Section */}
      <section id="routing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-neutral-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-sky-400 font-semibold">
              Intelligent Efficiency
            </span>
            <h3 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Selective Tavily Routing.<br />Zero Latency Waste.
            </h3>
            <p className="mt-4 text-sm text-neutral-400 leading-relaxed font-light">
              Unlike legacy assistants that query the web on every turn or fail to search when needed, PORTAL.AI features an intelligent classification pipeline.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-neutral-800/90 bg-neutral-900/50 p-3.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-semibold text-white">Bypass Conversational Inquiries</h5>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Coding, math, creative writing, and conceptual queries route straight to Grok for instant generation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-neutral-800/90 bg-neutral-900/50 p-3.5">
                <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-semibold text-white">Live Temporal & Fact-Checking Trigger</h5>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Dates, prices, breaking news, tournaments, and releases trigger Tavily with cited source cards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-neutral-800/90 bg-neutral-900/50 p-3.5">
                <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-semibold text-white">User Manual Override</h5>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Toggle the real-time globe icon inside the chat interface to force web indexing on demand.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-indigo-400" />
              <span>Router Decision Matrix</span>
            </h4>

            <div className="space-y-3 font-mono text-xs">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3">
                <div className="flex justify-between items-center text-neutral-400 mb-1">
                  <span>&quot;Explain quicksort in Rust&quot;</span>
                  <span className="text-emerald-400 font-semibold">BYPASS SEARCH</span>
                </div>
                <span className="text-[10px] text-neutral-500">→ Grok Reasoning Core (0ms router lag)</span>
              </div>

              <div className="rounded-xl border border-sky-900/40 bg-sky-950/20 p-3">
                <div className="flex justify-between items-center text-neutral-200 mb-1">
                  <span>&quot;Latest NASA Artemis mission updates&quot;</span>
                  <span className="text-sky-400 font-semibold">TAVILY DISPATCH</span>
                </div>
                <span className="text-[10px] text-sky-300/70">→ 5 verified web sources indexed & cited</span>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3">
                <div className="flex justify-between items-center text-neutral-400 mb-1">
                  <span>&quot;Who is Luis Dem and DemLabs?&quot;</span>
                  <span className="text-indigo-400 font-semibold">SYSTEM PERSONA</span>
                </div>
                <span className="text-[10px] text-neutral-500">→ Direct attribution synthesis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DemLabs & Luis Dem Spotlight */}
      <section id="demlabs" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-neutral-800/80">
        <div className="rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900/90 via-neutral-900/40 to-indigo-950/20 p-8 sm:p-12 text-center backdrop-blur-xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Created by Luis Dem • DemLabs
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-neutral-400 leading-relaxed font-light">
            <strong>PORTAL.AI</strong> was conceptualized and developed by <strong>Luis Dem</strong> at <strong>DemLabs</strong> to bridge the gap between frontier reasoning and real-time world context.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span>Lead Developer: <strong>Luis Dem</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              <span>Company: <strong>DemLabs</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Stack: Next.js 16 • Clerk • Neon • Grok • Tavily</span>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-neutral-950 px-5 py-2.5 text-xs font-semibold hover:bg-neutral-100 transition-all shadow-md"
            >
              <span>Experience PORTAL.AI</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 text-neutral-400">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="font-semibold text-white">PORTAL.AI</span>
            <span>• Built by Luis Dem @ DemLabs</span>
          </div>

          <div className="flex items-center gap-6 text-neutral-500">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#routing" className="hover:text-white transition-colors">Tavily Routing</a>
            <Link href="/chat" className="hover:text-white transition-colors">Chat Workspace</Link>
            <Link href="/sign-in" className="hover:text-white transition-colors">Sign In</Link>
          </div>

          <div className="text-[11px] text-neutral-500">
            © {new Date().getFullYear()} DemLabs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
