# aku_anak_kampung

ide/catatan:

1. informasi kesehatan
- web aga + web kemenkes
- 

3. kesehatan mental
- frontend: tampilan harus berdasarkan psikologis --> cari paper

3. disabilitas
- fitur talkback wajib ada
- mode getaran untuk tunanetra, tuli

tech stack:

next.js
figma --> 
supabase

# Product Requirements Document (PRD)
**Nama Produk:** [Nama Web App Anda]  
**Dokumen Versi:** 1.0  
**Tanggal:** [Tanggal Hari Ini]  
**Tim/Penulis:** [Nama Anda / Nama Tim]  
**Status:** [Draft / In Review / Approved]

---

## 1. Ringkasan Eksekutif (Executive Summary)
<!-- Jelaskan secara singkat (1-2 paragraf) apa produk ini, mengapa produk ini dibuat, dan apa nilai tambah utamanya (value proposition). -->
[Nama Web App] adalah aplikasi berbasis web yang bertujuan untuk...

## 2. Latar Belakang & Masalah (Problem Statement)
<!-- Masalah spesifik apa yang Anda coba selesaikan? Mengapa masalah ini penting untuk diselesaikan sekarang? (Kaitkan dengan tema hackathon: Inclusive Health & Well-being). -->
* **Masalah:** ...
* **Dampak Masalah:** ...

## 3. Tujuan dan Sasaran (Objectives & Goals)
### 3.1. Tujuan Utama (Goals)
<!-- Apa yang ingin dicapai oleh produk ini? Gunakan format SMART (Specific, Measurable, Achievable, Relevant, Time-Bound). -->
* Membantu [Target Pengguna] untuk [Melakukan Sesuatu] sehingga [Dampak Positif].

### 3.2. Bukan Tujuan (Non-Goals)
<!-- Apa yang TIDAK akan dikerjakan di fase/hackathon ini? Ini penting untuk membatasi scope (scope creep). -->
* Aplikasi ini tidak akan mencakup fitur...

## 4. Target Pengguna (Target Audience & Personas)
<!-- Siapa yang akan menggunakan aplikasi ini? -->
* **Persona 1:** [Nama Persona - misal: Budi, 25 tahun, Penyandang Disabilitas Tunanetra]. Kebutuhan utama: ...
* **Persona 2:** [Nama Persona - misal: Ani, 30 tahun, Pendamping/Keluarga]. Kebutuhan utama: ...

## 5. Cerita Pengguna (User Stories)
<!-- Format: Sebagai [Tipe Pengguna], saya ingin [Lakukan Sesuatu], sehingga [Manfaat/Alasan]. -->
| ID | Sebagai | Saya Ingin | Sehingga | Prioritas (High/Med/Low) |
|---|---|---|---|---|
| US-01 | Pengguna | Mendaftar dan login dengan akun Google | Saya bisa menyimpan histori data saya | High |
| US-02 | Pengguna | Mengaktifkan kamera via browser | Aplikasi bisa mendeteksi objek di depan saya | High |
| US-03 | Pengguna | Menerima umpan balik audio | Saya tahu rintangan apa yang ada di depan | High |

## 6. Persyaratan Fungsional (Functional Requirements)
<!-- Detail fitur dan bagaimana sistem harus merespons input. -->
1. **Sistem Autentikasi:**
   * Sistem harus mengizinkan pengguna login menggunakan email/password dan OAuth.
2. **Modul Computer Vision (Vision/Analysis):**
   * Sistem harus dapat memproses aliran video dari *webcam* pengguna.
   * Model AI harus mengenali [Objek/Gestur/Teks] dalam waktu kurang dari [X] detik.
3. **Dashboard & Laporan:**
   * Sistem harus menampilkan ringkasan data harian/mingguan pengguna.

## 7. Persyaratan Non-Fungsional (Non-Functional Requirements)
<!-- Syarat kualitas sistem (Kecepatan, Keamanan, Aksesibilitas, dll). -->
* **Kinerja (Performance):** Respon inferensi AI (API ke backend) maksimal 500ms.
* **Aksesibilitas (Accessibility):** UI harus mematuhi standar WCAG 2.1 AA (mendukung screen reader, kontras tinggi, navigasi keyboard). *Sangat penting untuk tema Inklusivitas.*
* **Keamanan & Privasi:** Data gambar dari kamera tidak boleh disimpan di database tanpa persetujuan (harus diproses *on-the-fly*).

## 8. Arsitektur Teknis & Tech Stack
<!-- Teknologi apa yang akan digunakan? (Sangat penting untuk hackathon). -->
* **Frontend:** [Contoh: React.js, Tailwind CSS]
* **Backend:** [Contoh: FastAPI (Python)]
* **Database:** [Contoh: PostgreSQL, SQLite (untuk hackathon)]
* **AI/Machine Learning:** [Contoh: OpenCV, YOLOv8, OpenAI API]
* **Hosting/Deployment:** [Contoh: Vercel untuk Frontend, Render/Railway untuk Backend]

## 9. Desain Antarmuka (UI/UX)
<!-- Tautan ke wireframe atau penjelasan layout secara tekstual. -->
* **Tautan Figma:** [Link Figma Anda]
* **Alur Pengguna (User Flow):** 
  1. Halaman Utama -> 2. Klik "Mulai Pindai" -> 3. Izin Kamera -> 4. Hasil *Real-time*.

## 10. Kriteria Kesuksesan (Success Metrics / KPIs)
<!-- Bagaimana cara Anda tahu aplikasi ini berhasil di tahap hackathon? -->
* **Keberhasilan Teknis:** Model AI berjalan dengan akurasi >80% pada *test dataset*.
* **Keberhasilan Pengguna (Mock):** Mampu menyelesaikan 1 *user flow* utama tanpa *error/crash* saat demo.

## 11. Rencana Pelaksanaan (Hackathon Timeline)
<!-- Timeline singkat selama hari-H hackathon. -->
* **Hari 1 (Pagi):** Setup repository, inisialisasi boilerplate (Frontend & Backend).
* **Hari 1 (Siang):** Integrasi kamera di Frontend dan setup API FastAPI.
* **Hari 1 (Malam):** Integrasi model Computer Vision ke Backend.
* **Hari 2 (Pagi):** Styling UI (Tailwind) & perbaikan aksesibilitas.
* **Hari 2 (Siang):** Testing, debugging, dan persiapan presentasi (Pitch Deck).

## 12. Pertanyaan Terbuka & Risiko (Open Questions & Risks)
* **Risiko 1:** Keterlambatan (latency) saat mengirim *frame* video ke backend. **Mitigasi:** Kurangi resolusi gambar sebelum dikirim atau gunakan model AI langsung di browser (TensorFlow.js) jika memungkinkan.
* **Risiko 2:** ...
