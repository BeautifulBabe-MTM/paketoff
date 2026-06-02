import { translateString } from '@/lib/translate-server'
import StaticPageClient from '@/components/StaticPageClient'

export const revalidate = 86400

interface Props { params: Promise<{ locale: string }> }

export default async function AboutPage({ params }: Props) {
  const { locale } = await params

  const [title, sub, p1, p2, h2, b1, b2] = await Promise.all([
    translateString('Про нас', locale),
    translateString('Виробничі потужності Paketoff', locale),
    translateString('Packlab Production — це сучасне підприємство повного циклу з виготовлення поліетиленової упаковки та пакетів для B2B і B2C сегментів.', locale),
    translateString('Ми контролюємо весь процес: від екструзії (видуву плівки) до флексографічного друку логотипів та фінальної порізки готової продукції.', locale),
    translateString('Наші принципи', locale),
    translateString('Точність мікронажу: ми ніколи не занижуємо щільність плівки заради штучного здешевлення.', locale),
    translateString('Терміни: автоматизовані лінії дозволяють відвантажувати замовлення точно в обумовлений час.', locale),
  ])

  return (
    <StaticPageClient title={title} subtitle={sub} iconName="info">
      <div className="space-y-4 text-sm font-sans font-normal text-zinc-700 dark:text-zinc-300">
        <p>{p1}</p>
        <p>{p2}</p>
      </div>
      
      <div className="space-y-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
        <h2 className="text-zinc-900 dark:text-white font-bold uppercase text-xs tracking-wider">{h2}</h2>
        <ul className="list-disc pl-4 space-y-2">
          <li>{b1}</li>
          <li>{b2}</li>
        </ul>
      </div>
    </StaticPageClient>
  )
}