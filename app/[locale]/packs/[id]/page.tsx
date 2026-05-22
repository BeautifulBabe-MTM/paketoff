import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import ProductConfigurator from '@/components/ProductConfigurator'
import { translateString } from '@/lib/translate-server' // Подключаем твой единый серверный переводчик

interface Props {
    params: Promise<{ id: string; locale: string }>
}

// Хелпер для перевода динамических полей товара из БД
async function getTranslatedProduct(product: any, locale: string) {
    if (locale === 'uk') return product

    const translatedName = await translateString(product.name, locale)
    const translatedDescription = await translateString(product.description, locale)
    const translatedCategory = await translateString(product.category, locale)
    
    // Автоматически переводим массив ключевых слов из поля tags в БД
    const translatedTags = product.tags && Array.isArray(product.tags)
        ? await Promise.all(product.tags.map((tag: string) => translateString(tag, locale)))
        : []

    return {
        ...product,
        name: translatedName,
        description: translatedDescription,
        category: translatedCategory,
        tags: translatedTags
    }
}

// 1. Динамическая генерация мультиязычного SEO для поисковых роботов
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id, locale } = await params
    const product = await prisma.product.findUnique({ where: { id } })

    if (!product) {
        const fallbackTitle = await translateString('Пакет не знайдено', locale)
        return { title: fallbackTitle }
    }

    const translated = await getTranslatedProduct(product, locale)
    const fallbackDesc = translated.description ? translated.description.slice(0, 100) : ''
    
    // Формируем список ключевых слов из поля tags
    const keywordsString = translated.tags && translated.tags.length > 0 
        ? translated.tags.join(', ') 
        : ''

    // Переводим шаблон описания
    const seoDescriptionTemplate = `Замовити ${translated.name} розміром ${translated.size}. Висока якість, оптові ціни, швидка доставка. ${fallbackDesc}`
    const finalDescription = await translateString(seoDescriptionTemplate, locale)

    return {
        title: `${translated.name} | PACK LAB`,
        description: finalDescription,
        keywords: keywordsString,
        alternates: {
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
        where: { id },
        include: { price: true, printOptions: true } // Обязательно подтягиваем связанные таблицы цен и печати
    })

    if (!product) notFound()

    // Автоматически переводим динамический контент товара из базы перед рендером
    const translatedProduct = await getTranslatedProduct(product, locale)

    // ==========================================================
    // ПЕРЕВОД ВСЕХ СТАТИЧЕСКИХ СТРОК ДЛЯ СТРАНИЦЫ И КАЛЬКУЛЯТОРА
    // ==========================================================
    const backToCatalogText = await translateString('Назад до каталогу', locale)

    const configuratorTranslations = {
        sizeLabel: await translateString('РОЗМІР:', locale),
        densityLabel: await translateString('ЩІЛЬНІСТЬ:', locale),
        printLabel: await translateString('Виберіть варіант друку:', locale),
        noPrintBtn: await translateString('Без друку', locale),
        qtyLabel: await translateString('Кількість (шт.):', locale),
        pricePerUnitLabel: await translateString('Ціна за штуку:', locale),
        addToCartBtn: await translateString('Додати в кошик', locale),
    }

    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-[#09090b] dark:text-zinc-100 pt-28 pb-24 px-4 md:px-8 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            <div className="max-w-6xl mx-auto">

                {/* Кнопка назад — переведенный текст прилетает с сервера */}
                <Link
                    href={`/${locale}/packs`}
                    className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200 uppercase tracking-wider mb-8 transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                    {backToCatalogText}
                </Link>

                {/* Прокидываем переведенный продукт и объект со статическими переводами */}
                <ProductConfigurator 
                    product={translatedProduct} 
                    translations={configuratorTranslations} 
                />

                {/* Вывод хэштегов */}
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