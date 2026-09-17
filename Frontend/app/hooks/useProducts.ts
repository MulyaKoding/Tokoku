"use client"

import { useState, useEffect, useCallback } from "react"
import type { Product } from "@/app/lib/types"
import { getProducts, getProductById, dummyProducts } from "@/app/lib/products"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(dummyProducts)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError("Gagal memuat daftar produk.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
}

export function useProductDetail(id?: string | number | string[]) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setProduct(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await getProductById(id)
      setProduct(data || null)
    } catch (err) {
      setError("Gagal memuat detail produk.")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  return { product, loading, error, refetch: fetchProduct }
}
