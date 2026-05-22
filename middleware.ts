import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['uk', 'en', 'de', 'fr', 'it']
const defaultLocale = 'uk'

export function middleware(request: NextRequest) {
  // Получаем чистый путь (например: "/", "/packs", "/about")
  const pathname = request.nextUrl.pathname

  // 1. Проверяем, есть ли УЖЕ локаль в URL
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Если язык уже есть в URL — ничего не делаем, пускаем дальше
  if (pathnameHasLocale) return NextResponse.next()

  // 2. Если языка в URL нет, определяем, какой язык поставить
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
      locale = defaultLocale // Фолбэк, если заголовки вообще пустые или заблокированы в инкогнито
    }
  }

  // На всякий пожарный проверяем, что в переменной locale не оказался пустой хлам
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale
  }

  // 3. ФОРМИРУЕМ НОВЫЙ УРЛ ДЛЯ РЕДИРЕКТА
  // Создаем чистый клон текущего URL
  const url = request.nextUrl.clone()

  if (pathname === '/') {
    url.pathname = `/${locale}`
  } else {
    // Если шли на /packs, делаем /uk/packs. Заменяем слэши, чтобы не было двойных "//"
    url.pathname = `/${locale}${pathname.startsWith('/') ? pathname : '/' + pathname}`
  }

  // Возвращаем чистый редирект
  return NextResponse.redirect(url)
}

export const config = {
  // Матчер, который железно ловит главную "/" и любые текстовые страницы каталога,
  // но полностью игнорирует статику, картинки, шрифты и API-роуты.
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\.[\\w]+$).*)',
    '/' // Явно указываем корень, чтобы мидлвар его точно не проспал
  ],
}