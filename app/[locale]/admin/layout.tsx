import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies() 
  
  const isAdmin = cookieStore.get('admin_secret')?.value === process.env.ADMIN_PASSWORD

  if (!isAdmin) {
    return <div>Доступ заборонено. Введіть пароль.</div>
  }

  return <>{children}</>
}