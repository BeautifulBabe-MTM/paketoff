'use client'

import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

// Словарь для строгого маппинга строк на компоненты Lucide
const iconMap = {
  info: Icons.Info,
  truck: Icons.Truck,
  phone: Icons.Phone,
  palette: Icons.Palette,
}

interface StaticPageClientProps {
  title: string
  subtitle?: string
  iconName: keyof typeof iconMap // принимаем только строки: 'info' | 'truck' | 'phone' | 'palette'
  children: React.ReactNode
}

export default function StaticPageClient({ title, subtitle, iconName, children }: StaticPageClientProps) {
  // Находим нужную иконку по ключу, по дефолту подстрахуемся обычной коробкой
  const IconComponent = iconMap[iconName] || Icons.Package

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-[#09090b] dark:text-zinc-100 pt-32 pb-24 px-4 md:px-8 flex flex-col items-center w-full">
      <main className="max-w-2xl w-full space-y-10">
        
        {/* Хедер страницы */}
        <div className="space-y-4 text-center md:text-left border-b border-zinc-200/60 dark:border-zinc-800/60 pb-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
          >
            <IconComponent className="w-5 h-5" />
          </motion.div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight uppercase text-zinc-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Контент страницы */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-8 text-xs font-mono text-zinc-600 dark:text-zinc-400 leading-relaxed"
        >
          {children}
        </motion.div>

      </main>
    </div>
  )
}