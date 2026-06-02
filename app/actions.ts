'use server'
import { prisma } from '@/lib/prisma'
import { translateProductsList } from '@/lib/translate-server'

export async function fetchMoreProducts(skip: number, category: string | null, locale: string) {
    const products = await prisma.product.findMany({
        where: category ? { category } : {},
        skip: skip,
        take: 15,
        orderBy: { createdAt: 'desc' },
    })
    return await translateProductsList(products, locale)
}