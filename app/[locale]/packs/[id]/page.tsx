import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import ProductConfigurator from '@/components/ProductConfigurator'

// Функция автоперевода отдельной строки на сервере
async function fetchTranslation(text: string, targetLang: string): Promise<string> {
    if (!text || targetLang === 'uk') return text
    try {
        const res = await fetch(
            `https://lingva.ml/api/v1/uk/${targetLang}/${encodeURIComponent(text)}`
        )
        const json = await res.json()
        return json.translation || text
    } catch (e) {
        console.error('Ошибка автоматического перевода:', e)
        return text // Если сервис упал — плавно фолбэчимся на исходный украинский контент
    }
}

// Хелпер для перевода всех полей товара. Next.js автоматически закеширует этот результат
async function getTranslatedProduct(product: any, locale: string) {
    if (locale === 'uk') return product

    const translatedName = await fetchTranslation(product.name, locale)
    const translatedDescription = await fetchTranslation(product.description, locale)
    
    // Автоматически переводим массив ключевых слов из твоего поля tags в БД
    const translatedTags = product.tags && Array.isArray(product.tags)
        ? await Promise.all(product.tags.map((tag: string) => fetchTranslation(tag, locale)))
        : []

    return {
        ...product,
        name: translatedName,
        description: translatedDescription,
        tags: translatedTags
    }
}

interface Props {
    params: Promise<{ id: string; locale: string }>
}

// 1. Динамическая генерация мультиязычного SEO для поисковых роботов
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id, locale } = await params
    const product = await prisma.product.findUnique({ where: { id } })

    if (!product) return { title: 'Пакет не знайдено' }

    // Переводим данные для метаданных на лету
    const translated = await getTranslatedProduct(product, locale)
    const fallbackDesc = translated.description ? translated.description.slice(0, 100) : ''
    
    // Формируем список ключевых слов из поля tags
    const keywordsString = translated.tags && translated.tags.length > 0 
        ? translated.tags.join(', ') 
        : ''

    return {
        title: `${translated.name} | PACK LAB`,
        description: `Заказать ${translated.name} размером ${translated.size}. Высокое качество, оптовые цены, быстрая доставка. ${fallbackDesc}`,
        keywords: keywordsString, // Сюда залетают твои переведенные ключевые слова для SEO
        alternates: {
            // Исправлено: ссылки теперь ведут строго на /packs/[id], как у тебя в структуре папок app
            canonical: `https://packlab.com/${locale}/packs/${id}`,
            languages: {
                'uk': `https://packlab.com/uk/packs/${id}`,
                'en': `https://packlab.com/en/packs/${id}`,
                'de': `https://packlab.com/de/packs/${id}`,
                'fr': `https://packlab.com/fr/packs/${id}`,
                'it': `https://packlab.com/it/packs/${id}`,
            }
        }
    }
}

// 2. Серверный рендеринг страницы товара
export default async function ProductPage({ params }: Props) {
    const { id, locale } = await params

    const product = await prisma.product.findUnique({
        where: { id }
    })

    if (!product) notFound()

    // Автоматически переводим контент товара (включая tags) перед рендером
    const translatedProduct = await getTranslatedProduct(product, locale)

    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-[#09090b] dark:text-zinc-100 pt-28 pb-24 px-4 md:px-8 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            <div className="max-w-6xl mx-auto">

                {/* Кнопка назад — динамически ведет в мультиязычный каталог */}
                <Link
                    href={`/${locale}/packs`}
                    className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200 uppercase tracking-wider mb-8 transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                    Назад до каталогу
                </Link>

                {/* Прокидываем уже полностью переведенный со всеми tags продукт в конфигуратор */}
                <ProductConfigurator product={translatedProduct} />

                {/* Вывод хэштегов с ключевыми словами для внутренней перелинковки */}
                {translatedProduct.tags && translatedProduct.tags.length > 0 && (
                    <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-2">
                        {translatedProduct.tags.map((tag: string, index: number) => (
                            <span 
                                key={index} 
                                className="text-[10px] font-mono tracking-wider uppercase bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 px-2 py-1 rounded"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

            </div>
        </main>
    )
}