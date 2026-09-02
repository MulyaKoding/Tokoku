import type { Product } from "./types"

export type { Product }

export const PRODUCTS: Product[] = [
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
  },
  {
    id: "7",
    name: "Gamepad Elite Wireless",
    category: "Gaming",
    price: 899000,
    image:
      "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?w=800&q=80",
    description:
      "Gamepad wireless dengan trigger adaptif, haptic feedback, dan kompatibel multi-platform.",
    stock: 30,
    rating: 4.3
  },
  {
    id: "8",
    name: "Portable Speaker Boom",
    category: "Speaker",
    price: 650000,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
    description:
      "Speaker portabel tahan air IPX7 dengan bass kuat dan baterai hingga 20 jam pemakaian.",
    stock: 22,
    rating: 4.4
  },
  {
    id: "9",
    name: "AeroDrone 4K",
    category: "Drone",
    price: 6200000,
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
    description:
      "Drone kamera 4K dengan gimbal 3-axis, waktu terbang 34 menit, dan mode obstacle avoidance.",
    stock: 6,
    rating: 4.6
  },
  {
    id: "10",
    name: 'Monitor UltraWide 27"',
    category: "Monitor",
    price: 3400000,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    description:
      "Monitor ultrawide 27 inci resolusi QHD, refresh rate 144Hz, ideal untuk kerja multitasking dan gaming.",
    stock: 10,
    rating: 4.7
  }
]

export function getProductById(id?: string | number | string[]) {
  if (!id) return undefined
  const target = Array.isArray(id) ? id[0] : String(id)
  return PRODUCTS.find((p) => String(p.id) === target)
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(value)
}
