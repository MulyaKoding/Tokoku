# TokoKu

Marketplace elektronik dan gadget. Repo ini berisi backend (Go), frontend (Next.js), dan stack monitoring log (Grafana + Loki + Alloy) yang semuanya dijalankan dengan Docker Compose.

## Tech stack

| Bagian         | Teknologi                                      |
| -------------- | ---------------------------------------------- |
| Backend        | Go (`Backend/`)                                |
| Frontend       | Next.js (`Frontend/`)                          |
| Database       | Lihat `Backend/.env` (database `e_commerce`)   |
| Monitoring log | Grafana, Loki, Alloy                           |
| Deployment     | Docker Compose, GitHub Actions (SSH ke server) |

## Struktur project

```
tokoku/
├── docker-compose.yml            # backend, frontend, loki, alloy, grafana
├── .env                          # kredensial Grafana (jangan di-commit)
├── .github/workflows/deploy.yml  # auto deploy
├── monitoring/
│   ├── alloy-config.alloy        # pengumpul log container -> Loki
│   └── grafana/provisioning/datasources/loki.yml
├── Backend/
│   ├── Dockerfile
│   ├── .env                      # konfigurasi backend (jangan di-commit)
│   ├── cmd/server/main.go        # entry point API
│   ├── cmd/seed/                 # seeder data
│   └── internal/
└── Frontend/
    ├── Dockerfile
    └── next.config.ts            # output: "standalone"
```

## Prasyarat

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) atau Docker Engine + Compose plugin (Linux)
- Di Windows: virtualisasi aktif (BIOS dan fitur Windows) dan WSL 2
- Git

Untuk development tanpa Docker (opsional): Go 1.25+ dan Node.js 20+.

## Konfigurasi

### 1. Backend: `Backend/.env`

Buat file `Backend/.env` berisi konfigurasi backend (koneksi database, port, secret, dan lain-lain). File ini tidak ikut Git.

Catatan: jika database berjalan di komputer host (bukan di Docker), jangan pakai `localhost` sebagai host database. Di dalam container, `localhost` menunjuk ke container itu sendiri. Pakai `host.docker.internal` di Windows/Mac.

### 2. Root: `.env`

Buat file `.env` di root project (sejajar `docker-compose.yml`):

```env
GRAFANA_USER=admin
GRAFANA_PASSWORD=isi-password-yang-kuat
NEXT_PUBLIC_API_URL=http://localhost:8080
```

- `GRAFANA_PASSWORD` wajib diisi dengan password yang kuat (minimal 12 karakter, campuran huruf besar, kecil, angka, dan simbol).
- `NEXT_PUBLIC_API_URL` adalah URL backend yang dipakai browser. Nilainya dimasukkan saat **build** frontend, jadi ubah lalu build ulang jika URL berubah. Di server, isi dengan URL publik backend.

Pastikan `.env` masuk `.gitignore`:

```
.env
*.exe
```

## Menjalankan

Dari folder root project:

```bash
docker compose up -d --build
```

Build pertama membutuhkan waktu beberapa menit karena mengunduh image dan dependency. Cek statusnya:

```bash
docker compose ps
```

Semua service harus berstatus `Up`.

| Service  | URL                                    |
| -------- | -------------------------------------- |
| Frontend | http://localhost:3000                  |
| Backend  | http://localhost:8080 (cek: `/health`) |
| Grafana  | http://localhost:3001                  |

Loki hanya dapat diakses dari dalam network Docker (port 3100, tidak dibuka ke host).

### Perintah berguna

```bash
docker compose logs -f backend      # log backend (ganti nama service sesuai kebutuhan)
docker compose restart backend      # restart satu service
docker compose up -d --build        # build ulang setelah ada perubahan kode
docker compose stop                 # hentikan semua container (data tetap ada)
docker compose start                # nyalakan lagi
docker compose down                 # hapus container dan network (volume tetap)
```

> **Jangan** memakai `docker compose down -v` kecuali ingin menghapus data Grafana dan log Loki.

Container memakai `restart: unless-stopped`, jadi akan menyala otomatis saat Docker/komputer dinyalakan ulang. Gunakan `docker compose stop` jika ingin mematikannya.

## Monitoring log dengan Grafana

Alur log:

```
container backend/frontend -> stdout/stderr -> Alloy -> Loki -> Grafana
```

Langkah melihat log:

1. Buka http://localhost:3001 dan login dengan `GRAFANA_USER` / `GRAFANA_PASSWORD`.
2. Buka menu **Explore**, pilih data source **Loki**.
3. Pindah ke mode **Code**, masukkan query, lalu klik **Run query**.

Contoh query:

```logql
{service="backend"}
{service="frontend"}
{service=~"backend|frontend"} |= "error"
sum(count_over_time({service="backend"} |= "error" [5m]))
```

Label `service` diambil otomatis dari nama service di `docker-compose.yml`.

### Mengganti password Grafana yang sudah terlanjur dibuat

Grafana hanya membaca `GRAFANA_PASSWORD` saat pertama kali dibuat. Untuk menggantinya setelah itu:

```bash
docker compose exec grafana grafana cli admin reset-admin-password "PASSWORD_BARU"
```

### Catatan penting soal log

- Aplikasi harus menulis log ke **stdout/stderr**, bukan hanya ke file. Log dari file tidak ditangkap Alloy.
- Jika `{service="backend"}` kosong padahal backend berjalan, cek `docker compose logs backend`. Jika kosong juga, berarti aplikasi tidak mencetak log (misalnya logger request belum dipasang).
- Untuk log yang mudah difilter (level, endpoint, dan sebagainya), gunakan format JSON, misalnya `slog.NewJSONHandler(os.Stdout, nil)`.

## Auto deployment (GitHub Actions)

Workflow `.github/workflows/deploy.yml` men-deploy otomatis setiap ada push ke branch utama dengan cara SSH ke server, `git pull`, lalu `docker compose up -d --build`.

### Persiapan server (sekali saja)

Server Linux (VPS) dengan Docker dan Docker Compose terpasang:

```bash
git clone https://github.com/MulyaKoding/Tokoku.git /opt/tokoku
cd /opt/tokoku
# buat Backend/.env dan .env (isi sesuai kebutuhan produksi)
docker compose up -d --build
```

Gunakan password Grafana yang berbeda dari yang dipakai saat development, dan isi `NEXT_PUBLIC_API_URL` dengan URL publik backend.

### Secrets di GitHub

Repository -> Settings -> Secrets and variables -> Actions, tambahkan:

| Secret            | Isi                                   |
| ----------------- | ------------------------------------- |
| `SERVER_HOST`     | IP atau domain server                 |
| `SERVER_USER`     | User SSH di server                    |
| `SSH_PRIVATE_KEY` | Private key untuk login SSH ke server |

Pastikan nama branch di `deploy.yml` (`branches: [...]`) sama dengan branch utama repo kamu.

## Keamanan

- Jangan commit `.env` (root maupun `Backend/`) dan file `*.exe`.
- Jangan pakai password default. Ganti password Grafana dengan yang kuat.
- Di produksi, jangan expose port Grafana (3001) langsung ke internet. Pasang reverse proxy (Caddy/Nginx) dengan HTTPS di depannya, atau batasi akses lewat firewall.
- Batasi port backend/frontend lewat reverse proxy dan firewall sesuai kebutuhan.

## Troubleshooting

| Masalah                                                  | Penyebab dan solusi                                                                                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `500 Internal Server Error ... dockerDesktopLinuxEngine` | Engine Docker Desktop belum jalan. Buka Docker Desktop, tunggu **Engine running**, lalu ulangi.                                                  |
| "Virtualization support not detected"                    | Aktifkan virtualisasi di BIOS, fitur Windows _Virtual Machine Platform_ dan _WSL_, lalu restart Windows. Update Docker Desktop ke versi terbaru. |
| Build backend gagal: `go.mod requires go >= ...`         | Versi image Go lebih lama dari `go.mod`. Samakan versi `golang:` di `Backend/Dockerfile` dengan versi di `go.mod`.                               |
| Build frontend gagal di `npm ci`                         | Pastikan `Frontend/package-lock.json` ada. Jika belum, jalankan `npm install` di folder `Frontend`.                                              |
| Build frontend gagal di `COPY .next/standalone`          | Pastikan `output: "standalone"` ada di `Frontend/next.config.ts`.                                                                                |
| Backend berhenti atau gagal konek database               | Cek `docker compose logs backend`. Ganti host database dari `localhost` ke `host.docker.internal` jika database ada di komputer host.            |
| Frontend tidak bisa memanggil backend                    | Cek `NEXT_PUBLIC_API_URL`. Nilainya di-bake saat build, jadi build ulang frontend setelah mengubahnya.                                           |
| Port sudah dipakai (`port is already allocated`)         | Hentikan proses lain di port 3000/3001/8080 (misalnya `npm run dev` atau `server.exe`).                                                          |
| Log tidak muncul di Grafana                              | Buat trafik dulu, ubah rentang waktu, lalu cek `docker compose logs alloy` dan `docker compose logs backend`.                                    |

## Development tanpa Docker (opsional)

```bash
# Backend
cd Backend
go run ./cmd/server

# Frontend (terminal lain)
cd Frontend
npm install
npm run dev
```

## Lisensi

Tentukan lisensi project di sini.
