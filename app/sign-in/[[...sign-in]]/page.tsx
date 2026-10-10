import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4 py-12 text-neutral-100">
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-indigo-600/10 blur-[100px]" />
      <div className="mb-6 flex flex-col items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">PORTAL.AI</span>
        </Link>
        <span className="text-xs text-neutral-400">DemLabs • Luis Dem</span>
      </div>
      <div className="relative z-10">
        <SignIn appearance={{ elements: { rootBox: "shadow-2xl" } }} />
      </div>
    </main>
  );
}

