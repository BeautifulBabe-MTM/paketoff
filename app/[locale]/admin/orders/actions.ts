'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { OrderStatus } from '@prisma/client'

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  await prisma.plOrder.update({
    where: { id: orderId },
    data: { paymentStatus: newStatus }
  })
  revalidatePath('/admin/orders')
}