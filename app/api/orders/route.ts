import { NextResponse } from 'next/server'

// Если у тебя используется Prisma, можешь раскомментировать импорт базы
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        
        // Посмотрим в консоль терминала (не браузера!), что именно прилетело с фронта
        console.log('=== НОВИЙ ЗАПИТ НА ЗАМОВЛЕННЯ ===', JSON.stringify(body, null, 2))

        const { client, shipping, paymentMethod, items, totalSum, currency, locale } = body

        // Простейшая серверная валидация на коленке
        if (!client?.name || !client?.email || !items || items.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields or cart is empty' },
                { status: 400 }
            )
        }

        // 1. ТУТ БУДЕТ ЗАПИСЬ В БАЗУ ДАННЫХ (Prisma / MongoDB)
        // const order = await prisma.order.create({
        //     data: { ... }
        // })
        
        // Пока базы нет — генерируем фейковый ID для тестов фронта
        const fakeOrderId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase()

        // 2. РАЗВЕТВЛЕНИЕ ЛОГИКИ ОПЛАТЫ
        if (paymentMethod === 'card') {
            
            // Сюда мы потом вставим реальный Stripe / WayForPay.
            // Шлюз вернет ссылку, а мы передадим её фронтенду.
            
            let paymentUrl = ''
            
            if (currency === 'UAH' || locale === 'uk') {
                // Инициализируем WayForPay и получаем ссылку
                paymentUrl = 'https://secure.wayforpay.com/page?v=fake-merchant-session' 
            } else {
                // Инициализируем Stripe Checkout Session и получаем ссылку
                paymentUrl = 'https://checkout.stripe.com/c/pay/fake-stripe-session'
            }

            return NextResponse.json({ 
                success: true, 
                orderId: fakeOrderId,
                url: paymentUrl // Фронтенд подхватит этот url и редиректнет юзера
            })

        } else {
            // Если выбран B2B Invoice / IBAN (обычный инвойс без онлайн-оплаты)
            // Мы просто подтверждаем заказ. Фронт очистит корзину и кинет на /success
            return NextResponse.json({ 
                success: true, 
                orderId: fakeOrderId 
            })
        }

    } catch (error) {
        console.error('API_ORDERS_ERROR:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}