'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Package } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-[#09090b] dark:text-zinc-100 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col justify-center items-center px-4">
      <main className="max-w-xl text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center justify-center p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        >
          <Package className="w-6 h-6 text-zinc-800 dark:text-zinc-200" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight uppercase sm:text-5xl">
            Paketoff Production
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono tracking-wide uppercase">
            B2B / B2C База данных упаковки и пакетов
          </p>
        </div>

        <div className="pt-4">
          <Link 
            href="/packs" 
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-sm font-bold tracking-wide uppercase transition-all group shadow-lg shadow-black/5"
          >
            Открыть каталог
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </main>
    </div>
  )
}