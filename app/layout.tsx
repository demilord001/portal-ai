import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PORTAL.AI — Next-Gen Assistance by DemLabs",
  description:
    "The ultimate access to next-gen AI assistance. Architected by Luis Dem at DemLabs. Powered by Grok xAI reasoning and Tavily Smart Web Routing.",
  icons: {
    icon: "/favicon.ico",
  },
};

const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );

  if (!hasClerkKey) {
    return content;
  }

  return <ClerkProvider>{content}</ClerkProvider>;
}

