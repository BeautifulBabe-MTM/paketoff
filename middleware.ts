import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const supportedLocales = ['uk', 'en', 'de', 'fr', 'it']
const defaultLocale = 'uk'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Проверяем, есть ли уже локаль в пути (например, /en/packs)
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // Игнорируем системные файлы, картинки и API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Если локали нет, перенаправляем на дефолтную (/uk)
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}