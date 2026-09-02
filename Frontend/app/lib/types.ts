export type Product = {
  id: string | number
  name: string
  category: string
  price: number
  image: string
  images?: string[]
  description?: string
  stock?: number
  rating?: number
}

export type CartItem = Product & {
  quantity: number
}
