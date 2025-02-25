import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware redirects old routes to new Next.js App Router routes
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Handle authentication paths
  if (url.pathname === '/auth/login' || url.pathname === '/auth/signup') {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Keep the same URL if no redirects match
  return NextResponse.next();
}
