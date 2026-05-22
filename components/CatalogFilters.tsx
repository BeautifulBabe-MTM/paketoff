'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import PackCard from '@/components/PackCard'
import { SlidersHorizontal, LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react'

interface CatalogFiltersProps {
  initialProducts: any[]
  categories: { id: string; label: string }[]
  currentCategory: string | null
  translations: {
    pageTitle: string // <--- Добавили заголовок
    allProductsBtn: string
    allSubcategoriesBtn: string
    foundProductsLabel: string
    filterParamsTitle: string
    noProductsText: string
    yesLabel: string
    noLabel: string
    sections: {
      size: string
      color: string
      density: string
      bottom: string
      handle: string
      weight: string
    }
  }
}

export default function CatalogFilters({ initialProducts, categories, currentCategory, translations }: CatalogFiltersProps) {
    const { locale } = useParams()

    const [selectedSubcat, setSelectedSubcat] = useState<string | null>(null)
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [selectedDensities, setSelectedDensities] = useState<string[]>([])
    const [selectedBottoms, setSelectedBottoms] = useState<string[]>([])
    const [selectedHandles, setSelectedHandles] = useState<string[]>([])
    const [selectedWeights, setSelectedWeights] = useState<string[]>([])

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        size: false, color: false, density: false, bottom: false, handle: false, weight: false
    })

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    const facets = useMemo(() => {
        const subcats = new Set<string>()
        const sizes = new Set<string>()
        const colors = new Set<string>()
        const densities = new Set<string>()
        const bottoms = new Set<string>()
        const handles = new Set<string>()
        const weights = new Set<string>()

        initialProducts.forEach(p => {
            if (p.subcategory && p.subcategory.trim() !== '') subcats.add(p.subcategory.trim())
            if (p.size && p.size.trim() !== '') sizes.add(p.size.trim())
            if (p.color && p.color.trim() !== '') colors.add(p.color.trim())
            if (p.density && p.density.trim() !== '') densities.add(p.density.trim())
            if (p.weight && p.weight.trim() !== '') weights.add(p.weight.trim())

            if (p.bottom === true) bottoms.add(translations.yesLabel)
            else if (p.bottom === false) bottoms.add(translations.noLabel)
            else if (typeof p.bottom === 'string' && p.bottom.trim() !== '') bottoms.add(p.bottom.trim())

            if (p.handle === true) handles.add(translations.yesLabel)
            else if (p.handle === false) handles.add(translations.noLabel)
            else if (typeof p.handle === 'string' && p.handle.trim() !== '') handles.add(p.handle.trim())
        })

        return {
            subcategories: Array.from(subcats),
            sizes: Array.from(sizes).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
            colors: Array.from(colors),
            densities: Array.from(densities),
            bottoms: Array.from(bottoms),
            handles: Array.from(handles),
            weights: Array.from(weights),
        }
    }, [initialProducts, translations])

    useMemo(() => {
        setSelectedSubcat(null)
        setSelectedSizes([])
        setSelectedColors([])
        setSelectedDensities([])
        setSelectedBottoms([])
        setSelectedHandles([])
        setSelectedWeights([])
    }, [currentCategory])

    const handleCheckboxChange = (value: string, list: string[], setList: (val: string[]) => void) => {
        if (list.includes(value)) {
            setList(list.filter(item => item !== value))
        } else {
            setList([...list, value])
        }
    }

    const filteredProducts = useMemo(() => {
        return initialProducts.filter(p => {
            if (selectedSubcat && p.subcategory !== selectedSubcat) return false
            if (selectedSizes.length > 0 && !selectedSizes.includes(p.size)) return false
            if (selectedColors.length > 0 && (!p.color || !selectedColors.includes(p.color))) return false
            if (selectedDensities.length > 0 && (!p.density || !selectedDensities.includes(p.density))) return false
            if (selectedWeights.length > 0 && (!p.weight || !selectedWeights.includes(p.weight))) return false

            if (selectedBottoms.length > 0) {
                let itemValue = translations.noLabel
                if (p.bottom === true) itemValue = translations.yesLabel
                else if (typeof p.bottom === 'string') itemValue = p.bottom
                if (!selectedBottoms.includes(itemValue)) return false
            }

            if (selectedHandles.length > 0) {
                let itemValue = translations.noLabel
                if (p.handle === true) itemValue = translations.yesLabel
                else if (typeof p.handle === 'string') itemValue = p.handle
                if (!selectedHandles.includes(itemValue)) return false
            }

            return true
        })
    }, [initialProducts, selectedSubcat, selectedSizes, selectedColors, selectedDensities, selectedBottoms, selectedHandles, selectedWeights, translations])

    return (
        <>
            <header className="relative flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-8 mb-8 gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-400 dark:text-zinc-500 uppercase">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        B2B / B2C Production Database
                    </div>
                    {/* Исправлено: Заголовок теперь переводится */}
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase font-sans text-zinc-900 dark:text-white">
                        {translations.pageTitle}
                    </h1>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                    <span>{translations.foundProductsLabel} <strong className="text-zinc-900 dark:text-white font-semibold">{filteredProducts.length}</strong></span>
                </div>
            </header>

            <section className="mb-6">
                <div className="flex flex-wrap gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-950">
                    <Link
                        href={`/${locale}/packs`}
                        className={`px-4 py-2 text-xs font-medium tracking-wide uppercase rounded-lg transition-all ${!currentCategory
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold'
                            : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400'
                            }`}
                    >
                        {translations.allProductsBtn}
                    </Link>
                    {categories.map(cat => (
                        <Link
                            key={cat.id}
                            href={`/${locale}/packs?category=${encodeURIComponent(cat.id)}`}
                            className={`px-4 py-2 text-xs font-medium tracking-wide uppercase rounded-lg border transition-all ${currentCategory === cat.id
                                ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950 font-bold'
                                : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400'
                                }`}
                        >
                            {cat.label}
                        </Link>
                    ))}
                </div>
            </section>

            {currentCategory !== null && facets.subcategories.length > 0 && (
                <section className="mb-8 animate-fadeIn">
                    <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-100/60 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/50 rounded-xl">
                        <button
                            onClick={() => setSelectedSubcat(null)}
                            className={`px-3 py-1.5 text-[11px] font-mono uppercase rounded-md transition-all ${selectedSubcat === null
                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold'
                                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                                }`}
                        >
                            {translations.allSubcategoriesBtn} {/* Исправлено тут */}
                        </button>
                        {facets.subcategories.map(sub => (
                            <button
                                key={sub}
                                onClick={() => setSelectedSubcat(sub)}
                                className={`px-3 py-1.5 text-[11px] font-mono uppercase rounded-md transition-all ${selectedSubcat === sub
                                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold'
                                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                                    }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                <aside className="space-y-1 bg-white dark:bg-transparent border border-zinc-200 dark:border-transparent rounded-xl p-4 lg:p-0">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider pb-3 border-b border-zinc-100 dark:border-zinc-900 mb-2">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        {translations.filterParamsTitle}
                    </div>

                    {[
                        { id: 'size', title: translations.sections.size, items: facets.sizes, state: selectedSizes, setState: setSelectedSizes },
                        { id: 'color', title: translations.sections.color, items: facets.colors, state: selectedColors, setState: setSelectedColors },
                        { id: 'density', title: translations.sections.density, items: facets.densities, state: selectedDensities, setState: setSelectedDensities },
                        { id: 'bottom', title: translations.sections.bottom, items: facets.bottoms, state: selectedBottoms, setState: setSelectedBottoms },
                        { id: 'handle', title: translations.sections.handle, items: facets.handles, state: selectedHandles, setState: setSelectedHandles },
                        { id: 'weight', title: translations.sections.weight, items: facets.weights, state: selectedWeights, setState: setSelectedWeights },
                    ].map((section) => {
                        if (section.items.length === 0) return null

                        const isOpen = openSections[section.id]

                        return (
                            <div key={section.id} className="border-b border-zinc-100 dark:border-zinc-900/60 py-2.5">
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full flex items-center justify-between py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        {section.title}
                                        {section.state.length > 0 && (
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                        )}
                                    </span>
                                    {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                                </button>

                                {isOpen && (
                                    <div className="pt-2 pb-1 pl-1 space-y-2 max-h-48 overflow-y-auto animate-slideDown">
                                        {section.items.map(item => (
                                            <label key={item} className="flex items-center gap-3 text-xs font-mono text-zinc-600 dark:text-zinc-400 cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={section.state.includes(item)}
                                                    onChange={() => handleCheckboxChange(item, section.state, section.setState)}
                                                    className="rounded border-zinc-300 dark:border-zinc-800 text-zinc-900 focus:ring-0 focus:ring-offset-0 bg-transparent w-3.5 h-3.5"
                                                />
                                                <span>{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </aside>

                <main className="lg:col-span-3">
                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/10">
                            <LayoutGrid className="w-8 h-8 text-zinc-400 dark:text-zinc-700 stroke-[1.5] mb-3" />
                            <p className="text-zinc-400 dark:text-zinc-500 font-mono text-xs uppercase tracking-widest text-center px-4">
                                {translations.noProductsText}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                            {filteredProducts.map((product) => (
                                <PackCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </main>

            </div>
        </>
    )
}