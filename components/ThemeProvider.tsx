'use client'

import * as React from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  enableColorScheme?: boolean
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // Функция, которая физически переключает классы на теге HTML
    const applyTheme = (theme: string) => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
        document.documentElement.style.colorScheme = 'dark'
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.style.colorScheme = 'light'
      }
    }

    // 1. При первом старте берём тему из localStorage или ставим дефолт
    const savedTheme = localStorage.getItem('theme') || defaultTheme
    applyTheme(savedTheme)
    setMounted(true)

    // 2. Слушаем событие изменения темы от нашей кнопки
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: string }>
      applyTheme(customEvent.detail.theme)
    }

    window.addEventListener('themeChanged', handleThemeChange)
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange)
    }
  }, [defaultTheme])

  // Пока сервер рендерит — отдаём чистый HTML, чтобы не было ошибок гидратации
  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}