import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        
        // Лог в терминал для контроля входящих данных
        console.log('=== НОВЫЙ ЗАКАЗ PACKLAB ===', JSON.stringify(body, null, 2))

        const { client, shipping, paymentMethod, items, totalSum, currency, locale } = body

        // Строгая серверная валидация, чтобы в базу не улетел пустой запрос
        if (
            !client?.name || !client?.phone || !client?.email ||
            !shipping?.country || !shipping?.city || !shipping?.address ||
            !items || items.length === 0 || !totalSum
        ) {
            return NextResponse.json(
                { error: 'Missing required checkout fields' },
                { status: 400 }
            )
        }

        // 1. Сохраняем заказ в изолированную коллекцию pl_orders
        const order = await prisma.plOrder.create({
            data: {
                client: {
                    name: client.name,
                    phone: client.phone,
                    email: client.email,
                },
                shipping: {
                    country: shipping.country,
                    city: shipping.city,
                    address: shipping.address,
                    zip: shipping.zip || '', // Для Украины может оставаться пустым
                },
                paymentMethod,
                paymentStatus: 'PENDING', // По умолчанию ждём оплаты
                totalSum: Number(totalSum),
                currency,
                locale,
                items: items.map((item: any) => ({
                    productId: item.productId,
                    name: item.name,
                    size: item.size,
                    print: item.print,
                    quantity: Number(item.quantity),
                    total: Number(item.total)
                }))
            }
        })

        // 2. Разветвление логики оплаты
        if (paymentMethod === 'card') {
            let paymentUrl = ''
            
            // Если заказ в гривне или оформлен через украинскую локаль
            if (currency === 'UAH' || locale === 'uk') {
                
                // TODO: Сюда вставим реальную интеграцию WayForPay (передаем order.id и order.totalSum)
                paymentUrl = `https://secure.wayforpay.com/page?v=fake-session&orderId=${order.id}`
                
            } else {
                
                // TODO: Сюда вставим реальную интеграцию Stripe (передаем order.id и order.totalSum)
                paymentUrl = `https://checkout.stripe.com/c/pay/fake-stripe-session?orderId=${order.id}`
                
            }

            // Возвращаем ссылку на платёжку. Фронтенд редиректнет юзера туда.
            return NextResponse.json({ 
                success: true, 
                orderId: order.id,
                url: paymentUrl 
            })

        } else {
            // Если выбран B2B Invoice / IBAN (обычный счёт)
            // Платёжный шлюз не нужен. Фронтенд очистит корзину и кинет на страницу /success
            return NextResponse.json({ 
                success: true, 
                orderId: order.id 
            })
        }

    } catch (error) {
        console.error('API_ORDERS_CREATE_ERROR:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}