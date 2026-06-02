'use client'

import { updateOrderStatus } from './actions'
import { OrderStatus } from '@prisma/client'

export default function StatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: OrderStatus }) {
    return (
        <select
            defaultValue={currentStatus}
            onChange={(e) => updateOrderStatus(orderId, e.target.value as OrderStatus)}
            className="text-xs border rounded p-1 cursor-pointer bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-700"    >
            <option value="NEW">NEW</option>
            <option value="PAID">PAID</option>
            <option value="PREPARING">PREPARING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
        </select>
    )
}