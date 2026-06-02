'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Package, Check, Loader2 } from 'lucide-react'
import { CartItem, getCartItems, saveCartItems } from '@/lib/cart'

interface PriceTier {
  minQty: number
  price: number
}

interface PrintOption {
  code: string
  quantity: number
  price: number
}

interface ConfiguratorTranslations {
  sizeLabel: string
  densityLabel: string
  printLabel: string
  noPrintBtn: string
  qtyLabel: string
  pricePerUnitLabel: string
  addToCartBtn: string
  addingBtn?: string
  addedBtn?: string
}

interface ProductConfiguratorProps {
  locale: string
  product: {
    id: string
    name: string
    originalName?: string
    category: string
    currency: string
    size: string
    description: string
    material?: string | null
    density?: string | null
    images: string[]
    price: PriceTier[]
    printOptions: PrintOption[]
    tags?: string[]
  }
  translations: ConfiguratorTranslations
}

export default function ProductConfigurator({ locale, product, translations }: ProductConfiguratorProps) {
  const uniquePrintCodes = Array.from(
    new Set((product.printOptions || []).map((opt) => opt.code))
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  // Изменили дефолт на системный маркер 'none'
  const [selectedPrint, setSelectedPrint] = useState<string>('none')
  const [quantity, setQuantity] = useState<number>(100)
  const [pricePerUnit, setPricePerUnit] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [isAdded, setIsAdded] = useState<boolean>(false)

  useEffect(() => {
    const productPrices = product.price || []
    const sortedProductTiers = [...productPrices].sort((a, b) => b.minQty - a.minQty)
    const matchingProductTier = sortedProductTiers.find(tier => quantity >= tier.minQty) || productPrices[0]
    let currentBasePrice = matchingProductTier ? matchingProductTier.price : 0

    let currentPrintPrice = 0
    // Проверяем системный 'none' вместо кириллицы
    if (selectedPrint !== 'none' && product.printOptions) {
      const validOptions = product.printOptions.filter(opt => opt.code === selectedPrint)
      const sortedPrintTiers = [...validOptions].sort((a, b) => b.quantity - a.quantity)
      const matchingPrintTier = sortedPrintTiers.find(opt => quantity >= opt.quantity) || validOptions[0]

      if (matchingPrintTier) {
        currentPrintPrice = matchingPrintTier.price
      }
    }

    const finalPricePerUnit = currentBasePrice + currentPrintPrice
    setPricePerUnit(finalPricePerUnit)
    setTotalPrice(finalPricePerUnit * quantity)
  }, [quantity, selectedPrint, product])

  const handleAddToCart = () => {
    setIsAdding(true)

    setTimeout(() => {
      const currentCart = getCartItems()

      // Теперь ID формируется чисто и без кириллицы
      const cartItemId = `${product.id}-${selectedPrint}`
      const existingItemIndex = currentCart.findIndex(item => item.id === cartItemId)

      if (existingItemIndex > -1) {
        const currentQty = currentCart[existingItemIndex].quantity + quantity
        currentCart[existingItemIndex].quantity = currentQty
        currentCart[existingItemIndex].totalPrice = currentCart[existingItemIndex].pricePerUnit * currentQty
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          originalName: product.originalName || (locale === 'uk' ? product.name : ''),
          size: product.size,
          density: product.density || null,
          print: selectedPrint, // Сюда улетит чистый 'none' или код цифрами
          quantity: quantity,
          pricePerUnit: pricePerUnit,
          totalPrice: totalPrice,
          image: product.images?.[0] || null,
          currency: product.currency
        }
        currentCart.push(newItem)
      }

      saveCartItems(currentCart)
      setIsAdding(false)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    }, 600)
  }

  const currencySign = product.currency === 'USD' ? '$' : 'грн'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Левая сторона */}
      <div className="lg:col-span-5 space-y-4">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800/80">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              unoptimized
              className="object-cover opacity-95"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-700">
              <Package className="w-16 h-16 stroke-[1]" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-zinc-100/70 border border-zinc-200 p-3 rounded-lg dark:bg-zinc-900/40 dark:border-zinc-800/60">
            <span className="block text-zinc-400 dark:text-zinc-600 mb-1">{translations.sizeLabel}</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-bold">{product.size}</span>
          </div>
          {product.density && (
            <div className="bg-zinc-100/70 border border-zinc-200 p-3 rounded-lg dark:bg-zinc-900/40 dark:border-zinc-800/60">
              <span className="block text-zinc-400 dark:text-zinc-600 mb-1">{translations.densityLabel}</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-bold">{product.density}</span>
            </div>
          )}
        </div>
      </div>

      {/* Правая сторона */}
      <div className="lg:col-span-7 space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block">
            {product.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
            {product.name}
          </h1>
        </div>

        {product.description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light border-l-2 border-zinc-300 dark:border-zinc-800 pl-4 py-1">
            {product.description}
          </p>
        )}

        {/* Выбор печати */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
            {translations.printLabel}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() => setSelectedPrint('none')} // Кнопка сетает системный 'none'
              className={`px-3 py-2.5 text-xs font-mono font-medium rounded-lg border transition-all text-center ${selectedPrint === 'none'
                ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950 font-bold shadow-md shadow-zinc-950/10'
                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:bg-zinc-900/40 dark:border-zinc-800/80 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
                }`}
            >
              {translations.noPrintBtn}
            </button>

            {uniquePrintCodes.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setSelectedPrint(code)}
                className={`px-3 py-2.5 text-xs font-mono font-medium rounded-lg border transition-all text-center ${selectedPrint === code
                  ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950 font-bold shadow-md shadow-zinc-950/10'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:bg-zinc-900/40 dark:border-zinc-800/80 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
                  }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Количество */}
        <div className="space-y-3 max-w-[240px]">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
            {translations.qtyLabel}
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

        {/* Цена и кнопка */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="space-y-1">
            <div className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase">
              {translations.pricePerUnitLabel} <span className="text-zinc-700 dark:text-zinc-300 font-bold font-mono">{pricePerUnit.toFixed(2)} {currencySign}</span>
            </div>
            <div className="text-2xl font-mono font-black text-zinc-900 dark:text-white tracking-tight">
              {totalPrice.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-zinc-400 dark:text-zinc-500">{currencySign}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={isAdding}
            onClick={handleAddToCart}
            className={`w-full font-bold text-sm uppercase tracking-wider py-4 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 select-none ${isAdded
              ? 'bg-emerald-600 text-white dark:bg-emerald-500'
              : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200'
              } disabled:opacity-80 disabled:cursor-not-allowed`}
          >
            {isAdding && <Loader2 className="w-4 h-4 animate-spin" />}
            {isAdded && <Check className="w-4 h-4" />}
            {isAdding && (
              translations.addingBtn || {
                en: 'Adding...',
                de: 'Wird hinzugefügt...',
                fr: 'Ajout...',
                it: 'Aggiunta...',
                uk: 'Додавання...'
              }[locale] || 'Adding...'
            )}
            {isAdded && (
              translations.addedBtn || {
                en: 'Added!',
                de: 'Hinzugefügt!',
                fr: 'Ajouté!',
                it: 'Aggiunto!',
                uk: 'Додано!'
              }[locale] || 'Added!'
            )}
            {!isAdding && !isAdded && translations.addToCartBtn}
          </button>
        </div>
      </div>
    </div>
  )
}