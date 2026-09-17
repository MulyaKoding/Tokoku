import type { Product } from "./types"
import {
  getProducts as fetchApiProducts,
  getProductById as fetchApiProductById,
  dummyProducts,
  formatRupiah,
  createProduct,
  updateProduct,
  deleteProduct
} from "./api"

export type { Product }

export const PRODUCTS: Product[] = dummyProducts

export async function getProducts(): Promise<Product[]> {
  return await fetchApiProducts()
}

export async function getProductById(
  id?: string | number | string[]
): Promise<Product | undefined> {
  if (!id) return undefined
  const target = Array.isArray(id) ? id[0] : String(id)
  return await fetchApiProductById(target)
}

export {
  dummyProducts,
  formatRupiah,
  createProduct,
  updateProduct,
  deleteProduct
}
