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
    // 1. При монтировании в браузере проверяем, есть ли уже сохраненная тема
    const savedTheme = localStorage.getItem('theme') || defaultTheme
    
    // 2. Вручную вешаем/убираем класс dark на самый верхний тег HTML
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    setMounted(true)
  }, [defaultTheme])

  // Пока сервер рендерит — просто отдаем детей, чтобы HTML был чистым
  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}