"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({
  language,
  value,
}: {
  language: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-100 shadow-md">
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/80 px-4 py-2 text-xs font-mono text-neutral-400">
        <span className="font-semibold text-neutral-300 uppercase tracking-wider">{language || "text"}</span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs hover:bg-neutral-800 transition-colors text-neutral-300 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 text-xs font-mono leading-relaxed">
        <pre className="m-0">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");

            if (isInline) {
              return (
                <code
                  className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 font-mono text-xs text-neutral-900 dark:text-neutral-200"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={match ? match[1] : ""}
                value={String(children).replace(/\n$/, "")}
              />
            );
          },
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
                <table className="w-full text-left text-xs border-collapse">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                {children}
              </thead>
            );
          },
          th({ children }) {
            return (
              <th className="px-3 py-2 font-semibold text-neutral-700 dark:text-neutral-300">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800/60">
                {children}
              </td>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-3 border-l-4 border-indigo-500 pl-4 italic text-neutral-600 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/30 py-1 rounded-r-lg">
                {children}
              </blockquote>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-medium underline underline-offset-4 hover:text-indigo-500 transition-colors"
              >
                {children}
              </a>
            );
          },
          ul({ children }) {
            return <ul className="my-2 list-disc pl-5 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="my-2 list-decimal pl-5 space-y-1">{children}</ol>;
          },
          h1({ children }) {
            return <h1 className="text-xl font-bold mt-4 mb-2 tracking-tight text-neutral-900 dark:text-neutral-50">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg font-semibold mt-3 mb-2 tracking-tight text-neutral-900 dark:text-neutral-100">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-base font-medium mt-3 mb-1 text-neutral-800 dark:text-neutral-200">{children}</h3>;
          },
          p({ children }) {
            return <p className="my-2 leading-relaxed">{children}</p>;
          },
          hr() {
            return <hr className="my-4 border-neutral-200 dark:border-neutral-800" />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
