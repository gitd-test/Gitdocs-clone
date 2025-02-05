import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

// Define your custom middleware logic
async function customMiddleware(req: NextRequest) {
  // Check if the request matches your AI-related criteria
  if (req.nextUrl.pathname.startsWith('/api/ai-response')) {
    const prompt = req.headers.get('x-ai-prompt') || '';
    const enhancedPrompt = `${prompt} Enhance with additional context: [custom logic here]`;

    // Optionally modify headers for downstream API routes
    req.headers.set('x-enhanced-prompt', enhancedPrompt);

    // Log for debugging
    console.log('Enhanced AI Prompt:', enhancedPrompt);
  }

  return NextResponse.next();
}

export default async function middleware(req: NextRequest, event: any) {
  // Execute Clerk middleware
  const clerkResponse = clerkMiddleware(req, event);
  if (clerkResponse) return clerkResponse;


  // Execute custom middleware
  return customMiddleware(req);
}

// Configure the matcher
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
