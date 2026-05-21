import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import ProductConfigurator from '@/components/ProductConfigurator'
import ThemeToggle from '@/components/ThemeToggle'

interface Props {
  params: Promise<{ id: string }>
}

// SEO метаданные для поисковиков
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) return { title: 'Пакет не найден' }

  // Безопасно режем описание, если его нет в базе
  const fallbackDesc = product.description ? product.description.slice(0, 100) : ''

  return {
    title: `${product.name} оптом | Купить от производителя`,
    description: `Заказать ${product.name} размером ${product.size}. Высокое качество, оптовые цены, быстрая доставка. ${fallbackDesc}`,
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  
  // Тянем товар со всеми вложенными прайсами и опциями печати
  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) notFound()

  return (
    // bg-zinc-50 для светлой, dark:bg-[#09090b] для темной темы
    <main className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-[#09090b] dark:text-zinc-100 pt-28 pb-24 px-4 md:px-8 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* Кнопка смены темы */}
        <ThemeToggle />
        
        {/* Кнопка назад — адаптирована под оба режима */}
        <Link 
          href="/packs" 
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200 uppercase tracking-wider mb-8 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Назад в каталог
        </Link>

        {/* Наш калькулятор, который мы до этого настроили под чистые просчеты из БД */}
        <ProductConfigurator product={product} />

      </div>
    </main>
  )
}