import { prisma } from '@/lib/prisma'
import { translateProductsList, translateString } from '@/lib/translate-server'
import CatalogFilters from '@/components/CatalogFilters'
export const revalidate = 3600

interface Props {
    params: Promise<{ locale: string }> // Получаем текущий язык из URL
    searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({ params, searchParams }: Props) {
    const { locale } = await params
    const { category } = await searchParams

    const categoryTitle = category ? await translateString(category, locale) : ''
    const baseTitle = category ? `Каталог: ${categoryTitle}` : 'Каталог продукції — PACKLAB'

    const title = locale === 'uk' && !category ? baseTitle : await translateString(baseTitle, locale)
    const description = await translateString('Широкий вибір якісної упаковки та пакетів для вашого бізнесу від виробника PACKLAB.', locale)

    return {
        title,
        description,
    }
}

export default async function PacksPage({ params, searchParams }: Props) {
    const { locale } = await params
    const { category } = await searchParams

    const whereClause = category ? { category: category } : {};

    const [rawProducts, allProducts] = await Promise.all([
        prisma.product.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.product.findMany({ select: { category: true } })
    ]);

    const rawCategories = Array.from(new Set(allProducts.map(p => p.category)));

    const [translatedProducts, categoriesMapped] = await Promise.all([
        translateProductsList(rawProducts, locale),
        Promise.all(rawCategories.map(async (cat) => ({
            id: cat,
            label: locale === 'uk' ? cat : await translateString(cat, locale)
        })))
    ]);

    const totalCount = await prisma.product.count({
        where: category ? { category: category } : {}
    });

    const filterTranslations = {
        pageTitle: await translateString('Пакети та упаковка', locale),
        allProductsBtn: await translateString('Усі види продукції', locale), // Исправлено на чистый укр
        allSubcategoriesBtn: await translateString('Усі підкатегорії', locale),
        foundProductsLabel: await translateString('ЗНАЙДЕНО ТОВАРІВ:', locale),
        filterParamsTitle: await translateString('Параметри фільтрації', locale),
        noProductsText: await translateString('Товарів не знайдено за вказаними параметрами', locale), // Исправлено на чистый укр
        yesLabel: await translateString('Є', locale),
        noLabel: await translateString('Немає', locale),
        sections: {
            size: await translateString('Розмір', locale),
            color: await translateString('Колір', locale),
            density: await translateString('Щільність', locale),
            bottom: await translateString('Донна складка', locale),
            handle: await translateString('Посилена ручка', locale),
            weight: await translateString('Витримає вагу', locale),
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-[#09090b] dark:text-zinc-100 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black pt-28 pb-24 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Хедер страницы убрали, так как он красивее рендерится внутри CatalogFilters */}
                <CatalogFilters
                    initialProducts={translatedProducts}
                    categories={categoriesMapped}
                    currentCategory={category || null}
                    translations={filterTranslations}
                />
            </div>
        </div>
    )
}