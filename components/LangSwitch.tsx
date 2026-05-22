'use client'

import React, { useState, useRef, useEffect } from 'react'
import { usePathname, useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'

const LANGUAGES = [
  { code: 'uk', label: 'UA', flag: '🇺🇦' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'it', label: 'IT', flag: '🇮🇹' },
]

export default function LangSwitch() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()
  
  const currentLocale = (params?.locale as string) || 'uk'
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getNewLangUrl = (newLocale: string) => {
    if (!pathname) return `/${newLocale}`
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    const queryString = searchParams?.toString()
    return queryString ? `${newPath}?${queryString}` : newPath
  }

  // ФУНКЦИЯ СОХРАНЕНИЯ ЯЗЫКА В КУКИ
  const handleLangChange = (code: string) => {
    // Записываем куку на 1 год, чтобы Next.js её видел при F5
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; SameSite=Lax`
    setIsOpen(false)
  }

  const currentLangObj = LANGUAGES.find(l => l.code === currentLocale) || LANGUAGES[0]

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-all active:scale-95"
      >
        <span>{currentLangObj.flag}</span>
        <span>{currentLangObj.label}</span>
        <svg className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-28 origin-top-right rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 z-50">
          {LANGUAGES.map((lang) => (
            <Link
              key={lang.code}
              href={getNewLangUrl(lang.code)}
              onClick={() => handleLangChange(lang.code)} // <--- ТЕПЕРЬ ТРИГГЕРИМ КУКУ ПРИ КЛИКЕ
              className={`flex items-center gap-2 w-full px-3 py-2 text-xs rounded-md transition-colors ${
                currentLocale === lang.code
                  ? 'bg-zinc-100 text-zinc-900 font-bold dark:bg-zinc-900 dark:text-zinc-50'
                  : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900/60'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}