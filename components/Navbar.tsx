'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, ShoppingBag, Layers } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import LangSwitch from '@/components/LangSwitch'

interface NavbarProps {
    locale: string
    translations: {
        catalog: string
        about: string
        delivery: string
        contacts: string
        login: string
        loginMobile: string
    }
}

export default function Navbar({ locale, translations }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const navLinks = [
        { href: '/packs', label: translations.catalog },
        { href: '/about', label: translations.about },
        { href: '/delivery', label: translations.delivery },
        { href: '/contacts', label: translations.contacts },
    ]

    const isActive = (href: string) => pathname === `/${locale}${href}`

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/85 backdrop-blur-md dark:border-zinc-800/85 dark:bg-zinc-950/85 transition-colors duration-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* ЛОГОТИП */}
                    <div className="flex items-center">
                        <Link href={`/${locale}`} className="flex items-center gap-2 font-sans text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">
                            <Layers className="h-5 w-5 text-emerald-500" />
                            <span>PACK<span className="text-zinc-400 dark:text-zinc-600">LAB</span></span>
                        </Link>
                    </div>

                    {/* ДЕСКТОПНОЕ МЕНЮ */}
                    <div className="hidden md:block">
                        <div className="flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={`/${locale}${link.href}`}
                                    className={`text-xs font-mono uppercase tracking-widest transition-colors hover:text-zinc-900 dark:hover:text-white ${
                                        isActive(link.href) ? 'text-zinc-900 dark:text-white font-bold' : 'text-zinc-500 dark:text-zinc-400'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* ПРАВАЯ ЧАСТЬ (Десктоп) */}
                    <div className="hidden md:flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-800 pl-4">
                        <ThemeToggle />

                        <Link href={`/${locale}/cart`} className="relative flex items-center justify-center p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                            <ShoppingBag className="h-4 w-4" />
                            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-emerald-500" />
                        </Link>

                        <Link href={`/${locale}/login`} className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95">
                            <User className="h-3.5 w-3.5" />
                            <span>{translations.login}</span>
                        </Link>

                        <LangSwitch />
                    </div>

                    {/* МОБИЛЬНАЯ ПАНЕЛЬ */}
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeToggle />
                        <Link href={`/${locale}/cart`} className="relative flex items-center justify-center p-2 text-zinc-500 dark:text-zinc-400">
                            <ShoppingBag className="h-4 w-4" />
                            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-emerald-500" />
                        </Link>
                        <button onClick={() => setIsOpen(!isOpen)} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 cursor-pointer">
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* МОБИЛЬНОЕ МЕНЮ */}
            {isOpen && (
                <div className="md:hidden border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-4 pt-2 pb-4 space-y-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={`/${locale}${link.href}`}
                            onClick={() => setIsOpen(false)}
                            className={`block py-2 text-sm font-mono uppercase tracking-wider ${
                                isActive(link.href) ? 'text-zinc-900 dark:text-white font-bold' : 'text-zinc-500 dark:text-zinc-400'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-900 space-y-4">
                        <Link href={`/${locale}/login`} onClick={() => setIsOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 py-3 text-xs font-mono uppercase tracking-widest font-bold">
                            <User className="h-4 w-4" />
                            {translations.loginMobile}
                        </Link>

                        <div className="flex justify-center py-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                            <LangSwitch />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}