'use client'

import { deleteOrder } from '../actions'
import { useRouter } from 'next/navigation'

export default function OrderActions({ orderId }: { orderId: string }) {
  const router = useRouter()

  return (
    <div className="flex gap-4 mt-8 pt-6 border-t dark:border-zinc-700">
      <button 
        onClick={async () => {
          if (confirm('Видалити замовлення?')) {
            await deleteOrder(orderId)
            router.push('/admin/orders')
          }
        }}
        className="text-red-500 hover:text-red-700 font-bold"
      >
        Видалити замовлення
      </button>
      
      {/* Здесь можно добавить кнопку Редактировать, 
          которая будет открывать модалку или переводить в режим редактирования */}
    </div>
  )
}