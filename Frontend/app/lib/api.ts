import type { Product } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Data sementara. Setelah endpoint di Backend Go (gin) siap,
// hapus dummyProducts dan aktifkan fetch di bawah.
const dummyProducts: Product[] = [
  {
    id: 1,
    name: "Kamera Mirrorless Pro X200",
    category: "Kamera",
    price: 8500000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
  },
  {
    id: 2,
    name: "Headphone Nirkabel AeroSound",
    category: "Audio",
    price: 1450000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  },
  {
    id: 3,
    name: "Smartwatch Pulse Fit 3",
    category: "Wearable",
    price: 2100000,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  },
  {
    id: 4,
    name: "Speaker Bluetooth BoomBox Mini",
    category: "Audio",
    price: 750000,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
  },
  {
    id: 5,
    name: "Drone Skyview Lite",
    category: "Kamera",
    price: 6200000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80",
  },
  {
    id: 6,
    name: "Earbuds AirClip Pro",
    category: "Audio",
    price: 990000,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
  },
  {
    id: 7,
    name: "Power Bank ChargeMax 20K",
    category: "Aksesori",
    price: 320000,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1609692814857-2eb1651a0f28?w=600&q=80",
  },
  {
    id: 8,
    name: "Keyboard Mekanikal TypeWave",
    category: "Aksesori",
    price: 890000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
  },
];

export async function getProducts(): Promise<Product[]> {
  // Ganti dengan ini kalau endpoint Backend sudah siap:
  //
  // const res = await fetch(`${API_BASE_URL}/products`, { cache: "no-store" });
  // if (!res.ok) throw new Error("Gagal mengambil daftar produk");
  // return res.json();

  return dummyProducts;
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}