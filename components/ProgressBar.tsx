'use client'

import { useEffect } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { usePathname, useSearchParams } from 'next/navigation'

export default function ProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Настройка: убираем крутилку, оставляем только полоску
    NProgress.configure({ showSpinner: false, speed: 300 })
  }, [])

  useEffect(() => {
    // Запускаем прогресс при смене пути или параметров
    NProgress.start()
    
    // Завершаем, когда страница отрендерилась
    const timeout = setTimeout(() => NProgress.done(), 300)
    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  return null
}