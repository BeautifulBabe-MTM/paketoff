import { translateString } from '@/lib/translate-server'
import StaticPageClient from '@/components/StaticPageClient'
import { Truck } from 'lucide-react'

export const revalidate = 86400

interface Props { params: Promise<{ locale: string }> }

export default async function DeliveryPage({ params }: Props) {
  const { locale } = await params

  const [title, sub, hDel, del1, del2, hPay, pay1, pay2] = await Promise.all([
    translateString('Доставка та оплата', locale),
    translateString('Умови логістики та розрахунків для клієнтів', locale),
    translateString('Доставка', locale),
    translateString('Самовивіз готової продукції безпосередньо з нашого складу виробництва.', locale),
    translateString('Доставка по всій країні надійними логістичними компаніями (Нова Пошта, Делівері) або попутним вантажним транспортом для великих оптових партій.', locale),
    translateString('Оплата', locale),
    translateString('Безготівковий розрахунок з ПДВ / без ПДВ на розрахунковий рахунок компанії.', locale),
    translateString('Гнучкі умови оплати для постійних b2b партнерів (передоплата + доплата за фактом готовності тиражу).', locale),
  ])

  return (
    <StaticPageClient title={title} subtitle={sub} iconName="info">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-zinc-900 dark:text-white font-bold uppercase text-xs tracking-wider">{hDel}</h2>
          <p>{del1}</p>
          <p>{del2}</p>
        </div>
        
        <div className="space-y-2 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <h2 className="text-zinc-900 dark:text-white font-bold uppercase text-xs tracking-wider">{hPay}</h2>
          <p>{pay1}</p>
          <p>{pay2}</p>
        </div>
      </div>
    </StaticPageClient>
  )
}