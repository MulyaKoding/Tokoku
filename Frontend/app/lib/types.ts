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

export type User = {
  id: string
  name: string
  email: string
  role?: string
  avatar?: string
  provider?: "email" | "facebook" | "google"
  token?: string
}

export type AuthResponse = {
  token: string
  user: User
}
