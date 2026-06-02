import { NextResponse } from 'next/server'
import { translateString } from '@/lib/translate-server' // Укажи правильный путь к твоему файлу переводчика

export async function POST(req: Request) {
  try {
    const { items, locale } = await req.json()
    
    if (locale === 'uk' || !items || !Array.isArray(items)) {
      return NextResponse.json({ translatedNames: {} })
    }

    const uniqueNames = Array.from(
      new Set(items.map((item: any) => item.originalName || item.name))
    ) as string[]

    const translationsArray = await Promise.all(
      uniqueNames.map(async (name) => {
        const translated = await translateString(name, locale)
        return { original: name, translated }
      })
    )

    const translatedNames = translationsArray.reduce((acc, curr) => {
      acc[curr.original] = curr.translated
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({ translatedNames })
  } catch (error) {
    console.error("🚨 Ошибка API перевода корзины:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}