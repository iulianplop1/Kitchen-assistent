import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const pathname = req.nextUrl.pathname;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  ) {
    return res;
  }

  try {
    // Get the current user - this authenticates the session with the server
    // Using getUser() instead of getSession() for security
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    
    const hasSession = !!user;

    const isAuthPage = pathname === '/auth' || pathname.startsWith('/auth/');

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware]', {
        pathname,
        hasSession,
        userId: user?.id,
        isAuthPage,
      });
    }

    // If no session and trying to access protected route
    if (!hasSession && !isAuthPage) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Middleware] Redirecting to /auth - no session');
      }
      const url = req.nextUrl.clone();
      url.pathname = '/auth';
      const redirectRes = NextResponse.redirect(url);
      // Copy cookies to redirect response
      res.cookies.getAll().forEach((cookie) => {
        redirectRes.cookies.set(cookie.name, cookie.value);
      });
      return redirectRes;
    }

    // If has session and trying to access auth page, redirect to home
    if (hasSession && isAuthPage) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Middleware] Redirecting to / - has session');
      }
      const url = req.nextUrl.clone();
      url.pathname = '/';
      const redirectRes = NextResponse.redirect(url);
      // Copy cookies to redirect response
      res.cookies.getAll().forEach((cookie) => {
        redirectRes.cookies.set(cookie.name, cookie.value);
      });
      return redirectRes;
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow the request to proceed
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|test-supabase).*)'],
};

