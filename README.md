# AkuCare (Aku Anak Kampung) — Inclusive Health & Well-being Platform

> **Logicodix Hackathon 2026 Submission**  
> **Kategori:** Web Application  
> **Tema:** Inclusive Health & Well-being  
> **Nama Tim:** Aku Anak Kampung Team  

---

## 1. Tentang Produk & Latar Belakang

### Masalah
Penyandang disabilitas (tunanetra, tunarungu, dan buta warna) seringkali menghadapi hambatan besar saat mengakses layanan kesehatan digital:
- **Aksesibilitas Terabaikan:** Sebagian besar aplikasi kesehatan tidak memiliki label ARIA, navigasi sulit dibaca oleh screen reader, dan informasi penting hanya disampaikan melalui satu modalitas (misalnya visual saja atau suara saja).
- **Hambatan pada Situasi Darurat:** Pada kondisi gawat darurat, pengguna tunanetra kesulitan menavigasi peta atau membaca tombol, sementara pengguna tunarungu terhambat jika panggilan telepon adalah satu-satunya kanal bantuan.
- **Keterbatasan Skrining & Konsultasi:** Akses terhadap edukasi dan konsultasi kesehatan mental masih terbatas karena stigma sosial dan jarak fisik ke fasilitas medis terdekat.

### Solusi: AkuCare
**AkuCare** hadir sebagai solusi platform kesehatan inklusif yang dirancang sejak awal (*accessibility-by-design*) agar dapat digunakan secara mandiri oleh semua kalangan masyarakat:
- **Talkback & Voice Guidance:** Fitur pembaca layar bawaan berbasis Web Speech API yang membacakan navigasi, teks, dan status antarmuka secara otomatis dengan double-tap confirmation dan highlight visual berfokus tinggi.
- **Multimodal Feedback (Teks, Suara & Getaran):** Dukungan umpan balik getaran (*vibration*) dan notifikasi visual kontras tinggi untuk kenyamanan tunarungu dan tunanetra.
- **Layanan Terintegrasi:** Menghubungkan informasi kesehatan terkurasi, konsultasi dokter daring, skrining kesehatan mental, dan tombol darurat cepat (SOS) dalam satu aplikasi web adaptif.

---

## 2. Fitur Utama

1. **Aksesibilitas Bawaan (Talkback & Focus Mode):**
   - Mode suara pintar (*Text-to-Speech*) berbahasa Indonesia menggunakan Web Speech API.
   - Pemandu sentuhan interaktif: sentuhan pertama menyorot elemen dengan outline kontras kuning (`#facc15`), sentuhan kedua mengeksekusi aksi.
   - Pilihan preferensi tampilan adaptif (ukuran teks, kontras, mode buta warna).

2. **Konsultasi Dokter Daring:**
   - Menampilkan daftar dokter spesialis yang tersedia langsung dari basis data Supabase (`doctors`).
   - Panduan audio otomatis saat memilih dokter dan inisiasi sesi pesan konsultasi langsung.

3. **Autentikasi & Manajemen Pengguna (Supabase Auth):**
   - Pendaftaran dan masuk akun aman dengan Email & Password, Username (via RPC `get_email_by_username`), serta Google OAuth.
   - Fitur pemulihan kata sandi (*Forgot / Reset Password*) otomatis terintegrasi dengan session listener.
   - Penyimpanan data profil dan persetujuan pemrosesan data pribadi secara aman.

4. **Bantuan & Simulasi Darurat (SOS Emergency):**
   - Tombol darurat cepat melayang (*floating SOS button*).
   - Akses panggilan cepat ke nomor darurat nasional (119 dan 112).
   - Fitur simulasi penjemputan ambulans terdekat.

5. **Edukasi & Skrining Kesehatan Mental:**
   - Antarmuka ramah psikologis dengan palet warna menenangkan untuk tes kesehatan mental dan pemantauan kondisi pengguna.

---

## 3. Arsitektur Sistem & Tech Stack

Aplikasi menggunakan arsitektur **Vite Single Page Application (SPA)** yang dihubungkan langsung ke layanan cloud **Supabase**:

- **Frontend Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool:** [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom Accessible Design System Tokens (DM Sans & Manrope typography)
- **Aksesibilitas:** HTML5 Semantic, WAI-ARIA, Web Speech Synthesis API, Web Vibration API
- **Backend & Database:** [Supabase](https://supabase.com/)
  - **Auth:** Supabase GoTrue (Email, Username RPC, Google OAuth)
  - **Database:** PostgreSQL dengan Row-Level Security (RLS)
  - **Stored Procedures:** Stored Procedure RPC PL/pgSQL `get_email_by_username`

### Struktur Direktori Proyek

```text
aku_anak_kampung/
├── aku-care/                    # Direktori Utama Frontend (Vite SPA)
│   ├── src/
│   │   ├── assets/              # Aset gambar & ilustrasi
│   │   ├── lib/
│   │   │   └── supabase.ts      # Klien Supabase (VITE_SUPABASE_URL & ANON_KEY)
│   │   ├── App.tsx              # Komponen utama & router sesi pengguna
│   │   ├── Auth.tsx             # Modul pengujian/form otentikasi Supabase
│   │   ├── Dokter.tsx           # Modul daftar dokter & voice guidance
│   │   ├── Talckback.tsx        # Provider aksesibilitas Talkback TTS
│   │   ├── index.css            # Styling tokens & Tailwind CSS v4
│   │   └── main.tsx             # Entry point React DOM
│   ├── .env.example             # Contoh template variabel lingkungan
│   ├── package.json             # Manifest dependensi frontend
│   └── vite.config.ts           # Konfigurasi bundler Vite
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Skrip DDL database (tabel doctors & RPC username)
└── README.md                    # Dokumentasi repositori
```

---

## 4. Panduan Instalasi & Menjalankan Proyek

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18.0+ atau 20.0+ (disarankan Node.js LTS)
- Manajer paket `npm` atau `pnpm`
- Akun proyek [Supabase](https://supabase.com/)

### Langkah 1: Kloning Repositori
```bash
git clone https://github.com/hadryan/aku_anak_kampung.git
cd aku_anak_kampung
```

### Langkah 2: Setup Database Supabase
1. Masuk ke dashboard proyek Supabase Anda.
2. Buka menu **SQL Editor**.
3. Buka file [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql), lalu salin dan jalankan seluruh isi kueri SQL tersebut untuk membuat tabel `doctors` dan fungsi RPC `get_email_by_username`.
4. *(Opsional - Seeding Dokter)* Tambahkan beberapa baris data dokter contoh:
   ```sql
   INSERT INTO public.doctors (name, specialty, initial) VALUES
   ('dr. Ratna Wijaya, Sp.KJ', 'Spesialis Kesehatan Jiwa', 'RW'),
   ('dr. Budi Santoso, Sp.A', 'Spesialis Anak', 'BS'),
   ('dr. Siti Rahma, Sp.PD', 'Spesialis Penyakit Dalam', 'SR');
   ```

### Langkah 3: Konfigurasi Environment Variable
1. Masuk ke direktori `aku-care`:
   ```bash
   cd aku-care
   ```
2. Buat file `.env` dari salinan `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Buka file `.env` dan isi dengan kredensial API Supabase Anda (bisa didapatkan di **Project Settings > API**):
   ```ini
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Langkah 4: Instalasi Dependensi & Menjalankan Server Lokal
```bash
# Instalasi dependensi
npm install

# Menjalankan development server
npm run dev
```
Buka browser dan akses aplikasi melalui tautan yang muncul di terminal (biasanya `http://localhost:5173` atau `http://localhost:8443`).

---

## 5. Akun & Kredensial Demo

Untuk pengujian cepat saat evaluasi hackathon:
- **Mode Tamu / Eksplorasi Langsung:** Pengguna dapat langsung menekan tombol **"Coba Layanan Sekarang"** di Landing Page untuk masuk ke antarmuka utama.
- **Akun Uji Coba:**
  - **Email:** `demo@akucare.id`
  - **Kata Sandi:** `Demo123456!`
  - **Username:** `demousser`
- **Pendaftaran Mandiri:** Pengguna dapat membuat akun baru melalui tab **Daftar** pada form autentikasi (wajib menyetujui persetujuan pemrosesan data pribadi).

---

## 6. Atribusi AI & Pihak Ketiga

Proyek ini dibangun dan disempurnakan dengan dukungan alat-alat berikut:
- **Figma & Figma Make:** Ekspor fondasi desain visual dan layout antarmuka inklusif.
- **Google Antigravity AI Assistant:** Digunakan untuk analisis arsitektur, refactor audit aksesibilitas, otomasi migrasi Supabase, standardisasi struktur file, dan dokumentasi repositori.
- **Web Speech API & Web Vibration API:** API standar peramban untuk fungsionalitas bantuan suara dan getaran tanpa dependensi berbayar.
- **Supabase Cloud Platform:** Penyedia layanan Backend-as-a-Service, Autentikasi, dan PostgreSQL database.

---
*Dibuat dengan dedikasi untuk kesetaraan akses layanan kesehatan bagi seluruh masyarakat Indonesia.*
