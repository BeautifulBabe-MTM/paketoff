'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Package, Calculator, Scale, Box } from 'lucide-react'
import Link from 'next/link'

interface CalcTranslations {
  title: string
  sub: string
  width: string
  height: string
  density: string
  quantity: string
  weight: string
  volume: string
  alert: string
}

interface HomeClientProps {
  locale: string
  subtitle: string
  buttonText: string
  calc: CalcTranslations
}

export default function HomeClient({ locale, subtitle, buttonText, calc }: HomeClientProps) {
  // Состояние полей калькулятора
  const [width, setWidth] = useState<number>(40)
  const [height, setHeight] = useState<number>(50)
  const [density, setDensity] = useState<number>(50)
  const [quantity, setQuantity] = useState<number>(5000)

  const [weightResult, setWeightResult] = useState<string>('0')
  const [volumeResult, setVolumeResult] = useState<string>('0')

  // Реактивный пересчет при изменении любого инпута
  useEffect(() => {
    if (!width || !height || !density || !quantity) return

    // Средняя плотность полиэтилена (LDPE) ~ 0.92 г/см³
    // Формула веса одного двухслойного пакета (в кг):
    const singleWeightKg = (width * height * 2 * density * 0.92) / 10000000
    const totalWeight = singleWeightKg * quantity
    
    // Примерный расчет объема куба упаковки с коэффициентом пустот
    const totalVolumeM3 = (width * height * (density / 10000) * 2 * quantity * 1.3) / 1000000

    setWeightResult(totalWeight.toFixed(1))
    setVolumeResult(totalVolumeM3 < 0.01 ? '0.05' : totalVolumeM3.toFixed(2))
  }, [width, height, density, quantity])

  return (
    <main className="max-w-xl w-full text-center space-y-12">
      
      {/* ================= HERO БЛОК ================= */}
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center justify-center p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        >
          <Package className="w-6 h-6 text-zinc-800 dark:text-zinc-200" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight uppercase sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-400">
            Paketoff Production
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tracking-wide uppercase max-w-sm mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="pt-2">
          <Link 
            href={`/${locale}/packs`} 
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-sm font-bold tracking-wide uppercase transition-all group shadow-lg shadow-black/5 active:scale-[0.98]"
          >
            {buttonText}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* ================= ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР ================= */}
      {calc && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/40 text-left space-y-6 shadow-sm"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold font-mono text-xs uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-zinc-400" />
              {calc.title}
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono uppercase">
              {calc.sub}
            </p>
          </div>

          {/* Сетка инпутов */}
          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-400 dark:text-zinc-500 block uppercase tracking-tight text-[10px]">{calc.width}</label>
              <input 
                type="number" 
                value={width || ''} 
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-400 dark:text-zinc-500 block uppercase tracking-tight text-[10px]">{calc.height}</label>
              <input 
                type="number" 
                value={height || ''} 
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-400 dark:text-zinc-500 block uppercase tracking-tight text-[10px]">{calc.density}</label>
              <input 
                type="number" 
                value={density || ''} 
                onChange={(e) => setDensity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-400 dark:text-zinc-500 block uppercase tracking-tight text-[10px]">{calc.quantity}</label>
              <input 
                type="number" 
                value={quantity || ''} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>
          </div>

          {/* Результаты вычислений */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 font-mono">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/40 flex items-center gap-3">
              <Scale className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase leading-none">{calc.weight}</div>
                <div className="text-sm font-black mt-1 text-zinc-900 dark:text-white uppercase">{weightResult} кг</div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/40 flex items-center gap-3">
              <Box className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase leading-none">{calc.volume}</div>
                <div className="text-sm font-black mt-1 text-zinc-900 dark:text-white uppercase">{volumeResult} м³</div>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 text-center uppercase tracking-tight">
            ℹ️ {calc.alert}
          </div>
        </motion.div>
      )}

    </main>
  )
}