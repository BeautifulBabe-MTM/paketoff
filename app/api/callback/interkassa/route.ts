import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
    const formData = await req.formData()
    const data = Object.fromEntries(formData.entries())
    
    // 1. Проверяем подпись (обязательно!)
    // Интеркасса шлет данные, их нужно отсортировать и сравнить с ik_sign
    const secret = process.env.IK_SECRET_KEY!
    const ikSign = data.ik_sign
    delete data.ik_sign
    
    const signString = Object.keys(data).sort().map(key => data[key]).join(':') + ':' + secret
    const signature = crypto.createHmac('md5', secret).update(signString).digest('base64')

    if (signature !== ikSign) {
        return new NextResponse('Invalid signature', { status: 403 })
    }

    // 2. Если подпись верна, ищем заказ в базе
    if (data.ik_inv_st === 'success') {
        await prisma.plOrder.update({
            where: { id: data.ik_pm_no as string },
            data: { paymentStatus: 'PAID' }
        })
    }

    // 3. Отвечаем Интеркассе "OK", чтобы она успокоилась
    return new NextResponse('OK', { status: 200 })
}