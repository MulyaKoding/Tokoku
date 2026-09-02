"use client"

import { createContext, useContext, useMemo, useState, ReactNode } from "react"
import type { Product, CartItem } from "@/app/lib/types"

export type CartContextType = {
  cart: CartItem[]
  cartItems: CartItem[]
  addToCart: (product: Product | Omit<CartItem, "quantity">, quantity?: number) => void
  updateQuantity: (id: number | string, quantity: number) => void
  updateQty: (id: number | string, delta: number) => void
  removeFromCart: (id: number | string) => void
  clearCart: () => void
  cartCount: number
  totalItems: number
  cartTotal: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  function addToCart(
    product: Product | Omit<CartItem, "quantity">,
    quantity: number = 1
  ) {
    setCart((prev) => {
      const existing = prev.find((item) => String(item.id) === String(product.id))
      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  function updateQuantity(id: number | string, quantity: number) {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((item) => String(item.id) !== String(id))
        : prev.map((item) =>
            String(item.id) === String(id) ? { ...item, quantity } : item
          )
    )
  }

  function updateQty(id: number | string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          String(item.id) === String(id)
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  function removeFromCart(id: number | string) {
    setCart((prev) => prev.filter((item) => String(item.id) !== String(id)))
  }

  function clearCart() {
    setCart([])
  }

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  )

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart,
        addToCart,
        updateQuantity,
        updateQty,
        removeFromCart,
        clearCart,
        cartCount: totalItems,
        totalItems,
        cartTotal: totalPrice,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart harus dipakai di dalam <CartProvider>")
  }
  return ctx
}
