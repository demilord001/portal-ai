import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/chat(.*)"]);

const isClerkConfigured = 
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder") &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("example") &&
  !!process.env.CLERK_SECRET_KEY &&
  !process.env.CLERK_SECRET_KEY.includes("placeholder");

export default isClerkConfigured 
  ? clerkMiddleware(async (auth, req) => {
      const { userId } = await auth();

      // If user is already authenticated and visits "/" or auth routes, redirect to chat workspace
      if (
        userId &&
        (req.nextUrl.pathname === "/" ||
          req.nextUrl.pathname.startsWith("/sign-in") ||
          req.nextUrl.pathname.startsWith("/sign-up"))
      ) {
        return NextResponse.redirect(new URL("/chat", req.url));
      }

      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    })
  : () => NextResponse.next();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html|css|js|gif|svg|jpg|jpeg|png|woff|woff2|ico|csv|docx|xlsx|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
