# Tokoku — Frontend

Frontend e-commerce dibuat dengan [Next.js](https://nextjs.org) (App Router) +
MUI (Material UI), terhubung ke backend Golang + MongoDB.

## Struktur penting

Frontend/
├── app/
│ ├── components/
│ │ ├── layout/ # Navbar, Footer
│ ├── context/
│ │ ├── AuthContext.tsx # state login/auth
│ │ └── CartContext.tsx # state keranjang belanja
│ ├── lib/
│ │ ├── products.ts # helper formatRupiah, tipe Product
│ │ ├── types.ts # definisi tipe Product
│ │ └── api.ts # fetch data produk dari backend Golang
│ └── products/
│ ├── page.tsx # halaman daftar produk
│ └── [id]/page.tsx # halaman detail produk

## Menjalankan secara lokal

### 1. Install dependency

```bash
npm install
```

### 2. Setup environment variable

Buat file `.env.local` di root folder `Frontend/`:

NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

Sesuaikan URL kalau backend Golang jalan di port/host lain.

### 3. Pastikan backend sudah jalan

Data produk (nama, harga, gambar, dll) diambil dari API Golang yang connect ke
MongoDB — lihat folder `Backend/` untuk cara menjalankannya. Backend harus
jalan di `http://localhost:8080` (atau sesuai `NEXT_PUBLIC_API_URL` di atas)
sebelum halaman produk bisa menampilkan data.

### 4. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Sumber data produk

Sebelumnya data produk berupa array statis di `app/lib/products.ts`. Sekarang
data diambil secara dinamis lewat `app/lib/api.ts` yang fetch ke endpoint:

- `GET {API_URL}/products` — daftar semua produk
- `GET {API_URL}/products/:id` — detail satu produk

Fungsi `formatRupiah` di `app/lib/products.ts` tetap dipakai untuk format harga,
tidak berubah.

## Deploy

Project ini di-deploy di [Vercel](https://vercel.com). Saat deploy, pastikan
environment variable `NEXT_PUBLIC_API_URL` diarahkan ke URL backend production
(bukan `localhost`), karena `localhost` hanya berlaku di komputer sendiri.

## Belajar lebih lanjut

- [Next.js Documentation](https://nextjs.org/docs)
- [MUI Documentation](https://mui.com/material-ui/getting-started/)
