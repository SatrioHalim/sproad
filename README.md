# Sproad

Sproad adalah aplikasi manajemen proyek kanban-based yang dibangun dengan backend Go Fiber dan frontend React + Vite. Repositori ini berisi layanan API, antarmuka pengguna, dan dukungan Docker Compose untuk jalankan seluruh stack secara lokal.

## Struktur Proyek

- `back_end_server/` - Backend service menggunakan Go, Fiber, GORM, dan PostgreSQL.
- `front_end_client/` - Frontend aplikasi menggunakan React, Vite, dan Material UI.
- `docker-compose.yaml` - Definisi Docker Compose untuk API, frontend, PostgreSQL, dan pgAdmin.
- `servers.json` - Konfigurasi server untuk pgAdmin.

## Fitur Utama

- Autentikasi JWT
- Manajemen pengguna
- Pembuatan board kolaboratif
- List dan card yang bisa diatur
- Penugasan assignee ke kartu
- Attachment kartu
- PostgreSQL sebagai database
- Pengembangan lokal dengan Docker Compose

## Teknologi

- Go 1.25
- Fiber v3
- GORM
- PostgreSQL 15
- React 19
- Vite
- Material UI
- Docker dan Docker Compose

## Persyaratan

- Docker Engine
- Docker Compose
- Go (jika ingin jalankan backend tanpa Docker)
- Node.js dan npm/yarn (jika ingin jalankan frontend tanpa Docker)

## Cara Menjalankan dengan Docker

1. Pastikan Docker sudah berjalan.
2. Jalankan perintah berikut di root repository:

```bash
docker compose up --build
```

3. Akses aplikasi berikut:

- Backend API: `http://localhost:3030`
- Frontend: `http://localhost:5173`
- pgAdmin: `http://localhost:5050`

## Menjalankan Secara Lokal Tanpa Docker

### Backend

1. Masuk ke folder backend:

```bash
cd back_end_server
```

2. Install dependency Go:

```bash
go mod download
```

3. Jalankan server:

```bash
go run main.go
```

Backend akan berjalan di `http://localhost:3030`.

### Frontend

1. Masuk ke folder frontend:

```bash
cd front_end_client
```

2. Install dependency:

```bash
npm install
```

3. Jalankan development server:

```bash
npm run dev -- --host 0.0.0.0
```

Frontend akan berjalan di `http://localhost:5173`.

## Pengaturan Environment

Untuk pengembangan lokal, backend membaca variabel environment dari file `.env` di `back_end_server/`.

Contoh variabel yang umum digunakan:

```env
PORT=3030
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secret
DB_NAME=mydb
ENV=development
JWT_SECRET=your_jwt_secret
```

## Catatan

- Docker Compose sudah mengatur container PostgreSQL dan pgAdmin.
- `front_end_client` menggunakan environment default Vite untuk development.
- Pastikan port `3030`, `5173`, dan `5050` tidak digunakan oleh layanan lain.

