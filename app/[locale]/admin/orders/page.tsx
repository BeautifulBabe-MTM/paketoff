import { prisma } from '@/lib/prisma'
import StatusSelect from './StatusSelect'
import { OrderStatus } from '@prisma/client'

export default async function AdminOrders() {
  const orders = await prisma.plOrder.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Замовлення PackLab</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-100 border-b">
              <th className="p-4">Клієнт</th>
              <th className="p-4">Сума</th>
              <th className="p-4">Адреса</th>
              <th className="p-4">Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-zinc-50">
                <td className="p-4">
                  <div className="font-semibold">{order.client.name}</div>
                  <div className="text-xs text-zinc-500">{order.client.phone}</div>
                </td>
                <td className="p-4 font-bold">{order.totalSum} {order.currency}</td>
                <td className="p-4 text-sm">{order.shipping.city}, {order.shipping.address}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <StatusSelect orderId={order.id} currentStatus={order.paymentStatus as OrderStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}