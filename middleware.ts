import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['uk', 'en', 'de', 'fr', 'it']
const defaultLocale = 'uk'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

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