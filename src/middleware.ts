import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  // If the user is trying to access the tasks page without a session, redirect to login
  if (pathname.startsWith('/tasks') && !sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the user is logged in and tries to access the login page, redirect to tasks
  if (pathname === '/' && sessionCookie) {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for API routes, static files, and image optimization files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};