# E-Commerce Golang API

Backend Golang sederhana yang connect ke MongoDB Atlas (database `e_commerce`),
dibuat dengan Gin + MongoDB Go Driver resmi.

## Struktur folder

Backend/
├── cmd/
│ ├── server/main.go # entry point aplikasi (jalankan API)
│ └── seed/main.go # script untuk isi data awal ke MongoDB
├── internal/
│ ├── config/ # load .env
│ ├── database/ # koneksi MongoDB
│ ├── models/ # struct data (contoh: Product)
│ ├── repository/ # query ke MongoDB (CRUD)
│ ├── handler/ # HTTP handler (route Gin)
│ └── response/ # format response standar (success/error)
├── .env # konfigurasi (JANGAN di-commit ke git)
├── .gitignore
└── go.mod

## Cara menjalankan

1. Pastikan Go sudah terinstall (versi 1.22 ke atas): `go version`
2. Masuk ke folder project:

```bash
   cd Backend
```

3. Download dependency (butuh koneksi internet ke proxy.golang.org):

```bash
   go mod tidy
```

4. Cek isi file `.env` — pastikan `MONGO_URI` dan `MONGO_DB_NAME=e_commerce` sudah benar.
5. Jalankan server:

```bash
   go run cmd/server/main.go
```

6. Server jalan di `http://localhost:8080`. Cek koneksi:

```bash
   curl http://localhost:8080/health
```

## Mengisi data awal (seed)

Collection `products` di MongoDB baru otomatis terbentuk setelah ada dokumen
pertama di-insert. Untuk mengisi data contoh (10 produk), jalankan (server API
tidak perlu dimatikan, ini script terpisah):

```bash
go run cmd/seed/main.go
```

Script ini akan **menghapus semua data lama** di collection `products` terlebih
dahulu, lalu insert ulang data contoh. Jalankan ini kapan pun perlu reset data
ke kondisi awal.

## Format response

Semua endpoint mengembalikan struktur JSON yang konsisten:

**Sukses:**

```json
{
  "success": true,
  "message": "Berhasil mengambil data produk",
  "data": [
    /* ... */
  ]
}
```

**Error:**

```json
{
  "success": false,
  "message": "Produk tidak ditemukan",
  "error": "mongo: no documents in result"
}
```

| Status Code | Kapan dipakai                             |
| ----------- | ----------------------------------------- |
| 200         | Request berhasil (GET, PUT, DELETE)       |
| 201         | Data baru berhasil dibuat (POST)          |
| 400         | Body request tidak valid                  |
| 404         | Data (misal produk by ID) tidak ditemukan |
| 500         | Error di server / database                |

## Endpoint (collection `products`)

| Method | Endpoint             | Keterangan         |
| ------ | -------------------- | ------------------ |
| GET    | /api/v1/products     | Ambil semua produk |
| GET    | /api/v1/products/:id | Ambil produk by ID |
| POST   | /api/v1/products     | Tambah produk baru |
| PUT    | /api/v1/products/:id | Update produk      |
| DELETE | /api/v1/products/:id | Hapus produk       |

Struktur data `Product`:

```json
{
  "id": "671f2a...",
  "name": "Polaroid OneStep 2",
  "category": "Kamera",
  "price": 1850000,
  "image": "https://images.unsplash.com/photo-...",
  "description": "Kamera instan dengan lensa autofocus...",
  "stock": 12,
  "rating": 4.7
}
```

Contoh body POST/PUT:

```json
{
  "name": "Kabel HDMI 2m",
  "category": "Aksesori",
  "price": 45000,
  "image": "https://example.com/kabel-hdmi.jpg",
  "description": "Kabel HDMI 2 meter, mendukung resolusi 4K.",
  "stock": 20,
  "rating": 4.2
}
```

## Menambah collection lain (mis. `ms_barang`, `mitras`, dll)

Pola yang dipakai di sini reusable. Untuk tiap collection baru, cukup buat 3 file
mengikuti contoh `product`:

1. `internal/models/<nama>.go` — definisikan struct sesuai field di collection tersebut
2. `internal/repository/<nama>_repository.go` — copy dari `product_repository.go`, ganti nama collection & struct
3. `internal/handler/<nama>_handler.go` — copy dari `product_handler.go`, ganti nama, pakai helper `internal/response` untuk konsistensi format response

Lalu daftarkan repository & handler barunya di `cmd/server/main.go`.

## Integrasi dengan Frontend (Next.js)

Frontend fetch data lewat `app/lib/api.ts`, dengan base URL diatur di
`Frontend/.env.local`:
