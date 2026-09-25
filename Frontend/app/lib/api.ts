import type { Product, User, AuthResponse } from "./types"
import { API_ENDPOINTS, CURRENCY_CONFIG } from "./constants"

const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
const API_BASE_URL = rawUrl.endsWith("/api/v1")
  ? rawUrl
  : `${rawUrl.replace(/\/+$/, "")}/api/v1`

export const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Polaroid OneStep 2",
    category: "Kamera",
    price: 1850000,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
    description:
      "Kamera instan dengan lensa autofocus, flash otomatis, dan desain retro yang ikonik. Cocok untuk momen spontan sehari-hari.",
    stock: 12,
    rating: 4.7
  },
  {
    id: "2",
    name: "Studio Headphone Pro",
    category: "Audio",
    price: 950000,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    description:
      "Headphone over-ear dengan active noise cancelling, baterai tahan hingga 30 jam, dan suara jernih untuk studio maupun harian.",
    stock: 20,
    rating: 4.5
  },
  {
    id: "3",
    name: "Smartwatch Fit Series",
    category: "Wearable",
    price: 1250000,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    description:
      "Smartwatch dengan pelacak detak jantung, SpO2, mode olahraga, dan baterai tahan 7 hari.",
    stock: 15,
    rating: 4.6
  },
  {
    id: "4",
    name: "Mechanical Keyboard Aksesori",
    category: "Aksesori",
    price: 750000,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    description:
      "Keyboard mekanik hot-swappable dengan switch tactile, backlight RGB, dan konektivitas wireless dual-mode.",
    stock: 25,
    rating: 4.4
  },
  {
    id: "5",
    name: "UltraBook 14 Pro",
    category: "Laptop",
    price: 12500000,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    description:
      "Laptop tipis dan ringan dengan performa tinggi, layar 14 inci resolusi tajam, dan baterai seharian penuh.",
    stock: 8,
    rating: 4.8
  },
  {
    id: "6",
    name: "Smartphone X200",
    category: "Smartphone",
    price: 4500000,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    description:
      "Smartphone dengan kamera triple 108MP, layar AMOLED 120Hz, dan pengisian cepat 65W.",
    stock: 18,
    rating: 4.5
  }
]

type ApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}`, {
      cache: "no-store"
    })

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`)
    }

    const result: ApiResponse<Product[]> = await res.json()
    if (
      result.success &&
      Array.isArray(result.data) &&
      result.data.length > 0
    ) {
      return result.data
    }
  } catch (err) {
    console.warn(
      "Backend API tidak merespons / kosong, menggunakan data fallback:",
      err
    )
  }

  return dummyProducts
}

export async function getProductById(
  id: string | number
): Promise<Product | undefined> {
  const targetId = String(id)
  try {
    const res = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PRODUCT_BY_ID(targetId)}`,
      {
        cache: "no-store"
      }
    )

    if (res.ok) {
      const result: ApiResponse<Product> = await res.json()
      if (result.success && result.data) {
        return result.data
      }
    }
  } catch (err) {
    console.warn(
      "Backend API tidak merespons untuk ID ini, menggunakan data fallback:",
      err
    )
  }

  return dummyProducts.find((p) => String(p.id) === targetId)
}

export async function createProduct(
  product: Omit<Product, "id">
): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    })
    if (!res.ok) throw new Error("Gagal membuat produk")
    const result: ApiResponse<Product> = await res.json()
    return result.data || null
  } catch (err) {
    console.error("Error createProduct API:", err)
    return null
  }
}

export async function updateProduct(
  id: string,
  product: Partial<Product>
): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PRODUCT_BY_ID(id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
      }
    )
    if (!res.ok) throw new Error("Gagal mengupdate produk")
    const result: ApiResponse<null> = await res.json()
    return result.success
  } catch (err) {
    console.error("Error updateProduct API:", err)
    return false
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PRODUCT_BY_ID(id)}`,
      {
        method: "DELETE"
      }
    )
    if (!res.ok) throw new Error("Gagal menghapus produk")
    const result: ApiResponse<null> = await res.json()
    return result.success
  } catch (err) {
    console.error("Error deleteProduct API:", err)
    return false
  }
}

export async function loginApi(
  email: string,
  password: string
): Promise<{ success: boolean; data?: AuthResponse; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const result: ApiResponse<AuthResponse> = await res.json()
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Gagal masuk. Periksa email & password Anda."
      }
    }

    return { success: true, data: result.data, message: result.message }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Gagal terhubung ke server backend"
    }
  }
}

export async function registerApi(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; data?: AuthResponse; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_REGISTER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })

    const result: ApiResponse<AuthResponse> = await res.json()
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Gagal melakukan registrasi"
      }
    }

    return { success: true, data: result.data, message: result.message }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Gagal terhubung ke server backend"
    }
  }
}

export async function requestRegisterApi(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; message?: string; debugOtp?: string }> {
  try {
    const res = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH_REQUEST_REGISTER}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      }
    )

    const result: ApiResponse<{ email: string; debug_otp?: string }> =
      await res.json()
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Gagal mengirimkan kode verifikasi email"
      }
    }

    return {
      success: true,
      message: result.message,
      debugOtp: result.data?.debug_otp
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Gagal terhubung ke server backend"
    }
  }
}

export async function verifyRegisterApi(
  email: string,
  code: string
): Promise<{ success: boolean; data?: AuthResponse; message?: string }> {
  try {
    const res = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH_VERIFY_REGISTER}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      }
    )

    const result: ApiResponse<AuthResponse> = await res.json()
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Kode verifikasi salah atau sudah kadaluarsa"
      }
    }

    return { success: true, data: result.data, message: result.message }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Gagal terhubung ke server backend"
    }
  }
}

export async function resendCodeApi(
  email: string
): Promise<{ success: boolean; message?: string; debugOtp?: string }> {
  try {
    const res = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH_RESEND_CODE}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }
    )

    const result: ApiResponse<{ email: string; debug_otp?: string }> =
      await res.json()
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Gagal mengirim ulang kode"
      }
    }

    return {
      success: true,
      message: result.message,
      debugOtp: result.data?.debug_otp
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Gagal terhubung ke server backend"
    }
  }
}

export async function getMeApi(token: string): Promise<User | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_ME}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) return null
    const result: ApiResponse<User> = await res.json()
    return result.data || null
  } catch (err) {
    console.error("Error getMe API:", err)
    return null
  }
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: "currency",
    currency: CURRENCY_CONFIG.currency,
    minimumFractionDigits: CURRENCY_CONFIG.minimumFractionDigits
  }).format(value)
}
