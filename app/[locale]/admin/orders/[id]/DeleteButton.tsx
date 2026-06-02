'use client'

import { deleteOrder } from '../actions' // импортируй свой экшн
import { useRouter } from 'next/navigation'

export default function DeleteButton({ orderId }: { orderId: string }) {
  const router = useRouter()

  return (
    <button 
      onClick={async () => {
        if (confirm('Видалити замовлення?')) {
          await deleteOrder(orderId)
          router.push('/admin/orders')
        }
      }} 
      className="mt-6 w-full text-red-500 hover:text-red-700 text-sm py-2"
    >
      Видалити замовлення повністю
    </button>
  )
}