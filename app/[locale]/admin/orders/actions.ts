'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { OrderStatus } from '@prisma/client'

export async function deleteOrder(orderId: string) {
    await prisma.plOrder.delete({ where: { id: orderId } })
    revalidatePath('/admin/orders')
}

export async function editOrder(orderId: string, data: any) {
    await prisma.plOrder.update({ where: { id: orderId }, data })
    revalidatePath(`/admin/orders/${orderId}`)
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    await prisma.plOrder.update({
        where: { id: orderId },
        data: { paymentStatus: newStatus }
    })
    revalidatePath('/admin/orders')
}