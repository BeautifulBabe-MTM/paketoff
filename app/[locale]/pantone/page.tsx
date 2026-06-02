import { translateString } from '@/lib/translate-server'
import StaticPageClient from '@/components/StaticPageClient'
import { Palette } from 'lucide-react'
import PantoneGrid from '@/components/PantoneGrid'

export const revalidate = 86400

interface Props { params: Promise<{ locale: string }> }

export default async function PantonePage({ params }: Props) {
  const { locale } = await params

  const [title, sub, copyLabel] = await Promise.all([
    translateString('Кольори Pantone', locale),
    translateString('Стандартизовані палітри для флексодруку та шовкотрафарету', locale),
    translateString('Натисніть на картку, щоб скопіювати код кольору', locale),
  ])

  // Базовый полиграфический набор плашек (Формат: HEX, Название)
  const colors = [
    { hex: '#FFD100', code: 'Pantone Yellow C' },
    { hex: '#E87722', code: 'Pantone 1585 C' },
    { hex: '#D50032', code: 'Pantone 186 C' },
    { hex: '#C8102E', code: 'Pantone 187 C' },
    { hex: '#B11226', code: 'Pantone 200 C' },
    { hex: '#DA1884', code: 'Pantone Rhodamine Red C' },
    { hex: '#7A1C7A', code: 'Pantone 2617 C' },
    { hex: '#002F6C', code: 'Pantone 281 C' },
    { hex: '#003DA5', code: 'Pantone 286 C' },
    { hex: '#0085CA', code: 'Pantone Process Blue C' },
    { hex: '#00A3E0', code: 'Pantone 299 C' },
    { hex: '#00A89F', code: 'Pantone 3272 C' },
    { hex: '#00A651', code: 'Pantone Green C' },
    { hex: '#78BE20', code: 'Pantone 360 C' },
    { hex: '#131E29', code: 'Pantone Black 6 C' },
    { hex: '#888B8D', code: 'Pantone Cool Gray 7 C' },
    { hex: '#D9D9D6', code: 'Pantone Cool Gray 1 C' },
    { hex: '#8A6240', code: 'Pantone 4645 C' },
  ]

  return (
    <StaticPageClient title={title} subtitle={sub} iconName="info">
      <p className="text-center md:text-left text-zinc-400 dark:text-zinc-500 uppercase tracking-tight text-[10px]">
        💡 {copyLabel}
      </p>
      
      {/* Выносим интерактивную сетку в мелкий клиентский компонент ниже */}
      <PantoneGrid colors={colors} />
    </StaticPageClient>
  )
}