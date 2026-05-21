import { prisma } from '@/lib/prisma'
import { translateProductsList, translateString } from '@/lib/translate-server'
import CatalogFilters from '@/components/CatalogFilters'

export const revalidate = 0

interface Props {
    params: Promise<{ locale: string }> // Получаем текущий язык из URL
    searchParams: Promise<{ category?: string }>
}

export default async function PacksPage({ params, searchParams }: Props) {
    const { locale } = await params
    const { category } = await searchParams

    // 1. Фильтрация в БД по-прежнему идет по оригинальному uk-значению (из URL)
    const rawProducts = await prisma.product.findMany({
        where: category ? { category: category } : {},
        orderBy: { createdAt: 'desc' }
    })

    // 2. Собираем уникальный список категорий из базы для кнопок
    const allProducts = await prisma.product.findMany({
        select: { category: true }
    })
    const rawCategories = Array.from(new Set(allProducts.map(p => p.category)))

    // 3. Переводим массив товаров для карточек (теперь функция существует)
    const translatedProducts = await translateProductsList(rawProducts, locale)

    // 4. Маппим категории в объекты, чтобы сохранить оригинал для query-параметров
    const categoriesMapped = await Promise.all(
        rawCategories.map(async (cat) => {
            return {
                id: cat, // Украинский оригинал для роутинга и Prisma (например: "Пакети Банан")
                label: locale === 'uk' ? cat : await translateString(cat, locale) // Перевод на кнопке для юзера
            }
        })
    )

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-[#09090b] dark:text-zinc-100 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black pt-28 pb-24 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">

                {/* 5. Передаем полностью готовые структуры в фильтры */}
                <CatalogFilters
                    initialProducts={translatedProducts}
                    categories={categoriesMapped} // Улетает массив объектов вместо строк
                    currentCategory={category || null} // Сюда залетает uk-строка
                />
            </div>
        </div>
    )
}