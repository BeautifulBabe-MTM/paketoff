export interface CartItem {
  id: string
  productId: string
  name: string
  originalName: string
  size: string
  density: string | null
  print: string
  quantity: number
  pricePerUnit: number
  totalPrice: number
  image: string | null
  currency: string
}

export function getCartItems(): CartItem[] {
  if (typeof window === 'undefined') return []
  const cart = localStorage.getItem('cart')
  return cart ? JSON.parse(cart) : []
}

export function saveCartItems(items: CartItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('cart', JSON.stringify(items))

  window.dispatchEvent(new Event('cart-updated'))
}