import { prisma } from '@/lib/prisma'
import { Suspense } from 'react';
import { translateProductsList, translateString } from '@/lib/translate-server'
import CatalogFilters from '@/components/CatalogFilters'
import PackCardSkeleton from '@/components/PackCardSkeleton';
export const revalidate = 3600

interface Props {
    params: Promise<{ locale: string }>
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

async function ProductList({ where, locale, category, initialTranslations, categories }: any) {
    const [rawProducts, allProducts, totalCount] = await Promise.all([
        prisma.product.findMany({ where, take: 15, orderBy: { createdAt: 'desc' } }),
        prisma.product.findMany({ where, select: { id: true, category: true, subcategory: true, size: true, color: true, density: true, weight: true, bottom: true, handle: true } }),
        prisma.product.count({ where })
    ]);

    const translatedProducts = await translateProductsList(rawProducts, locale);

    return (
        <CatalogFilters
            initialProducts={translatedProducts}
            allAvailableProducts={allProducts}
            totalCount={totalCount}
            categories={categories}
            currentCategory={category || null}
            translations={initialTranslations}
        />
    )
}

export default async function PacksPage({ params, searchParams }: Props) {
    const { locale } = await params
    const { category } = await searchParams
    const where = category ? { category } : {}

    const allCategoriesRaw = await prisma.product.findMany({ distinct: ['category'], select: { category: true } });
    const categoriesMapped = await Promise.all(allCategoriesRaw.map(async (p) => ({
        id: p.category,
        label: locale === 'uk' ? p.category : await translateString(p.category, locale)
    })));

    const filterTranslations = {
        pageTitle: await translateString('Пакети та упаковка', locale),
        allProductsBtn: await translateString('Усі види продукції', locale),
        allSubcategoriesBtn: await translateString('Усі підкатегорії', locale),
        foundProductsLabel: await translateString('ЗНАЙДЕНО ТОВАРІВ:', locale),
        filterParamsTitle: await translateString('Параметри фільтрації', locale),
        noProductsText: await translateString('Товарів не знайдено за вказаними параметрами', locale), 
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
                <Suspense fallback={<PackCardSkeleton />}>
                    <ProductList
                        where={where}
                        locale={locale}
                        category={category}
                        initialTranslations={filterTranslations}
                        categories={categoriesMapped}
                    />
                </Suspense>
            </div>
        </div>
    )
}