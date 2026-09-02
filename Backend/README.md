# E-Commerce Golang API

Backend Golang sederhana yang connect ke MongoDB Atlas (database `e_commerce`),
dibuat dengan Gin + MongoDB Go Driver resmi.

## Struktur folder

```
ecommerce-golang/
├── cmd/server/main.go        # entry point aplikasi
├── internal/
│   ├── config/                # load .env
│   ├── database/               # koneksi MongoDB
│   ├── models/                 # struct data (contoh: Product)
│   ├── repository/             # query ke MongoDB (CRUD)
│   └── handler/                 # HTTP handler (route Gin)
├── .env                        # konfigurasi (JANGAN di-commit ke git)
├── .gitignore
└── go.mod
```

## Cara menjalankan

1. Pastikan Go sudah terinstall (versi 1.22 ke atas): `go version`
2. Masuk ke folder project:
   ```bash
   cd ecommerce-golang
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

## Endpoint contoh (collection `products`)

| Method | Endpoint                 | Keterangan          |
|--------|---------------------------|----------------------|
| GET    | /api/v1/products          | Ambil semua produk   |
| GET    | /api/v1/products/:id      | Ambil produk by ID   |
| POST   | /api/v1/products          | Tambah produk baru   |
| PUT    | /api/v1/products/:id      | Update produk        |
| DELETE | /api/v1/products/:id      | Hapus produk         |

Contoh body POST/PUT:
```json
{
  "name": "Kabel HDMI 2m",
  "price": 45000,
  "stock": 20
}
```

## Menambah collection lain (mis. `ms_barang`, `mitras`, dll)

Pola yang dipakai di sini reusable. Untuk tiap collection baru, cukup buat 3 file
mengikuti contoh `product`:
1. `internal/models/<nama>.go` — definisikan struct sesuai field di collection tersebut
2. `internal/repository/<nama>_repository.go` — copy dari `product_repository.go`, ganti nama collection & struct
3. `internal/handler/<nama>_handler.go` — copy dari `product_handler.go`, ganti nama

Lalu daftarkan repository & handler barunya di `cmd/server/main.go`.

## Catatan keamanan

- Kredensial MongoDB yang kamu share sebelumnya (`root:Frontend2026...`) sudah
  pernah terekspos dalam percakapan ini. Sebaiknya **rotate password** database
  user tersebut lewat MongoDB Atlas → Database Access, lalu update `.env`.
- Jangan commit file `.env` ke git — sudah dimasukkan ke `.gitignore`.
