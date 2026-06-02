'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ShoppingBag, ArrowLeft, Package } from 'lucide-react'
import { CartItem, getCartItems, saveCartItems } from '@/lib/cart'
import CheckoutForm from './CheckoutForm'

interface CartClientProps {
  locale: string
  translations: Record<string, string>
}

export default function CartClient({ locale, translations }: CartClientProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [isCheckoutStage, setIsCheckoutStage] = useState(false) // Стейт переключения на форму
  const [translatedNames, setTranslatedNames] = useState<Record<string, string>>({}) // Словарь переводов с сервера

  useEffect(() => {
    const items = getCartItems()
    setCartItems(items)
    setIsMounted(true)

    // Запускаем перевод "на лету" через API, если локаль не украинская
    if (locale !== 'uk' && items.length > 0) {
      fetch('/api/translate-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, locale })
      })
        .then(res => res.json())
        .then(data => {
          if (data.translatedNames) {
            setTranslatedNames(data.translatedNames)
          }
        })
        .catch(err => console.error("⚠️ Ошибка подгрузки локализации имен корзины:", err))
    }
  }, [locale])

  if (!isMounted) return null

  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id)
    setCartItems(updated)
    saveCartItems(updated)
  }

  const handleQtyChange = (id: string, newQty: number) => {
    const validQty = Math.max(1, newQty)
    const updated = cartItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: validQty,
          totalPrice: item.pricePerUnit * validQty
        }
      }
      return item
    })
    setCartItems(updated)
    saveCartItems(updated)
  }

  const totalCartSum = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)

  // Валюта берется из объекта товара, дефолтимся к грн, если пусто
  const currencySign = cartItems[0]?.currency === 'USD' ? '$' : 'грн'

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-400 dark:text-zinc-600 mb-5">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="text-xl font-mono uppercase tracking-wider font-bold text-zinc-900 dark:text-white mb-2">
          {translations.empty}
        </h1>
        <Link
          href={`/${locale}/packs`}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-500 hover:text-emerald-600 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {translations.backToCatalog}
        </Link>
      </div>
    )
  }

  // ЕСЛИ ПОЛЬЗОВАТЕЛЬ НАЖАЛ "ОФОРМИТЬ" -> ПОКАЗЫВАЕМ ЭКРАН ЧЕКАУТА
  if (isCheckoutStage) {
    return (
      <CheckoutForm
        locale={locale}
        cartItems={cartItems}
        totalSum={totalCartSum}
        currencySign={currencySign}
        translations={translations}
        translatedNames={translatedNames} // <-- Прокидываем переводы в форму заказа
        onBack={() => setIsCheckoutStage(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#09090b] dark:text-zinc-100 pt-28 pb-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
          <h1 className="text-2xl font-black tracking-tight uppercase font-sans text-zinc-900 dark:text-white">
            {translations.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* СПИСОК ТОВАРОВ */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:border-zinc-800/80 gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-200/60 dark:border-zinc-800/50">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <Package className="w-6 h-6 stroke-[1]" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">
                      {/* Берем перевод из API по originalName (или по name), откатываемся к статике если еще не загрузилось */}
                      {translatedNames[item.originalName || item.name] || item.name}
                    </h2>
                    <div className="text-[11px] font-mono text-zinc-400 space-y-0.5 uppercase tracking-wide">
                      <div>{translations.sizeLabel}: <span className="text-zinc-700 dark:text-zinc-300 font-bold">{item.size}</span></div>
                      {item.density && <div>{translations.densityLabel}: <span className="text-zinc-700 dark:text-zinc-300 font-bold">{item.density}</span></div>}
                      <div>
                        {translations.printLabel}:{' '}
                        <span className="text-emerald-500 font-bold">
                          {item.print === 'none' ? (
                            translations.noPrintBtn || {
                              en: 'No printing',
                              de: 'Ohne Druck',
                              fr: 'Sans impression',
                              it: 'Senza stampa',
                              uk: 'Без друку'
                            }[locale] || 'No printing'
                          ) : (
                            item.print
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-none pt-3 sm:pt-0 border-zinc-100 dark:border-zinc-900">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono text-zinc-400 uppercase">{translations.qtyLabel}</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value) || 0)}
                        className="w-20 bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1 text-xs font-mono font-bold text-center dark:bg-zinc-900 dark:border-zinc-800 focus:outline-none focus:border-zinc-400"
                      />
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">{translations.pcsUnit}</span>
                    </div>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <span className="block text-[10px] font-mono text-zinc-400 uppercase">{translations.totalLabel}</span>
                    <span className="text-sm font-mono font-bold text-zinc-900 dark:text-white">
                      {item.totalPrice.toLocaleString('ru-RU')} {currencySign}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ИТОГОВАЯ ПАНЕЛЬ */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-6 dark:bg-zinc-950 dark:border-zinc-800/80 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-900 pb-3">
              {translations.summaryTitle}
            </h3>

            <div className="flex items-baseline justify-between">
              <span className="text-sm font-mono text-zinc-500">{translations.totalCartSumLabel}:</span>
              <span className="text-2xl font-mono font-black text-zinc-900 dark:text-white tracking-tight">
                {totalCartSum.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">{currencySign}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutStage(true)}
              className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.99] transition-all cursor-pointer"
            >
              {translations.checkoutBtn}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}