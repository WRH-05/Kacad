import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale } from './lib/i18n';

const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const locale = firstSegment && isLocale(firstSegment) ? firstSegment : null;
  const resolvedLocale = locale ?? request.cookies.get('NEXT_LOCALE')?.value ?? defaultLocale;

  const response = locale
    ? NextResponse.next()
    : NextResponse.redirect(
        new URL(`/${resolvedLocale}${pathname === '/' ? '' : pathname}`, request.url)
      );

  response.cookies.set('NEXT_LOCALE', resolvedLocale, {
    path: '/',
    sameSite: 'lax'
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)']
};