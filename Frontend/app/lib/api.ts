import type { Product, User, AuthResponse } from "./types"
import { API_ENDPOINTS, CURRENCY_CONFIG } from "./constants"

const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
const API_BASE_URL = rawUrl.endsWith("/api/v1")
  ? rawUrl
  : `${rawUrl.replace(/\/+$/, "")}/api/v1`

export const dummyProducts: Product[] = [
  // === KAMERA (5) ===
  {
    id: "1",
    name: "Polaroid OneStep 2 Instant Camera",
    category: "Kamera",
    price: 1850000,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
    description: "Kamera instan dengan lensa autofocus berkualitas tinggi, flash otomatis, dan desain retro legendaris.",
    stock: 15,
    rating: 4.7
  },
  {
    id: "2",
    name: "Sony Alpha A7 IV Mirrorless",
    category: "Kamera",
    price: 34999000,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    description: "Kamera mirrorless full-frame 33MP dengan sensor Exmor R BSI CMOS dan perekaman video 4K 60p 10-bit.",
    stock: 8,
    rating: 4.9
  },
  {
    id: "3",
    name: "Canon EOS R6 Mark II",
    category: "Kamera",
    price: 38500000,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
    description: "Kamera profesional dengan pemotretan beruntun hingga 40 fps, stabilisasi gambar 8-stop, dan Dual Pixel CMOS AF II.",
    stock: 6,
    rating: 4.8
  },
  {
    id: "4",
    name: "Fujifilm X-T5 Silver Edition",
    category: "Kamera",
    price: 26499000,
    image: "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=800&q=80",
    description: "Kamera mirrorless sensor X-Trans CMOS 5 HR 40.2MP bergaya klasik dengan dial mekanis elegan.",
    stock: 10,
    rating: 4.8
  },
  {
    id: "5",
    name: "GoPro Hero 12 Black Action Cam",
    category: "Kamera",
    price: 6299000,
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80",
    description: "Action camera tahan air hingga 10m dengan video HDR 5.3K, HyperSmooth 6.0, dan audio Bluetooth.",
    stock: 25,
    rating: 4.6
  },
  // === AUDIO (5) ===
  {
    id: "6",
    name: "Studio Headphone Pro ANC",
    category: "Audio",
    price: 1450000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    description: "Headphone over-ear nirkabel dengan Active Noise Cancelling, driver 40mm kustom, dan daya baterai 40 jam.",
    stock: 30,
    rating: 4.7
  },
  {
    id: "7",
    name: "Wireless Earbuds True Pro TWS",
    category: "Audio",
    price: 899000,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    description: "Earbuds TWS nirkabel dengan latensi rendah, mikrofon dual beamforming, dan case pengisian wireless.",
    stock: 40,
    rating: 4.5
  },
  {
    id: "8",
    name: "Retro Hi-Fi Turntable Vinyl",
    category: "Audio",
    price: 2750000,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
    description: "Pemutar piringan hitam vinyl vintage dengan pre-amp internal, cartridge magnetik Audio-Technica, dan koneksi USB.",
    stock: 12,
    rating: 4.6
  },
  {
    id: "9",
    name: "Condenser USB Microphone Studio",
    category: "Audio",
    price: 1199000,
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80",
    description: "Mikrofon kondenser polar cardioid 24-bit/192kHz dengan filter pop terpasang, sempurna untuk podcast dan streaming.",
    stock: 22,
    rating: 4.8
  },
  {
    id: "10",
    name: "Audiophile Open-Back Headphone",
    category: "Audio",
    price: 3600000,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    description: "Headphone audiophile open-back dengan panggung suara luas, reproduksi nada netral, dan earpad velour nyaman.",
    stock: 14,
    rating: 4.9
  },
  // === WEARABLE (5) ===
  {
    id: "11",
    name: "Smartwatch Fit Series 5",
    category: "Wearable",
    price: 1499000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    description: "Smartwatch pintar dengan sensor SpO2, pemantau denyut jantung 24/7, GPS mandiri, dan tahan air 5 ATM.",
    stock: 28,
    rating: 4.6
  },
  {
    id: "12",
    name: "Galaxy Watch Ultra Titanium",
    category: "Wearable",
    price: 8499000,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
    description: "Jam pintar tangguh berbahan bodi titanium grade penerbangan, layar safir super terang, dan navigasi outdoor canggih.",
    stock: 15,
    rating: 4.8
  },
  {
    id: "13",
    name: "Smart Fitness Band 8 Pro",
    category: "Wearable",
    price: 599000,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80",
    description: "Gelang kebugaran ramping dengan layar AMOLED 1.62 inci, 150+ mode olahraga, dan masa pakai baterai 14 hari.",
    stock: 50,
    rating: 4.5
  },
  {
    id: "14",
    name: "Classic Chrono Smart Hybrid",
    category: "Wearable",
    price: 3250000,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
    description: "Paduan estetika jam tangan mekanik analog mewah dengan fungsi pintar notifikasi, pelacak langkah, dan denyut nadi.",
    stock: 16,
    rating: 4.7
  },
  {
    id: "15",
    name: "Smart Audio Glasses AR Lite",
    category: "Wearable",
    price: 2199000,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    description: "Kacamata pintar dengan speaker open-ear terintegrasi, lensa anti radiasi UV400, dan mikrofon peredam bising.",
    stock: 18,
    rating: 4.4
  },
  // === AKSESORI (5) ===
  {
    id: "16",
    name: "Mechanical Keyboard RGB Custom",
    category: "Aksesori",
    price: 1150000,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    description: "Keyboard mekanik 75% hot-swappable dengan gasket mount, keycaps PBT dye-sub, dan konektivitas tri-mode wireless.",
    stock: 35,
    rating: 4.7
  },
  {
    id: "17",
    name: "Ergonomic Vertical Mouse Wireless",
    category: "Aksesori",
    price: 499000,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
    description: "Mouse vertikal sudut 57 derajat ergonomis untuk mencegah CTS, tombol hening, dan sensor optik presisi.",
    stock: 45,
    rating: 4.6
  },
  {
    id: "18",
    name: "Fast Wireless Charging Stand 3-in-1",
    category: "Aksesori",
    price: 389000,
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
    description: "Dok pengisian nirkabel cepat Qi 15W untuk smartphone, smartwatch, dan earbuds secara simultan.",
    stock: 40,
    rating: 4.5
  },
  {
    id: "19",
    name: "Aluminium Laptop Stand Ergonomic",
    category: "Aksesori",
    price: 279000,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    description: "Dudukan laptop berbahan full aluminium alloy dengan ventilasi pendingin optimal dan ketinggian yang dapat disesuaikan.",
    stock: 55,
    rating: 4.8
  },
  {
    id: "20",
    name: "USB-C Multi-Port Hub 8-in-1 100W",
    category: "Aksesori",
    price: 429000,
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80",
    description: "Hub multiport aluminium dengan HDMI 4K@60Hz, slot SD/TF, 3x USB 3.0, Gigabit Ethernet, dan 100W Power Delivery.",
    stock: 38,
    rating: 4.6
  },
  // === LAPTOP (5) ===
  {
    id: "21",
    name: "UltraBook 14 Pro OLED",
    category: "Laptop",
    price: 13999000,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    description: "Laptop tipis premium dengan layar 2.8K OLED 120Hz, prosesor Intel Core i7 generasi terbaru, dan RAM 16GB.",
    stock: 12,
    rating: 4.8
  },
  {
    id: "22",
    name: "MacBook Pro 16 M3 Max",
    category: "Laptop",
    price: 42999000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    description: "Performa workstation portabel dengan chip Apple M3 Max, layar Liquid Retina XDR, dan baterai hingga 22 jam.",
    stock: 7,
    rating: 4.9
  },
  {
    id: "23",
    name: "Gaming Laptop ROG Strix G16",
    category: "Laptop",
    price: 24500000,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    description: "Laptop gaming bertenaga NVIDIA RTX 4070 8GB, Intel Core i9, sistem pendingin liquid metal, dan layar 240Hz Nebula.",
    stock: 9,
    rating: 4.7
  },
  {
    id: "24",
    name: "ThinkPad X1 Carbon Gen 11",
    category: "Laptop",
    price: 26800000,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
    description: "Laptop bisnis ultra-ringan bobot 1.12kg dengan sertifikasi militer MIL-STD, keyboard legendaris, dan modem 5G LTE.",
    stock: 11,
    rating: 4.8
  },
  {
    id: "25",
    name: "ZenBook Duo Dual Screen 14",
    category: "Laptop",
    price: 31999000,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80",
    description: "Inovasi laptop layar ganda OLED 3K 120Hz dengan keyboard Bluetooth magnetik yang dapat dilepas pasang.",
    stock: 5,
    rating: 4.7
  },
  // === SMARTPHONE (5) ===
  {
    id: "26",
    name: "Smartphone X200 Pro 5G",
    category: "Smartphone",
    price: 6899000,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    description: "Flagship killer dengan prosesor Dimensity 9300, kamera Zeiss 50MP, layar AMOLED LTPO 1.5K, dan fast charge 100W.",
    stock: 20,
    rating: 4.6
  },
  {
    id: "27",
    name: "iPhone 15 Pro Max 256GB Titanium",
    category: "Smartphone",
    price: 21999000,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
    description: "Bodi titanium tangguh berbobot ringan, Action Button kustom, chip A17 Pro, dan kamera telephoto 5x optical zoom.",
    stock: 14,
    rating: 4.9
  },
  {
    id: "28",
    name: "Galaxy Z Fold 5 5G Phantom Black",
    category: "Smartphone",
    price: 23499000,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80",
    description: "Ponsel lipat produktivitas tanpa celah engsel Flex Hinge, multitasking 3 jendela aplikasi, dan dukungan S Pen.",
    stock: 10,
    rating: 4.7
  },
  {
    id: "29",
    name: "Google Pixel 8 Pro AI Camera",
    category: "Smartphone",
    price: 15499000,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
    description: "Kamera komputasional bertenaga Google Tensor G3, fitur AI Best Take & Magic Audio Eraser, dan pembaruan OS 7 tahun.",
    stock: 12,
    rating: 4.8
  },
  {
    id: "30",
    name: "Nothing Phone (2) Glyph Edition",
    category: "Smartphone",
    price: 8799000,
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&q=80",
    description: "Desain bodi transparan ikonik dengan lampu antarmuka Glyph interaktif, Snapdragon 8+ Gen 1, dan Nothing OS bersih.",
    stock: 16,
    rating: 4.5
  },
  // === GAMING (5) ===
  {
    id: "31",
    name: "Gamepad Elite Wireless Controller",
    category: "Gaming",
    price: 1299000,
    image: "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?w=800&q=80",
    description: "Kontroler nirkabel presisi dengan thumbstick yang dapat ditukar, paddle belakang, hair trigger locks, dan baterai 40 jam.",
    stock: 32,
    rating: 4.7
  },
  {
    id: "32",
    name: "PlayStation 5 Slim Digital Console",
    category: "Gaming",
    price: 7699000,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    description: "Konsol generasi terbaru dengan SSD ultra cepat 1TB, grafis ray tracing 4K 120Hz, dan kontroler DualSense haptic feedback.",
    stock: 15,
    rating: 4.9
  },
  {
    id: "33",
    name: "VR Headset Virtual Reality 4K",
    category: "Gaming",
    price: 6890000,
    image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800&q=80",
    description: "Kacamata VR resolusi 4K dengan pelacak gerak inside-out 6DoF, lensa pancake tajam, dan perpustakaan game tanpa kabel.",
    stock: 11,
    rating: 4.6
  },
  {
    id: "34",
    name: "Retro Arcade Fight Stick Pro",
    category: "Gaming",
    price: 1650000,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    description: "Fight stick arkade dengan komponen asli Sanwa Denshi, respons instan nol latensi, dan kompatibilitas PC & konsol.",
    stock: 18,
    rating: 4.5
  },
  {
    id: "35",
    name: "Nintendo Switch OLED Neon Console",
    category: "Gaming",
    price: 4150000,
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80",
    description: "Konsol hybrid fleksibel dengan layar OLED 7 inci warna cerah, penyangga lebar yang dapat diatur, dan audio jernih.",
    stock: 24,
    rating: 4.8
  },
  // === SPEAKER (5) ===
  {
    id: "36",
    name: "Portable Speaker Boom IPX7",
    category: "Speaker",
    price: 750000,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
    description: "Speaker Bluetooth tahan banting dan anti air IPX7 dengan suara 360 derajat bertenaga dan baterai tahan 16 jam.",
    stock: 35,
    rating: 4.6
  },
  {
    id: "37",
    name: "Smart Home Speaker Voice Assistant",
    category: "Speaker",
    price: 890000,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80",
    description: "Speaker pintar pengontrol smart home dengan asisten suara otomatis, audio definisi tinggi, dan mikrofon far-field sensitif.",
    stock: 26,
    rating: 4.5
  },
  {
    id: "38",
    name: "Marshall Acton III Bluetooth Speaker",
    category: "Speaker",
    price: 4590000,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
    description: "Speaker home audio bergaya vintage ikonik dengan soundstage lebih lebar dan kontrol analog khas Marshall.",
    stock: 14,
    rating: 4.9
  },
  {
    id: "39",
    name: "Soundbar Cinema 5.1 Dolby Atmos",
    category: "Speaker",
    price: 3899000,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    description: "Sistem audio bioskop rumah dengan surround sound 5.1 kanal, subwoofer nirkabel berdentum, dan port eARC.",
    stock: 12,
    rating: 4.7
  },
  {
    id: "40",
    name: "Mini Waterproof Clip Bluetooth Speaker",
    category: "Speaker",
    price: 399000,
    image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80",
    description: "Speaker saku mungil dengan klip carabiner terintegrasi, tahan debu & air IP67, siap diajak bertualang outdoor.",
    stock: 45,
    rating: 4.4
  },
  // === DRONE (5) ===
  {
    id: "41",
    name: "AeroDrone 4K Pro Gimbal 3-Axis",
    category: "Drone",
    price: 7499000,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
    description: "Drone kamera 4K 60fps dengan sensor 1/1.3 inci, gimbal mekanis 3-axis, dan transmisi video digital 10km.",
    stock: 9,
    rating: 4.7
  },
  {
    id: "42",
    name: "DJI Mini 3 Lightweight Foldable Drone",
    category: "Drone",
    price: 5899000,
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80",
    description: "Drone ringkas di bawah 249 gram, True Vertical Shooting untuk medsos, dan waktu terbang 38 menit.",
    stock: 15,
    rating: 4.8
  },
  {
    id: "43",
    name: "FPV Racing Drone Carbon Frame",
    category: "Drone",
    price: 4250000,
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80",
    description: "Drone balap FPV kecepatan tinggi hingga 140km/jam dengan rangka serat karbon 3K dan kamera video latensi ultra-rendah.",
    stock: 10,
    rating: 4.5
  },
  {
    id: "44",
    name: "Professional Aerial Drone Cinema 6K",
    category: "Drone",
    price: 28500000,
    image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80",
    description: "Drone sinematografi profesional dengan kamera sensor Full Frame 6K, CinemaDNG RAW, dan sensor penghindar omnidirectional.",
    stock: 4,
    rating: 4.9
  },
  {
    id: "45",
    name: "Pocket Foldable Selfie Drone GPS",
    category: "Drone",
    price: 2199000,
    image: "https://images.unsplash.com/photo-1521405924368-64c5b84bec60?w=800&q=80",
    description: "Drone lipat seukuran telapak tangan dengan fitur pelacakan wajah cerdas, kontrol gestur tangan, dan auto return-to-home.",
    stock: 22,
    rating: 4.3
  },
  // === MONITOR (5) ===
  {
    id: "46",
    name: 'Monitor UltraWide 34" QHD Curved',
    category: "Monitor",
    price: 5850000,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    description: "Layar lengkung 1500R rasio 21:9 resolusi UWQHD 3440x1440, refresh rate 144Hz, dan 99% sRGB untuk produktivitas maksimal.",
    stock: 12,
    rating: 4.8
  },
  {
    id: "47",
    name: 'Curved Gaming Monitor 27" 240Hz',
    category: "Monitor",
    price: 4299000,
    image: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=800&q=80",
    description: "Monitor gaming e-sports dengan respon waktu 0.5ms MPRT, refresh rate kilat 240Hz, dan teknologi AMD FreeSync Premium.",
    stock: 16,
    rating: 4.7
  },
  {
    id: "48",
    name: 'Portable Monitor 15.6" IPS Type-C',
    category: "Monitor",
    price: 1799000,
    image: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800&q=80",
    description: "Monitor portabel ultra tipis bobot 700g, resolusi Full HD IPS, plug-and-play satu kabel Type-C untuk laptop & smartphone.",
    stock: 25,
    rating: 4.6
  },
  {
    id: "49",
    name: 'Studio Display 27" 4K HDR Color Pro',
    category: "Monitor",
    price: 9890000,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80",
    description: "Monitor kalibrasi pabrik Delta E < 1 dengan cakupan 99% DCI-P3, panel IPS Black 4K, dan pengisian daya laptop 90W USB-C.",
    stock: 8,
    rating: 4.9
  },
  {
    id: "50",
    name: 'Dual Monitor Setup Stand 24" Frameless',
    category: "Monitor",
    price: 2650000,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
    description: "Monitor bezel-less 24 inci IPS 100Hz dengan teknologi Eye Care flicker-free dan dudukan VESA ergonomis.",
    stock: 20,
    rating: 4.6
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
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH_REQUEST_REGISTER}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      }
    )

    const result: ApiResponse<{ email: string }> = await res.json()
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Gagal mengirimkan kode verifikasi email"
      }
    }

    return {
      success: true,
      message: result.message
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
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH_RESEND_CODE}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }
    )

    const result: ApiResponse<{ email: string }> = await res.json()
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Gagal mengirim ulang kode"
      }
    }

    return {
      success: true,
      message: result.message
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
