import { translateString } from '@/lib/translate-server'
import StaticPageClient from '@/components/StaticPageClient'
import { Phone } from 'lucide-react'

export const revalidate = 86400

interface Props { params: Promise<{ locale: string }> }

export default async function ContactsPage({ params }: Props) {
  const { locale } = await params

  const [title, sub, phoneLabel, emailLabel, addressLabel, hoursLabel, hoursVal] = await Promise.all([
    translateString('Контакти', locale),
    translateString('Зв’яжіться з відділом продажів виробництва', locale),
    translateString('Телефон', locale),
    translateString('Email для техзавдань', locale),
    translateString('Адреса виробництва', locale),
    translateString('Режим роботи', locale),
    translateString('Пн - Пт: 09:00 - 18:00', locale),
  ])

  return (
    <StaticPageClient title={title} subtitle={sub} iconName="info">
      <div className="grid grid-cols-1 gap-6 text-xs font-mono">
        <div className="p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/40 space-y-1">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">{phoneLabel}</span>
          <div className="text-sm font-bold text-zinc-900 dark:text-white font-sans">+38 (099) 000-00-00</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/40 space-y-1">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">{emailLabel}</span>
          <div className="text-sm font-bold text-zinc-900 dark:text-white font-sans">order@packlab.com</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/40 space-y-1">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">{addressLabel}</span>
          <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300 font-sans">Київ, вул. Промислова, 4</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/40 space-y-1">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">{hoursLabel}</span>
          <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{hoursVal}</div>
        </div>
      </div>
    </StaticPageClient>
  )
}