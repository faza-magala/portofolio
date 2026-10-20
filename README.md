# Full-Stack Portfolio CMS (React + Hono + Turso + Cloudinary)

Aplikasi Developer Portfolio Full-Stack modern yang dilengkapi dengan Content Management System (CMS) mandiri dan dashboard terproteksi. Memungkinkan pengelolaan seluruh konten portofolio (Profil, Pengalaman, Pendidikan, Proyek, Sertifikasi, Layanan, Blog, Testimoni, dan Media Asset) secara langsung tanpa perlu menyunting kode sumber.

---

## Daftar Isi (Table of Contents)

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture](#3-architecture)
4. [Prerequisites](#4-prerequisites)
5. [Local Installation](#5-local-installation)
6. [Dependency Installation](#6-dependency-installation)
7. [Environment Variable Setup](#7-environment-variable-setup)
8. [Turso Database Creation](#8-turso-database-creation)
9. [Database Migration Commands](#9-database-migration-commands)
10. [Initial Administrator Creation](#10-initial-administrator-creation)
11. [Cloudinary Configuration](#11-cloudinary-configuration)
12. [Development Commands](#12-development-commands)
13. [Testing & Quality Assurance](#13-testing--quality-assurance)
14. [Production Build](#14-production-build)
15. [Vercel Deployment Guide](#15-vercel-deployment-guide)
16. [Troubleshooting Guide](#16-troubleshooting-guide)
17. [Security Considerations](#17-security-considerations)
18. [Backup and Recovery Recommendations](#18-backup-and-recovery-recommendations)

---

## 1. Project Overview

Website portofolio ini dibangun dengan pendekatan full-stack produksi nyata:
- **Public Portfolio**: Desain modern, ringan, dan elegan dengan palet warna biru muda (`#3898EC`), putih (`#FFFFFF`), slate, dan dark navy (`#172B4D`). Memenuhi standar aksesibilitas WCAG 2.2 AA dan mendukung `prefers-reduced-motion`.
- **Protected Admin CMS (`/admin`)**: Dashboard terproteksi dengan session server-side, validasi skema Zod ganda (klien dan server), operasi CRUD penuh untuk 12+ modul, serta media manager terintegrasi.
- **RESTful API (`/api/v1`)**: Backend berbasis framework Hono yang cepat dan ringan, siap dijalankan di server Node.js lokal maupun Serverless Function Vercel.
- **Database Terdistribusi**: Menggunakan Turso (LibSQL) untuk performa latensi rendah secara global dengan fallback file SQLite lokal untuk pengembangan tanpa dependensi cloud.
- **Secure Cloudinary Media**: Manajemen unggahan media dengan backend upload signature tanpa pernah mengekspos secret credentials ke browser.

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18 (Functional components & hooks)
- **Language**: TypeScript (Strict mode enabled)
- **Build Tool**: Vite 6 (HMR super cepat & Rollup chunk splitting)
- **Styling**: Tailwind CSS 3.4 & PostCSS
- **Routing**: React Router DOM v7
- **Server State Management**: TanStack Query v5 (React Query)
- **Form Handling**: React Hook Form v7
- **Validation**: Zod v4 (Skema terbagi antara klien dan server)
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)

### Backend & API
- **Framework**: Hono v4 (Web framework modular untuk edge & serverless)
- **Runtime**: Node.js v18+ & Vercel Serverless Function adapter (`hono/vercel`)
- **Architecture**: RESTful API `/api/v1` dengan pemisahan Routes, Repositories, Services, dan Middleware
- **Database ORM**: Drizzle ORM v0.45 & Drizzle Kit

### Database & Storage
- **Database**: Turso (Hosted LibSQL / SQLite) via `@libsql/client`
- **Media Storage**: Cloudinary Official Node.js SDK v2

### Authentication & Security
- **Session Management**: Server-side hashed sessions disimpan di tabel `sessions` Turso/SQLite
- **Cookies**: `HttpOnly`, `SameSite=Lax`, `Secure` (di production), `Path=/`
- **Password Hashing**: Cryptographic `scrypt` dengan random salt dan timing-safe equality check (`crypto.timingSafeEqual`)
- **Proteksi API**: Sliding window rate limiting, CORS ketat, Zod request body validation, dan HTTP security headers (CSP, HSTS, X-Content-Type-Options)

---

## 3. Architecture

Aplikasi ini menerapkan arsitektur monorepo yang rapi dan terisolasi:

```
portfolio-cms/
├── api/
│   └── index.ts                 # Entry point Vercel Serverless Function (handle(app))
├── server/
│   └── src/
│       ├── db/
│       │   ├── schema.ts        # Definisi tabel Drizzle ORM SQLite/Turso
│       │   ├── index.ts         # Inisialisasi client LibSQL & Drizzle instance
│       │   ├── migrate.ts       # Script eksekusi migrasi database
│       │   └── seed.ts          # Script inisialisasi akun admin & data awal
│       ├── middleware/
│       │   ├── auth.middleware.ts       # Pemeriksaan session cookie/bearer
│       │   └── rateLimit.middleware.ts  # Pembatas laju request (anti brute-force)
│       ├── repositories/
│       │   ├── auth.repository.ts       # Query autentikasi & session database
│       │   └── portfolio.repository.ts  # Query CRUD seluruh modul portofolio
│       ├── routes/
│       │   ├── admin.routes.ts          # Endpoint terproteksi CMS (/api/v1/admin/*)
│       │   ├── auth.routes.ts           # Endpoint login, logout, session, password
│       │   └── public.routes.ts         # Endpoint publik data portofolio (/api/v1/public/*)
│       ├── services/
│       │   └── cloudinary.service.ts    # Layanan upload signature & penghapusan asset
│       ├── utils/
│       │   └── crypto.ts                # scrypt hashing, random token, timingSafeEqual
│       ├── app.ts                       # Konfigurasi aplikasi Hono, CORS, & sitemap.xml
│       └── index.ts                     # Entry point server mandiri lokal (port 3001)
├── shared/
│   └── src/
│       └── schemas/
│           └── index.ts         # Skema validasi Zod bersama (klien & server)
├── src/
│   ├── components/
│   │   ├── layout/              # Navbar, Footer
│   │   ├── sections/            # Hero, About, Skills, Experience, Education, Projects,
│   │   │                        # Services, Certifications, Testimonials, Learning, Contact
│   │   └── ui/                  # Button, Badge, Card, Container, SectionHeading
│   ├── features/
│   │   ├── admin/               # AdminLayout, Dashboard, & 12 Modul Manager CRUD
│   │   ├── auth/                # LoginPage, ProtectedRoute
│   │   ├── blog/                # BlogListPage, BlogPostPage (Markdown safe renderer)
│   │   └── projects/            # ProjectDetailPage
│   ├── hooks/                   # usePortfolioData, useAdminData, useAuth, useScrollSpy
│   ├── lib/                     # API client wrapper, URL validators
│   ├── pages/                   # HomePage, NotFoundPage
│   ├── App.tsx                  # Client routing & TanStack Query Provider
│   └── main.tsx                 # React DOM root entry
├── drizzle/                     # File migrasi SQL version-controlled
├── .env.example                 # Template environment variables
├── vercel.json                  # Routing SPA & security headers Vercel
└── package.json
```

---

## 4. Prerequisites

Pastikan perangkat Anda telah terpasang:
- **Node.js**: Versi `>= 18.0.0` (Disarankan LTS Node.js v20 atau v22)
- **npm**: Versi `>= 9.0.0`
- **Turso CLI** *(Opsional untuk production)*: Untuk membuat database cloud Turso
- **Git**: Untuk manajemen repositori

---

## 5. Local Installation

Langkah-langkah mengunduh dan memasang proyek secara lokal:

```bash
# 1. Clone repositori ke komputer Anda
git clone https://github.com/username/portfolio.git

# 2. Masuk ke direktori proyek
cd portfolio
```

---

## 6. Dependency Installation

Pasang seluruh dependensi frontend dan backend menggunakan npm:

```bash
npm install
```

---

## 7. Environment Variable Setup

Salin file `.env.example` menjadi `.env`:

```bash
# Linux / macOS / Git Bash:
cp .env.example .env

# Windows (Command Prompt):
copy .env.example .env

# Windows (PowerShell):
Copy-Item .env.example .env
```

Buka file `.env` dan sesuaikan nilainya:
- Untuk pengembangan lokal standar, default `DATABASE_URL=file:local.db` sudah langsung bekerja tanpa memerlukan kredensial cloud.
- Atur `SESSION_SECRET` dengan string acak yang aman (minimal 32 karakter).

---

## 8. Turso Database Creation

Untuk menggunakan database cloud Turso saat deployment production:

1. Pasang Turso CLI jika belum terpasang:
   ```bash
   # Windows (via PowerShell / Scoop atau download executable):
   # Linux / macOS:
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

2. Login ke akun Turso Anda:
   ```bash
   turso auth login
   ```

3. Buat database baru untuk portofolio:
   ```bash
   turso db create portfolio-db
   ```

4. Dapatkan URL database:
   ```bash
   turso db show portfolio-db --url
   # Contoh output: libsql://portfolio-db-username.turso.io
   ```

5. Buat authentication token:
   ```bash
   turso db tokens create portfolio-db
   # Contoh output: eyJhbGciOi... (string panjang)
   ```

6. Masukkan kedua nilai tersebut ke file `.env` Anda:
   ```env
   DATABASE_URL=libsql://portfolio-db-username.turso.io
   DATABASE_AUTH_TOKEN=eyJhbGciOi...
   ```

---

## 9. Database Migration Commands

Jalankan perintah berikut untuk mengelola skema database:

```bash
# 1. Generate file migrasi SQL baru jika ada perubahan di server/src/db/schema.ts:
npm run db:generate

# 2. Eksekusi file migrasi ke database (lokal SQLite atau remote Turso):
npm run db:migrate
```

Perintah migrasi akan membaca file di folder `drizzle/` dan menerapkannya secara aman ke database Anda.

---

## 10. Initial Administrator Creation

Setelah database terinisialisasi, jalankan script seed untuk membuat akun administrator default dan mengisi konten percontohan yang realistis:

```bash
npm run db:seed
```

Secara default, kredensial administrator awal adalah:
- **Email**: `admin@example.com`
- **Password**: `Admin12345!`
- **URL Login**: `http://localhost:5173/admin/login`

> **PENTING**: Segera ganti password Anda setelah pertama kali login melalui menu CMS Profile / Change Password demi keamanan production!

---

## 11. Cloudinary Configuration

Aplikasi ini mendukung penyimpanan media berbasis Cloudinary:

1. Buat akun gratis di [Cloudinary](https://cloudinary.com/).
2. Buka dashboard Cloudinary Console dan salin:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Tambahkan ke file `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Di panel admin (`/admin/media`), Anda dapat mengunggah gambar langsung. Backend akan membuat tanda tangan digital (signed signature) sehingga browser mengunggah langsung ke Cloudinary tanpa perlu mengekspos `CLOUDINARY_API_SECRET`.

---

## 12. Development Commands

Jalankan aplikasi dalam mode pengembangan lokal:

### Menjalankan Backend API:
```bash
npm run dev:api
```
Server API akan berjalan di `http://localhost:3001` dengan auto-reload (watch mode).

### Menjalankan Frontend Vite:
Buka terminal kedua dan jalankan:
```bash
npm run dev
```
Aplikasi frontend akan berjalan di `http://localhost:5173`. Frontend telah dikonfigurasi untuk mem-proxy request `/api` ke port 3001 secara otomatis.

---

## 13. Testing & Quality Assurance

Proyek ini telah dikonfigurasi dengan pemeriksaan kualitas kode yang ketat:

```bash
# 1. Pemeriksaan tipe data TypeScript (Strict Mode, 0 error):
npm run typecheck

# 2. Pemeriksaan linting ESLint (React hooks, TypeScript linting, 0 warning):
npm run lint
```

Kedua perintah ini harus keluar dengan **exit code 0** sebelum Anda melakukan commit atau deployment ke production.

---

## 14. Production Build

Untuk memvalidasi dan mem-bundle aplikasi untuk production:

```bash
npm run build
```

Perintah ini akan:
1. Menjalankan kompilasi TypeScript (`tsc -b`).
2. Menghasilkan bundle statis yang teroptimasi di folder `dist/`.
3. Memecah vendor chunks (React, Lucide, dll.) untuk caching browser yang optimal.

Anda dapat menguji hasil build secara lokal dengan:
```bash
npm run preview
```

---

## 15. Vercel Deployment Guide

Aplikasi ini telah dirancang untuk siap di-deploy ke **Vercel** dengan arsitektur Serverless.

### Langkah-langkah Deployment:

1. **Push kode Anda ke GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete fullstack portfolio cms"
   git push origin main
   ```

2. **Impor Proyek ke Vercel**:
   - Buka [Vercel Dashboard](https://vercel.com/dashboard).
   - Klik **"Add New Project"** dan pilih repositori GitHub Anda.
   - Framework Preset: Pilih **Vite**.
   - Build Command: Biarkan default (`npm run build`).
   - Output Directory: Biarkan default (`dist`).

3. **Konfigurasi Environment Variables di Vercel**:
   Buka bagian **Environment Variables** di Vercel dan tambahkan variabel berikut:
   | Variable | Value | Keterangan |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Wajib |
   | `DATABASE_URL` | `libsql://your-db.turso.io` | URL database Turso Anda |
   | `DATABASE_AUTH_TOKEN` | `eyJhb...` | Token database Turso |
   | `SESSION_SECRET` | `string_acak_panjang_minimal_32_karakter` | Kunci sesi server |
   | `APP_URL` | `https://your-domain.vercel.app` | URL domain Vercel Anda |
   | `FRONTEND_URL` | `https://your-domain.vercel.app` | Sama dengan APP_URL |
   | `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | Dari dashboard Cloudinary |
   | `CLOUDINARY_API_KEY` | `your_api_key` | Dari dashboard Cloudinary |
   | `CLOUDINARY_API_SECRET` | `your_api_secret` | Dari dashboard Cloudinary |

4. **Migrasi & Seed Database Production**:
   Sebelum atau sesudah deployment pertama, jalankan migrasi dan seed ke database Turso dari komputer lokal Anda:
   ```bash
   # Pastikan .env lokal Anda mengarah ke DATABASE_URL dan DATABASE_AUTH_TOKEN Turso:
   npm run db:migrate
   npm run db:seed
   ```

5. **Selesai**:
   Vercel akan mendeploy frontend Vite ke Edge Network dan backend Hono ke Vercel Serverless Function melalui `api/index.ts`. Seluruh rute `/api/*` secara otomatis diarahkan ke backend sesuai konfigurasi `vercel.json`.

---

## 16. Troubleshooting Guide

- **Error: `npm : File ... npm.ps1 cannot be loaded because running scripts is disabled` (Windows PowerShell)**:
  Gunakan `cmd /c "npm run ..."` atau ubah Execution Policy PowerShell dengan izin administrator:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```

- **Error: `Unauthorized: Session missing` saat mengakses API admin**:
  Pastikan browser Anda mengizinkan cookie pihak pertama. Jika melakukan testing dari domain yang berbeda, pastikan `FRONTEND_URL` di server cocok persis dengan origin browser Anda agar cookie credentials diizinkan.

- **Error: `Cloudinary credentials are not configured`**:
  Fitur upload media memerlukan `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, dan `CLOUDINARY_API_SECRET`. Pastikan ketiga variabel ini terisi di file `.env` atau Vercel Environment Variables. Jika belum ada, Anda tetap dapat memasukkan URL gambar eksternal secara manual.

- **Formulir Kontak Gagal Terkirim (`Too many requests`)**:
  Endpoint kontak dilindungi oleh middleware *rate limiting* (maksimal 5 pesan per 10 menit per IP) untuk mencegah spam bot. Tunggu beberapa menit sebelum mencoba kembali.

---

## 17. Security Considerations

Aplikasi ini menerapkan standar keamanan enterprise:
1. **Penyimpanan Password**: Menggunakan algoritma derivasi kunci `scrypt` dengan random salt 16-byte unik per pengguna. Verifikasi password menggunakan `crypto.timingSafeEqual` untuk mencegah serangan analisis waktu (*timing attack*).
2. **Session Hashing**: Token sesi yang dikirim ke browser di-hash dengan SHA-256 sebelum disimpan di database. Jika terjadi kebocoran database, token sesi yang valid tidak dapat direkonstruksi.
3. **Cookie Hardening**: Cookie sesi disetel dengan flag `HttpOnly` (tidak dapat dibaca oleh script JavaScript peramban, kebal terhadap pencurian via XSS), `SameSite=Lax`, dan `Secure` di lingkungan production.
4. **Perlindungan Injeksi**: Semua query database dieksekusi melalui parameterized queries menggunakan Drizzle ORM, sehingga kebal terhadap SQL Injection.
5. **Sanitasi Konten & XSS**: Artikel blog diformat menggunakan parser markdown yang aman tanpa parsing HTML mentah sembarangan. Link eksternal divalidasi dengan protokol aman (`http`, `https`, `mailto`) dan disetel dengan `rel="noopener noreferrer"`.
6. **Proteksi Spam**: Formulir kontak dilengkapi dengan *honeypot field* (`website`) yang tak terlihat oleh pengguna biasa namun akan diisi oleh spam bot otomatis. Pesan dari bot akan diabaikan secara senyap tanpa membocorkan logika internal.

---

## 18. Backup and Recovery Recommendations

1. **Backup Database Turso**:
   Turso menyediakan fitur point-in-time recovery dan dump database:
   ```bash
   # Membuat salinan dump SQL dari Turso ke file lokal:
   turso db dump portfolio-db > backup_$(date +%Y%m%d).sql
   ```
2. **Restorasi Database**:
   ```bash
   # Memulihkan dump database ke instance baru:
   turso db create portfolio-db-restored --from-dump backup_20261019.sql
   ```
3. **Backup Media Asset**:
   Semua asset gambar disimpan dengan aman di cloud storage Cloudinary. Disarankan untuk mengaktifkan Cloudinary Backup bucket atau mengunduh salinan berkala dari media library Anda.

---

*Dikembangkan dengan standar rekayasa perangkat lunak modern untuk performa tinggi, keamanan maksimal, dan kemudahan pengoperasian mandiri.*
