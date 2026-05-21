'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Package } from 'lucide-react'

interface PackCardProps {
  product: {
    id: string
    name: string
    category: string
    currency: string
    size: string
    material?: string | null
    density?: string | null
    images: string[]
    price: { minQty: number; price: number }[]
  }
}

export default function PackCard({ product }: PackCardProps) {
  const basePrice = product.price[0]?.price ?? 0
  const baseQty = product.price[0]?.minQty ?? 1

  return (
    <Link href={`/packs/${product.id}`} className="group block">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex flex-col h-full space-y-4"
      >
        {/* Контейнер фото: подстраивается под светлую и темную тему */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200 transition-colors group-hover:border-zinc-400 dark:bg-zinc-900/40 dark:border-zinc-800/80 dark:group-hover:border-zinc-700">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-w-7xl) 25vw"
              className="object-cover opacity-95 transition-all duration-700 ease-out group-hover:scale-102 group-hover:opacity-100"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 bg-zinc-100 dark:text-zinc-700 dark:bg-zinc-950">
              <Package className="w-8 h-8 stroke-[1]" />
              <span className="text-[9px] font-mono mt-2 tracking-widest uppercase">No media</span>
            </div>
          )}

          {/* Тэг размера */}
          <div className="absolute top-3 left-3 px-2 py-1 rounded bg-white/90 backdrop-blur-md border border-zinc-200 text-[10px] font-mono text-zinc-600 tracking-wider dark:bg-zinc-950/90 dark:border-zinc-800 dark:text-zinc-400">
            {product.size}
          </div>
        </div>

        {/* Текстовый блок */}
        <div className="flex flex-col flex-grow space-y-2 px-1">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {product.category}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 -translate-x-1 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 dark:text-zinc-600" />
          </div>

          <h3 className="text-sm font-semibold text-zinc-800 tracking-tight leading-snug line-clamp-2 group-hover:text-black transition-colors dark:text-zinc-200 dark:group-hover:text-white">
            {product.name}
          </h3>

          {/* Характеристики */}
          {(product.material || product.density) && (
            <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
              {product.material && <span>{product.material}</span>}
              {product.material && product.density && <span className="text-zinc-300 dark:text-zinc-700">•</span>}
              {product.density && <span>{product.density}</span>}
            </div>
          )}

          {/* Прайс-блок в самом низу */}
          <div className="pt-3 mt-auto border-t border-zinc-200 flex items-baseline justify-between dark:border-zinc-900">
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">ОПТ ОТ {baseQty} ШТ</span>
            <div className="text-base font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {basePrice.toFixed(2)} <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">{product.currency === 'USD' ? '$' : 'грн'}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}