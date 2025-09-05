import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /login, /promotions/123/files)
  const { pathname } = request.nextUrl;

  // If the user is on the login page, no need to check authentication
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // Check if user has access token
  const hasToken = request.cookies.get('access_token') || 
                   request.nextUrl.searchParams.get('token');

  // If no token and not on login page, redirect to login
  if (!hasToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except static files and API routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};