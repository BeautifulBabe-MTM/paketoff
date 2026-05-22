import { translateString } from '@/lib/translate-server'
import HomeClient from '@/components/HomeClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params

  const title = await translateString('Paketoff Production — Производство упаковки и пакетов', locale)
  const description = await translateString('B2B / B2C База данных упаковки и пакетов. Заказывайте качественную продукцию напрямую от производителя.', locale)

  return {
    title,
    description,
  }
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params

  const subtitle = await translateString('B2B / B2C База даних упаковки та пакетів', locale)
  const buttonText = await translateString('Відкрити каталог', locale)

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-[#09090b] dark:text-zinc-100 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col justify-center items-center px-4">
      <HomeClient 
        locale={locale} 
        subtitle={subtitle} 
        buttonText={buttonText} 
      />
    </div>
  )
}