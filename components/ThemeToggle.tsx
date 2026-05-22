'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // При монтировании проверяем, какой класс сейчас реально висит на html
    const isCurrentlyDark = document.documentElement.classList.contains('dark')
    setTheme(isCurrentlyDark ? 'dark' : 'light')
    setMounted(false)
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="p-2 w-8 h-8" />
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    
    // 1. Сохраняем в локальное хранилище, чтобы выбор не слетал при F5
    localStorage.setItem('theme', newTheme)
    
    // 2. Обновляем локальное состояние кнопки, чтобы иконка поменялась
    setTheme(newTheme)
    
    // 3. Стреляем событием на весь браузер, чтобы ThemeProvider мгновенно перекрасил сайт
    const event = new CustomEvent('themeChanged', { detail: { theme: newTheme } })
    window.dispatchEvent(event)
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center justify-center rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors cursor-pointer active:scale-95"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-zinc-700" />
      )}
    </button>
  )
}