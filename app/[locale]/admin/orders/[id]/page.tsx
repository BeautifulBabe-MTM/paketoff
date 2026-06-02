import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { OrderStatus } from '@prisma/client'
import DeleteButton from './DeleteButton' // Убедись, что экшн экспортирован

export default async function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const order = await prisma.plOrder.findUnique({
        where: { id: id }
    })

    if (!order) notFound()

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Замовлення #{order.id.slice(-6)}</h1>
                <span className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 rounded-full text-sm font-medium dark:text-zinc-300">
                    {order.paymentStatus}
                </span>
            </div>

            <div className="grid gap-6">
                {/* Секция данных */}
                <section className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Інформація про клієнта</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-zinc-500">Ім'я</p>
                            <p className="dark:text-white font-medium">{order.client.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500">Телефон</p>
                            <p className="dark:text-white font-medium">{order.client.phone}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm text-zinc-500">Адреса доставки</p>
                            <p className="dark:text-white font-medium">{order.shipping.city}, {order.shipping.address}</p>
                        </div>
                    </div>
                </section>

                {/* Секция товаров */}
                <section className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Товари ({order.items.length})</h2>
                    <ul className="space-y-3">
                        {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                <div>
                                    <p className="dark:text-white font-medium">{item.name}</p>
                                    <p className="text-xs text-zinc-500">Розмір: {item.size} | Друк: {item.print}</p>
                                </div>
                                <div className="text-right">
                                    <p className="dark:text-white">{item.quantity} шт.</p>
                                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-300">{item.total.toFixed(2)} {order.currency}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between font-bold text-lg dark:text-white">
                        <span>Разом:</span>
                        <span>{order.totalSum.toFixed(2)} {order.currency}</span>
                    </div>
                </section>
            </div>

            {/* Кнопки управления */}
            <div className="flex gap-4 mt-8">
                <a href={`tel:${order.client.phone}`} className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">Подзвонити</a>
                <a href={`https://t.me/${order.client.phone}`} className="flex-1 text-center bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg transition">Telegram</a>
            </div>

            <DeleteButton orderId={order.id} />
        </div>
    )
}