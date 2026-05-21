import { prisma } from '@/lib/prisma'
import ThemeToggle from '@/components/ThemeToggle'
import CatalogFilters from '@/components/CatalogFilters'

export const revalidate = 0 

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function PacksPage({ searchParams }: Props) {
  const { category } = await searchParams

  // 1. Тянем вообще все товары для сборки уникальных категорий
  const allProducts = await prisma.product.findMany({
    select: { category: true }
  })
  const categories = Array.from(new Set(allProducts.map(p => p.category)))

  // 2. Тянем товары для выбранной категории (или все, если категория не выбрана)
  // Сортировка по умолчанию: сначала новые (createdAt: 'desc')
  const products = await prisma.product.findMany({
    where: category ? { category: category } : {},
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-[#09090b] dark:text-zinc-100 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black pt-28 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <ThemeToggle />

        {/* Передаем всё в клиентский менеджер фильтрации */}
        <CatalogFilters 
          initialProducts={products} 
          categories={categories} 
          currentCategory={category || null} 
        />
      </div>
    </div>
  )
}