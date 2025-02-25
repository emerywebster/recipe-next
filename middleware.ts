import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define auth routes that should redirect to home if already authenticated
const authRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has an authentication cookie
  // Supabase stores auth in multiple cookies, check for any that might indicate auth
  const hasAuthCookie = request.cookies.getAll().some((cookie) => cookie.name.includes('sb-') && cookie.value);

  const isAuthenticated = hasAuthCookie;

  // Only redirect login page when authenticated
  if (authRoutes.some((route) => pathname.startsWith(route)) && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
