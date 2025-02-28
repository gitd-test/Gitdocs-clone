import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

// Define your custom middleware logic
async function customMiddleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/ai-response")) {
    const prompt = req.headers.get("x-ai-prompt") || "";
    const enhancedPrompt = `${prompt} Enhance with additional context: [custom logic here]`;

    // Modify headers for downstream processing
    req.headers.set("x-enhanced-prompt", enhancedPrompt);

    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.log("Enhanced AI Prompt:", enhancedPrompt);
    }
  }
  return NextResponse.next();
}

export default async function middleware(req: NextRequest) {
  // Avoid redundant Clerk processing for non-API and static assets
  if (!req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Execute Clerk middleware if authentication is required
  const clerkResponse = clerkMiddleware(req as any);
  if (clerkResponse) return clerkResponse;

  // Execute custom middleware
  return customMiddleware(req);
}

// Matcher configuration
export const config = {
  matcher: [
    "/api/:path*",
  ],
};
