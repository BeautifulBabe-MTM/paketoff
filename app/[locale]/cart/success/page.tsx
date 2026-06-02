import { translateString } from '@/lib/translate-server'

export default async function SuccessPage({ params }: { params: { locale: string } }) {
  const { locale } = params

  const [title, desc, btn] = await Promise.all([
    translateString('Замовлення прийнято!', locale),
    translateString('Дякуємо за довіру. Наш менеджер перевірить ваше замовлення та зв\'яжеться з вами найближчим часом для уточнення деталей та виставлення рахунку.', locale),
    translateString('Повернутись на головну', locale)
  ])

  return (
    <div className="min-h-screen flex items-center justify-center pt-28 pb-24 px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight">{title}</h1>
        <p className="text-sm text-zinc-500">
          {desc}
        </p>
        <a 
          href={`/${locale}`} 
          className="block w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 py-3 rounded-lg font-bold text-xs uppercase tracking-widest mt-6"
        >
          {btn}
        </a>
      </div>
    </div>
  )
}