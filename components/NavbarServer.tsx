import { translateString } from '@/lib/translate-server'
import NavbarClient from './Navbar' // Импортируем визуальную часть

interface NavbarServerProps {
  locale: string
}

export default async function NavbarServer({ locale }: NavbarServerProps) {
  const translatedCatalog = await translateString('Каталог', locale)
  const translatedAbout = await translateString('Про нас', locale)
  const translatedDelivery = await translateString('Доставка й Оплата', locale)
  const translatedContacts = await translateString('Контакти', locale)
  const translatedPantone = await translateString('Кольори Pantone', locale)
  const translatedLogin = await translateString('Увійти', locale)
  const translatedLoginMobile = await translateString('Увійти до кабінету', locale)

  return (
    <NavbarClient 
      locale={locale}
      translations={{
        catalog: translatedCatalog,
        about: translatedAbout,
        delivery: translatedDelivery,
        contacts: translatedContacts,
        pantone: translatedPantone,
        login: translatedLogin,
        loginMobile: translatedLoginMobile
      }}
    />
  )
}