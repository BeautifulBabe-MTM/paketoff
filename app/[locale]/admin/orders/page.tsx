import { prisma } from '@/lib/prisma'
import StatusSelect from './StatusSelect'
import { OrderStatus } from '@prisma/client'

export default async function AdminOrders() {
  const orders = await prisma.plOrder.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
        Замовлення PackLab
      </h1>

      {/* Контейнер таблицы: bg-white -> dark:bg-zinc-900 */}
      <div className="overflow-x-auto bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* Шапка: bg-zinc-100 -> dark:bg-zinc-800 */}
            <tr className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
              <th className="p-4 text-zinc-700 dark:text-zinc-300">Клієнт</th>
              <th className="p-4 text-zinc-700 dark:text-zinc-300">Сума</th>
              <th className="p-4 text-zinc-700 dark:text-zinc-300">Адреса</th>
              <th className="p-4 text-zinc-700 dark:text-zinc-300">Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              // Строка: hover:bg-zinc-50 -> dark:hover:bg-zinc-800
              <tr key={order.id} className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                <td className="p-4">
                  <div className="font-semibold text-zinc-900 dark:text-white">{order.client.name}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{order.client.phone}</div>
                </td>
                <td className="p-4 font-bold text-zinc-900 dark:text-white">{order.totalSum} {order.currency}</td>
                <td className="p-4 text-sm text-zinc-700 dark:text-zinc-300">{order.shipping.city}, {order.shipping.address}</td>
                <td className="p-4">
                  {/* Статус-бейдж */}
                  <span className={`px-2 py-1 rounded text-xs ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <StatusSelect orderId={order.id} currentStatus={order.paymentStatus as OrderStatus} />
                </td>
                <td className="p-4">
                  <a href={`/admin/orders/${order.id}`} className="text-blue-500 hover:underline">
                    Деталі
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}