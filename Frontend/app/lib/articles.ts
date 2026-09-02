export type Article = {
  slug: string
  title: string
  excerpt: string
  content: string[]
  category: string
  author: string
  date: string
  readTime: string
  image: string
}

export const articles: Article[] = [
  {
    slug: "cara-memilih-kamera-instax-untuk-pemula",
    title: "Cara Memilih Kamera Instax untuk Pemula",
    excerpt:
      "Bingung mau beli kamera instan pertama? Ini panduan singkat memilih kamera yang sesuai budget dan kebutuhan kamu.",
    content: [
      "Kamera instan seperti Polaroid dan Instax kembali populer belakangan ini, terutama di kalangan anak muda yang suka mengabadikan momen secara fisik. Namun dengan banyaknya pilihan di pasaran, memilih kamera instan pertama bisa jadi membingungkan.",
      "Hal pertama yang perlu dipertimbangkan adalah jenis film yang digunakan. Beberapa kamera memakai format film kecil (mini), sementara yang lain memakai format lebar (square atau wide). Format ini mempengaruhi ukuran hasil cetak dan harga film per lembarnya.",
      "Kedua, perhatikan fitur eksposur otomatis. Kamera entry-level biasanya hanya punya kontrol dasar, sementara kamera kelas menengah ke atas menawarkan mode selfie, flash otomatis, dan pengaturan cahaya yang lebih presisi.",
      "Terakhir, sesuaikan dengan budget. Kamera instan umumnya terjangkau, tapi biaya film-nya yang perlu diperhitungkan dalam jangka panjang, karena setiap lembar cetak butuh film baru."
    ],
    category: "Kamera",
    author: "Tim TokoKu",
    date: "12 Agustus 2026",
    readTime: "4 menit baca",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&q=80"
  },
  {
    slug: "tips-merawat-headphone-agar-awet",
    title: "5 Tips Merawat Headphone Agar Lebih Awet",
    excerpt:
      "Headphone kesayangan cepat rusak? Coba terapkan lima kebiasaan sederhana ini agar usia pakainya lebih panjang.",
    content: [
      "Headphone adalah salah satu aksesori elektronik yang paling sering dipakai sehari-hari, tapi juga rentan rusak jika tidak dirawat dengan benar. Berikut beberapa tips sederhana yang bisa kamu terapkan.",
      "Pertama, hindari menggulung kabel terlalu kencang. Kebiasaan ini bisa membuat kabel di dalam headphone putus meski bagian luarnya terlihat baik-baik saja.",
      "Kedua, simpan headphone di tempat kering dan hindari suhu ekstrem. Kelembapan berlebih bisa merusak komponen elektronik di dalamnya, sementara panas berlebih bisa merusak busa earpad.",
      "Ketiga, bersihkan earpad secara rutin menggunakan kain lembap agar tidak menumpuk kotoran dan minyak dari kulit. Keempat, jangan menyetel volume terlalu keras dalam waktu lama karena bisa merusak driver speaker.",
      "Kelima, gunakan hardcase saat bepergian untuk melindungi dari benturan. Dengan perawatan yang tepat, headphone bisa bertahan bertahun-tahun lebih lama."
    ],
    category: "Audio",
    author: "Tim TokoKu",
    date: "3 Agustus 2026",
    readTime: "3 menit baca",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80"
  },
  {
    slug: "perbedaan-smartwatch-dan-fitness-tracker",
    title: "Smartwatch vs Fitness Tracker, Mana yang Cocok untukmu?",
    excerpt:
      "Keduanya sama-sama dipakai di pergelangan tangan, tapi fungsi dan target penggunanya cukup berbeda. Ini penjelasannya.",
    content: [
      "Banyak orang masih menyamakan smartwatch dengan fitness tracker, padahal keduanya punya fokus fungsi yang berbeda meski bentuknya mirip.",
      "Fitness tracker dirancang khusus untuk memantau aktivitas fisik seperti langkah kaki, detak jantung, dan kualitas tidur. Ukurannya biasanya lebih ringkas, baterainya lebih tahan lama, dan harganya lebih terjangkau.",
      "Smartwatch, di sisi lain, menawarkan fungsi yang lebih luas — mulai dari notifikasi ponsel, panggilan telepon, hingga instalasi aplikasi pihak ketiga. Trade-off-nya adalah baterai yang lebih boros dan harga yang umumnya lebih mahal.",
      "Jika kamu fokus pada olahraga dan kesehatan dengan budget terbatas, fitness tracker sudah lebih dari cukup. Tapi jika kamu ingin perangkat yang bisa menggantikan sebagian fungsi ponsel, smartwatch adalah pilihan yang lebih tepat."
    ],
    category: "Wearable",
    author: "Tim TokoKu",
    date: "28 Juli 2026",
    readTime: "5 menit baca",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80"
  },
  {
    slug: "kenali-tanda-laptop-butuh-upgrade",
    title: "5 Tanda Laptopmu Sudah Waktunya Diupgrade",
    excerpt:
      "Laptop terasa lemot padahal file kerja makin banyak? Kenali dulu tanda-tandanya sebelum memutuskan beli baru.",
    content: [
      "Laptop yang melambat seiring waktu adalah hal wajar, tapi ada beberapa tanda yang menunjukkan sudah saatnya kamu mempertimbangkan upgrade atau penggantian.",
      "Pertama, aplikasi dasar seperti browser atau pengolah kata sudah terasa berat dan sering not responding. Kedua, baterai tidak lagi bisa bertahan lebih dari satu jam meski sudah dikalibrasi ulang.",
      "Ketiga, penyimpanan selalu penuh meski sudah rutin dibersihkan — ini menandakan kapasitas SSD/HDD sudah tidak lagi mencukupi kebutuhan. Keempat, laptop sering overheat dan kipas berbunyi kencang meski hanya menjalankan tugas ringan.",
      "Kelima, sistem operasi atau software penting sudah tidak lagi mendapat update resmi karena spesifikasi hardware yang ketinggalan. Jika kamu mengalami tiga atau lebih tanda ini, kemungkinan besar sudah waktunya mempertimbangkan laptop baru."
    ],
    category: "Laptop",
    author: "Tim TokoKu",
    date: "15 Juli 2026",
    readTime: "4 menit baca",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80"
  },
  {
    slug: "panduan-memilih-drone-untuk-fotografi",
    title: "Panduan Memilih Drone untuk Fotografi dan Videografi",
    excerpt:
      "Tertarik terjun ke dunia aerial photography? Ini hal-hal yang perlu kamu perhatikan sebelum membeli drone pertama.",
    content: [
      "Drone kini bukan lagi barang mewah eksklusif, tapi sudah jadi alat yang cukup terjangkau untuk hobi fotografi dan videografi. Namun memilih drone yang tepat tetap butuh pertimbangan matang.",
      "Pertama, perhatikan kualitas kamera dan stabilizer (gimbal). Drone dengan gimbal 3-axis umumnya menghasilkan footage yang jauh lebih stabil dibanding gimbal 2-axis atau tanpa stabilizer sama sekali.",
      "Kedua, cek daya tahan baterai dan jarak kendali maksimum. Drone entry-level biasanya hanya bertahan 15-20 menit per baterai dengan jarak kendali terbatas, sementara drone kelas menengah bisa mencapai 30 menit lebih.",
      "Ketiga, pahami regulasi penerbangan drone di area kamu, termasuk batas ketinggian dan zona terlarang seperti bandara. Terakhir, pertimbangkan portabilitas — drone lipat lebih mudah dibawa bepergian dibanding drone dengan rangka tetap."
    ],
    category: "Drone",
    author: "Tim TokoKu",
    date: "2 Juli 2026",
    readTime: "5 menit baca",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=900&q=80"
  },
  {
    slug: "cara-mengenali-produk-elektronik-original",
    title: "Cara Mengenali Produk Elektronik Original vs KW",
    excerpt:
      "Marak produk elektronik tiruan beredar di pasaran. Kenali ciri-cirinya agar tidak tertipu saat berbelanja.",
    content: [
      "Belanja gadget secara online memang praktis, tapi risiko mendapat produk tiruan atau KW tetap ada jika tidak berhati-hati. Berikut cara mengenali produk elektronik original.",
      "Pertama, selalu beli dari toko atau distributor resmi yang terpercaya. Produk resmi biasanya dilengkapi kartu garansi, nomor seri yang bisa diverifikasi di situs resmi brand, dan kemasan dengan segel utuh.",
      "Kedua, perhatikan kualitas material dan finishing. Produk KW umumnya memiliki finishing yang kurang rapi, material terasa lebih ringan atau murahan, dan logo brand yang kurang presisi.",
      "Ketiga, waspadai harga yang jauh di bawah pasaran — ini seringkali jadi tanda paling jelas dari produk tiruan. Terakhir, cek ulasan dan rating penjual sebelum melakukan pembelian, terutama untuk produk dengan harga tinggi."
    ],
    category: "Tips Belanja",
    author: "Tim TokoKu",
    date: "20 Juni 2026",
    readTime: "4 menit baca",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80"
  }
]

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug)
}

export function getRelatedArticles(
  currentSlug: string,
  category: string,
  limit = 3
) {
  return articles
    .filter((a) => a.slug !== currentSlug && a.category === category)
    .concat(
      articles.filter((a) => a.slug !== currentSlug && a.category !== category)
    )
    .slice(0, limit)
}
