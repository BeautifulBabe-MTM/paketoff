import { translateString } from '@/lib/translate-server'
import NavbarClient from './Navbar' // Импортируем визуальную часть

interface NavbarServerProps {
  locale: string
}

export default async function NavbarServer({ locale }: NavbarServerProps) {
  // Переводим всё на сервере один раз (оно кэшируется, так что это мгновенно)
  const translatedCatalog = await translateString('Каталог', locale)
  const translatedAbout = await translateString('Про нас', locale)
  const translatedDelivery = await translateString('Доставка й Оплата', locale)
  const translatedContacts = await translateString('Контакти', locale)
  const translatedLogin = await translateString('Увійти', locale)
  const translatedLoginMobile = await translateString('Увійти до кабінету', locale)

  // Передаем готовые тексты в клиентский навбар
  return (
    <NavbarClient 
      locale={locale}
      translations={{
        catalog: translatedCatalog,
        about: translatedAbout,
        delivery: translatedDelivery,
        contacts: translatedContacts,
        login: translatedLogin,
        loginMobile: translatedLoginMobile
      }}
    />
  )
}