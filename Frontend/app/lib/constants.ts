export const ITEMS_PER_PAGE = 8

export const CATEGORIES_ALL = "Semua"

export const SORT_OPTIONS = [
  { value: "default", label: "Terbaru" },
  { value: "price-asc", label: "Harga: Rendah ke Tinggi" },
  { value: "price-desc", label: "Harga: Tinggi ke Rendah" },
  { value: "name-asc", label: "Nama: A-Z" }
] as const

export type SortOptionValue = (typeof SORT_OPTIONS)[number]["value"]

export const CURRENCY_CONFIG = {
  locale: "id-ID",
  currency: "IDR",
  minimumFractionDigits: 0
} as const

export const STORAGE_KEYS = {
  USER_SESSION: "tokoku_user_session",
  CART: "tokoku_cart_items"
} as const

export const API_ENDPOINTS = {
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (id: string | number) => `/products/${id}`,
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_REQUEST_REGISTER: "/auth/request-register",
  AUTH_VERIFY_REGISTER: "/auth/verify-register",
  AUTH_RESEND_CODE: "/auth/resend-code",
  AUTH_ME: "/auth/me"
} as const
