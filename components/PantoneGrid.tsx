'use client'

import { useState } from 'react'

interface ColorItem {
  hex: string
  code: string
}

export default function PantoneGrid({ colors }: { colors: ColorItem[] }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 1500)
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
      {colors.map((color, index) => (
        <button
          key={index}
          onClick={() => handleCopy(color.code)}
          className="group relative flex flex-col p-2.5 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all text-left active:scale-[0.98]"
        >
          {/* Цветная плашка */}
          <div 
            className="w-full h-16 rounded-lg border border-black/5 dark:border-white/5 transition-transform group-hover:scale-[1.01]" 
            style={{ backgroundColor: color.hex }}
          />
          {/* Инфо */}
          <div className="mt-2 font-mono text-[10px] space-y-0.5">
            <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {color.code}
            </div>
            <div className="text-zinc-400 dark:text-zinc-500 uppercase">
              {color.hex}
            </div>
          </div>

          {/* Всплывашка "Скопировано" */}
          {copiedCode === color.code && (
            <div className="absolute inset-0 bg-zinc-900/90 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider animate-fadeIn">
              ✓ COPIED
            </div>
          )}
        </button>
      ))}
    </div>
  )
}