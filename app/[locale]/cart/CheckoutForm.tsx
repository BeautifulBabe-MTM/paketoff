'use client'

import { useState } from 'react'
import { ArrowLeft, CreditCard, Wallet, Loader2 } from 'lucide-react'
import { CartItem, saveCartItems } from '@/lib/cart'

interface CheckoutFormProps {
    locale: string
    cartItems: CartItem[]
    totalSum: number
    currencySign: string
    translations: Record<string, string>
    translatedNames: Record<string, string>
    onBack: () => void
}

export default function CheckoutForm({
    locale,
    cartItems,
    totalSum,
    currencySign,
    translations,
    translatedNames,
    onBack
}: CheckoutFormProps) {

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        country: locale === 'uk' ? 'UA' : 'CH',
        city: '',
        address: '',
        postalCode: '',
        payment: 'card'
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const orderData = {
            client: {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
            },
            shipping: {
                country: formData.country,
                city: formData.city,
                address: formData.address,
                zip: formData.postalCode,
            },
            paymentMethod: formData.payment,
            items: cartItems.map(item => {
                const currentTranslatedName = translatedNames[item.originalName || item.name] || item.name
                const currentTranslatedPrint = item.print === 'none'
                    ? (translations.noPrintBtn || 'Без друку')
                    : item.print

                return {
                    productId: item.productId,
                    name: currentTranslatedName,
                    size: item.size,
                    print: currentTranslatedPrint,
                    quantity: item.quantity,
                    total: item.totalPrice
                }
            }),
            totalSum,
            currency: cartItems[0]?.currency || 'UAH',
            locale // передаем локаль на бэкенд для писем/уведомлений
        }

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })

            if (!res.ok) {
                throw new Error('Server error handling order')
            }

            const data = await res.json()

            // ЕСЛИ ВЫБРАНА КАРТА: Бэкенд вернет { url: "https://checkout.stripe.com/..." }
            if (formData.payment === 'card' && data.url) {
                // Корзину НЕ очищаем, пока шлюз не подтвердит оплату (через Webhook)
                window.location.href = data.url
            } else {
                // ЕСЛИ ИНВОЙС: Бэкенд создает заказ, и мы сразу ведем на success страницу
                saveCartItems([])
                window.location.href = `/${locale}/cart/success?orderId=${data.orderId || ''}`
            }

        } catch (err) {
            console.error("Помилка оформлення:", err)
            alert(translations.orderError || "Processing error. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Тексты для сводки справа (чтобы не хардкодить UA)
    const yourOrderText = translations.yourOrderTitle || {
        en: 'Your order', de: 'Ihre Bestellung', fr: 'Votre commande', it: 'Il tuo ordine', uk: 'Ваше замовлення'
    }[locale] || 'Your order';

    const totalText = translations.totalLabel || {
        en: 'Total:', de: 'Gesamt:', fr: 'Total:', it: 'Totale:', uk: 'Всього:'
    }[locale] || 'Total:';

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#09090b] dark:text-zinc-100 pt-28 pb-24 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Кнопка назад */}
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {translations.backToCatalog || 'Back'}
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ФОРМА */}
                    <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-6 dark:bg-zinc-950 dark:border-zinc-800/80 space-y-6">
                        <h2 className="text-xl font-black tracking-tight uppercase font-sans text-zinc-900 dark:text-white">
                            {translations.checkoutTitle}
                        </h2> 

                        {/* Блок контактов */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">{translations.fullName} *</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">{translations.phone} *</label>
                                    <input required type="tel" name="phone" placeholder="+1..." value={formData.phone} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">{translations.email} *</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700" />
                                </div>
                            </div>
                        </div>

                        {/* Блок адреса */}
                        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">{translations.country} *</label>
                                    <select name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-900 dark:text-zinc-100">
                                        <option value="UA">Ukraine</option>
                                        <option value="CH">Switzerland</option>
                                        <option value="DE">Germany</option>
                                        <option value="PL">Poland</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">{translations.city} *</label>
                                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                                        {formData.country === 'UA' ? (translations.deliveryAddressUA || 'Відділення Нової Пошти / Адреса') : translations.address} *
                                    </label>
                                    <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                                        {translations.postalCode} {formData.country !== 'UA' && '*'}
                                    </label>
                                    <input required={formData.country !== 'UA'} type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700" />
                                </div>
                            </div>
                        </div>

                        {/* Блок оплаты */}
                        <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">{translations.paymentMethod || 'Payment Method'}</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.payment === 'card' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-transparent' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}>
                                    <input type="radio" name="payment" value="card" checked={formData.payment === 'card'} onChange={handleInputChange} className="hidden" />
                                    <CreditCard className="w-4 h-4" />
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider">Card (Stripe / WayForPay)</span>
                                </label>
                                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.payment === 'invoice' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-transparent' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}>
                                    <input type="radio" name="payment" value="invoice" checked={formData.payment === 'invoice'} onChange={handleInputChange} className="hidden" />
                                    <Wallet className="w-4 h-4" />
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider">B2B Invoice / IBAN</span>
                                </label>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-emerald-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (translations.submitOrder || 'Submit Order')}
                        </button>
                    </form>

                    {/* МИНИ-СВОДКА ЗАКАЗА СПРАВА */}
                    <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-6 dark:bg-zinc-950 dark:border-zinc-800/80 space-y-4 sticky top-24">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                            {yourOrderText}
                        </h3>
                        <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                            {cartItems.map(item => {
                                const noPrintText = translations.noPrintBtn || {
                                    en: 'No printing', de: 'Ohne Druck', fr: 'Sans impression', it: 'Senza stampa', uk: 'Без друку'
                                }[locale] || 'No printing';

                                const pcsText = {
                                    en: 'pcs', de: 'Stk', fr: 'pcs', it: 'pz', uk: 'шт'
                                }[locale] || 'шт';

                                return (
                                    <div key={item.id} className="flex justify-between text-xs font-mono gap-2">
                                        <div className="truncate max-w-[70%]">
                                            <span className="font-bold text-zinc-800 dark:text-white block truncate">
                                                {translatedNames[item.originalName || item.name] || item.name}
                                            </span>
                                            <div className="text-[10px] text-zinc-400 mt-0.5">
                                                {item.size} • {item.print === 'none' ? noPrintText : item.print}
                                            </div>
                                        </div>
                                        <div className="text-right text-zinc-500 shrink-0">
                                            {item.quantity} {pcsText} = <span className="text-zinc-800 dark:text-zinc-200 font-bold whitespace-nowrap">{item.totalPrice.toLocaleString('ru-RU')} {currencySign}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-baseline">
                            <span className="text-xs font-mono uppercase text-zinc-400">{totalText}</span>
                            <span className="text-xl font-mono font-black text-zinc-900 dark:text-white whitespace-nowrap">
                                {totalSum.toLocaleString('ru-RU')} {currencySign}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}