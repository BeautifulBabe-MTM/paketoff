'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Package } from 'lucide-react'

interface PriceTier {
  minQty: number
  price: number
}

interface PrintOption {
  code: string
  quantity: number
  price: number
}

interface ProductConfiguratorProps {
  product: {
    id: string
    name: string
    category: string
    currency: string
    size: string
    description: string
    material?: string | null
    density?: string | null
    images: string[]
    price: PriceTier[]
    printOptions: PrintOption[]
  }
}

export default function ProductConfigurator({ product }: ProductConfiguratorProps) {
  // Фильтруем коды жестко, чтобы убрать дубликаты кнопок
  const uniquePrintCodes = Array.from(
    new Set((product.printOptions || []).map((opt) => opt.code))
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  const [selectedPrint, setSelectedPrint] = useState<string>('Без друку')
  const [quantity, setQuantity] = useState<number>(100)
  const [pricePerUnit, setPricePerUnit] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  useEffect(() => {
    // 1. Расчет базовой цены пакета без печати
    const sortedProductTiers = [...product.price].sort((a, b) => b.minQty - a.minQty)
    const matchingProductTier = sortedProductTiers.find(tier => quantity >= tier.minQty) || product.price[0]
    let currentBasePrice = matchingProductTier ? matchingProductTier.price : 0

    // 2. Расчет цены печати под конкретный тираж
    let currentPrintPrice = 0
    if (selectedPrint !== 'Без друку' && product.printOptions) {
      const validOptions = product.printOptions.filter(opt => opt.code === selectedPrint)
      const sortedPrintTiers = [...validOptions].sort((a, b) => b.quantity - a.quantity)
      const matchingPrintTier = sortedPrintTiers.find(opt => quantity >= opt.quantity) || validOptions[0]

      if (matchingPrintTier) {
        currentPrintPrice = matchingPrintTier.price
      }
    }

    // 3. Итог
    const finalPricePerUnit = currentBasePrice + currentPrintPrice
    setPricePerUnit(finalPricePerUnit)
    setTotalPrice(finalPricePerUnit * quantity)
  }, [quantity, selectedPrint, product])

  const currencySign = product.currency === 'USD' ? '$' : 'грн'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      
      {/* ЛЕВАЯ СТОРОНА: Фото и ТТХ */}
      <div className="lg:col-span-5 space-y-4">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800/80">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover opacity-95"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-700">
              <Package className="w-16 h-16 stroke-[1]" />
            </div>
          )}
        </div>
        
        {/* Карточки характеристик адаптированы под светлую/темную тему */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-zinc-100/70 border border-zinc-200 p-3 rounded-lg dark:bg-zinc-900/40 dark:border-zinc-800/60">
            <span className="block text-zinc-400 dark:text-zinc-600 mb-1">РАЗМЕР:</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-bold">{product.size}</span>
          </div>
          {product.density && (
            <div className="bg-zinc-100/70 border border-zinc-200 p-3 rounded-lg dark:bg-zinc-900/40 dark:border-zinc-800/60">
              <span className="block text-zinc-400 dark:text-zinc-600 mb-1">ПЛОТНОСТЬ:</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-bold">{product.density}</span>
            </div>
          )}
        </div>
      </div>

      {/* ПРАВАЯ СТОРОНА: Калькулятор */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* Категория и Название */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block">
            {product.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
            {product.name}
          </h1>
        </div>

        {/* Описание */}
        {product.description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light border-l-2 border-zinc-300 dark:border-zinc-800 pl-4 py-1">
            {product.description}
          </p>
        )}

        {/* ВЫБОР ВАРИАНТА ДРУКУ */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
            Виберіть варіант друку:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            <button
              onClick={() => setSelectedPrint('Без друку')}
              className={`px-3 py-2.5 text-xs font-mono font-medium rounded-lg border transition-all text-center ${
                selectedPrint === 'Без друку'
                  ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950 font-bold shadow-md shadow-zinc-950/10'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:bg-zinc-900/40 dark:border-zinc-800/80 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              Без друку
            </button>

            {uniquePrintCodes.map((code) => (
              <button
                key={code}
                onClick={() => setSelectedPrint(code)}
                className={`px-3 py-2.5 text-xs font-mono font-medium rounded-lg border transition-all text-center ${
                  selectedPrint === code
                    ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950 font-bold shadow-md shadow-zinc-950/10'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:bg-zinc-900/40 dark:border-zinc-800/80 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* ИНПУТ КОЛИЧЕСТВА */}
        <div className="space-y-3 max-w-[240px]">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
            Кількість (шт.):
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full bg-white text-zinc-900 border border-zinc-200 rounded-lg px-4 py-3 text-sm font-mono font-bold focus:outline-none focus:border-zinc-400 transition-colors dark:bg-zinc-950 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-600"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 dark:text-zinc-600">ШТ</span>
          </div>
        </div>

        {/* СТОИМОСТЬ И КНОПКА КУПИТЬ */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="space-y-1">
            <div className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase">
              Ціна за штуку: <span className="text-zinc-700 dark:text-zinc-300 font-bold font-mono">{pricePerUnit.toFixed(2)} {currencySign}</span>
            </div>
            <div className="text-2xl font-mono font-black text-zinc-900 dark:text-white tracking-tight">
              {totalPrice.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-zinc-400 dark:text-zinc-500">{currencySign}</span>
            </div>
          </div>

          <button className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold text-sm uppercase tracking-wider py-4 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.98] transition-all">
            Додати в кошик
          </button>
        </div>

      </div>
    </div>
  )
}