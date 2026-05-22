import { translateString } from '@/lib/translate-server'
import HomeClient from '@/components/HomeClient'

export const revalidate = 86400 

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params
  const title = await translateString('Paketoff Production — Производство упаковки', locale)
  const description = await translateString('Расчет параметров тиража и база данных продукции напрямую от производителя.', locale)
  return { title, description }
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params

  const [
    subtitle, buttonText, calcTitle, calcSub,
    labelWidth, labelHeight, labelDensity, labelQuantity,
    resWeight, resVolume, resAlert
  ] = await Promise.all([
    translateString('B2B / B2C База даних упаковки та пакетів', locale),
    translateString('Відкрити каталог', locale),
    
    // Тексты калькулятора
    translateString('Логістичний розрахунок тиражу', locale),
    translateString('Швидкий калькулятор ваги та об’єму для планування доставки', locale),
    
    // Поля
    translateString('Ширина (см)', locale),
    translateString('Висота / Довжина (см)', locale),
    translateString('Щільність (мкм)', locale),
    translateString('Тираж (шт)', locale),
    
    // Результаты
    translateString('Загальна вага', locale),
    translateString('Приблизний об’єм', locale),
    translateString('Розрахунок є орієнтовним та залежить від типу сировини', locale),
  ])

  const calcTranslations = {
    title: calcTitle,
    sub: calcSub,
    width: labelWidth,
    height: labelHeight,
    density: labelDensity,
    quantity: labelQuantity,
    weight: resWeight,
    volume: resVolume,
    alert: resAlert
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-[#09090b] dark:text-zinc-100 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col justify-center items-center px-4 py-20 w-full">
      <HomeClient 
        locale={locale} 
        subtitle={subtitle} 
        buttonText={buttonText} 
        calc={calcTranslations}
      />
    </div>
  )
}