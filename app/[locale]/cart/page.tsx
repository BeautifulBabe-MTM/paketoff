import { translateString } from '@/lib/translate-server'
import CartClient from './CartClient'

interface CartPageProps {
  params: Promise<{ locale: string }>
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params

  const translations = {
    title: await translateString('Кошик замовлень', locale),
    empty: await translateString('Ваш кошик порожній', locale),
    backToCatalog: await translateString('Повернутися до каталогу', locale),
    qtyLabel: await translateString('Тираж', locale),
    totalLabel: await translateString('Сума', locale),
    summaryTitle: await translateString('Разом до сплати', locale),
    checkoutBtn: await translateString('Перейти до оформлення', locale),
    printLabel: await translateString('Друк', locale),
    sizeLabel: await translateString('Розмір', locale),
    densityLabel: await translateString('Щільність', locale),
    totalCartSumLabel: await translateString('Загальна вартість', locale),
    pcsUnit: await translateString('шт', locale),
    
    checkoutTitle: await translateString('Оформлення замовлення', locale),
    fullName: await translateString('Ім’я та Прізвище', locale),
    phone: await translateString('Номер телефону', locale),
    email: await translateString('Електронна пошта', locale),
    country: await translateString('Країна доставки', locale),
    city: await translateString('Місто', locale),
    address: await translateString('Адреса (Вулиця, будинок)', locale),
    postalCode: await translateString('Поштовий індекс', locale),
    paymentMethod: await translateString('Спосіб оплати', locale),
    submitOrder: await translateString('Підтвердити замовлення', locale),
  }

  return <CartClient locale={locale} translations={translations} />
}