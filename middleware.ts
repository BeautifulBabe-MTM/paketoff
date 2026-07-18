import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt";

const locales = ['uk', 'en', 'de', 'fr', 'it']
const defaultLocale = 'uk'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/auth')) return NextResponse.next();

  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  const isProfilePage = /\/[a-z]{2}\/profile/.test(pathname);
  const isAuthPage = /\/[a-z]{2}\/(login|register)/.test(pathname);

  const getLocale = (pathname: string) => {
    const segments = pathname.split('/');
    return locales.includes(segments[1]) ? segments[1] : defaultLocale;
  };

  if (isProfilePage && !token) {
    const locale = getLocale(pathname);
    return NextResponse.redirect(new URL(`/${locale}/login`, request.nextUrl.origin));
  }

  if (isAuthPage && token) {
    const locale = getLocale(pathname);
    return NextResponse.redirect(new URL(`/${locale}/profile`, request.nextUrl.origin));
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  let locale = request.cookies.get('NEXT_LOCALE')?.value

  if (!locale) {
    try {
      const acceptLanguage = request.headers.get('accept-language')
      if (acceptLanguage) {
        const match = locales.find(lang => acceptLanguage.toLowerCase().includes(lang))
        locale = match || defaultLocale
      } else {
        locale = defaultLocale
      }
    } catch (e) {
      locale = defaultLocale
    }
  }

  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale
  }

  const url = request.nextUrl.clone()

  if (pathname === '/') {
    url.pathname = `/${locale}`
  } else {
    url.pathname = `/${locale}${pathname.startsWith('/') ? pathname : '/' + pathname}`
  }

  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\.[\\w]+$).*)',
    '/'
  ],
}