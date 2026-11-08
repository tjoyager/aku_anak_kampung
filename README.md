# Product Requirements Document (PRD)

**Nama Produk:** Aku Anak Kampung *(nama kerja sesuai nama repo; ganti jika ada nama final)*
**Dokumen Versi:** 1.0
**Tanggal:** 8 November 2026
**Tim/Penulis:** [Nama Tim]
**Status:** Draft (siap dipakai sebagai konteks pengembangan)
**Konteks:** Hackathon bertema *Inclusive Health & Well-being*. Tenggat: ±7 hari sejak dokumen ini dibuat.

> **Cara membaca dokumen ini (untuk anggota tim dan AI agent):** Setiap persyaratan memiliki prioritas **P0** (wajib ada di demo), **P1** (sangat diharapkan), **P2** (stretch, kerjakan hanya jika P0/P1 selesai). Jika waktu mepet, potong dari P2 ke atas. Jangan memotong aksesibilitas (Bagian 7.1); itu inti produk.

---

## 1. Ringkasan Eksekutif

Aku Anak Kampung adalah *progressive web app* (PWA) layanan kesehatan yang dirancang sejak awal untuk penyandang disabilitas: **tunanetra, tunarungu, dan buta warna**, serta tetap nyaman bagi pengguna umum. Aplikasi menyatukan lima layanan dalam satu tempat:

1. Informasi dan edukasi kesehatan terkurasi (bersumber dari Kemenkes dan sumber kredibel lain).
2. Tes kesehatan mental dan kepribadian dengan hasil skrining sementara.
3. Layanan darurat: lokasi pengguna, rumah sakit terdekat, ambulans terdekat, dan permintaan penjemputan.
4. Konsultasi langsung via *direct message* dengan dokter/spesialis, dilengkapi chatbot pendamping.
5. Pengaturan aksesibilitas bawaan: mode suara (*talkback*), mode getaran, mode buta warna, dan kontras/ukuran teks.

**Value proposition:** Aplikasi kesehatan yang dapat dipakai mandiri oleh pengguna disabilitas tanpa bergantung pada pendamping, dengan aksesibilitas sebagai fondasi arsitektur, bukan fitur tambahan.

## 2. Latar Belakang & Masalah (Problem Statement)

* **Masalah:**
  * Mayoritas aplikasi dan situs kesehatan belum aksesibel: label ARIA tidak ada, informasi hanya lewat warna atau suara, navigasi tidak ramah keyboard/screen reader.
  * Pada kondisi darurat, pengguna disabilitas sulit menemukan rumah sakit/ambulans terdekat dan berkomunikasi secara cepat (tunarungu tidak dapat menelepon; tunanetra sulit menavigasi peta visual).
  * Akses skrining kesehatan mental terbatas oleh stigma, biaya, dan jarak ke psikolog. Pengguna sering tidak tahu apakah gejalanya perlu ditangani.
  * Informasi kesehatan tersebar dan tidak semuanya kredibel, sehingga rentan hoaks.
* **Dampak Masalah:**
  * Penundaan penanganan medis dan keterlambatan respons darurat pada kelompok rentan.
  * Gangguan mental tidak terdeteksi dini dan tidak dikonsultasikan.
  * Ketergantungan pengguna disabilitas pada orang lain untuk mengakses layanan dasar kesehatan, yang bertentangan dengan prinsip kemandirian dalam UU No. 8 Tahun 2016 tentang Penyandang Disabilitas.

## 3. Tujuan dan Sasaran (Objectives & Goals)

### 3.1. Tujuan Utama (Goals)

* **G1 – Kesehatan mental:** Membantu penderita masalah kesehatan mental melakukan tes psikologi terstandar yang menghasilkan skrining sementara dan dapat dikonsultasikan ke dokter/psikolog, sehingga mendukung deteksi dini dan penyembuhan.
* **G2 – Tunanetra:** Membantu pengguna tunanetra menggunakan aplikasi secara mandiri melalui fitur talkback: membacakan informasi, menjelaskan tata letak dan posisi setiap komponen halaman, serta memandu aktivasi menu/navigasi dengan benar.
* **G3 – Tunarungu:** Memastikan seluruh informasi dan peringatan tersedia dalam bentuk teks, visual, dan getaran, sehingga tunarungu dapat berkomunikasi dan menerima peringatan tanpa audio.
* **G4 – Buta warna:** Menyediakan mode warna dan penanda non-warna (ikon, label, pola) sehingga status, grafik, dan hasil tes tetap terbaca oleh pengguna buta warna.
* **G5 – Darurat:** Membantu pasien mengakses informasi rumah sakit terdekat, informasi pengobatan pribadi, panduan pertolongan pertama, dan ambulans terdekat, serta meminta penjemputan ambulans berbasis lokasi dengan status yang dapat dipantau secara *real-time*.
* **G6 – Awam:** Membantu pengguna awam mengakses berita dan edukasi kesehatan, serta berkonsultasi dengan dokter atas gejala yang dialami, agar mendapat edukasi yang baik dan terhindar dari potensi penyakit.
* **G7 – Keamanan dan keandalan:** Menjaga data kesehatan pengguna dengan autentikasi aman, otorisasi ketat, dan mitigasi serangan umum (SQL injection, brute force, DDoS).

**Sasaran terukur (selama hackathon):** lihat Bagian 10.

### 3.2. Bukan Tujuan (Non-Goals)

Aplikasi ini **tidak** akan mencakup pada fase hackathon:

* Diagnosis medis resmi. Hasil tes bersifat skrining dan bukan pengganti penilaian profesional.
* Pengiriman ambulans sungguhan / integrasi dengan sistem PSC 119 atau rumah sakit. Pada demo, data ambulans bersifat simulasi dan **harus diberi label "Simulasi" di UI**. Tombol panggil 119/112 tetap nyata (`tel:`).
* Panggilan video/suara dengan dokter (hanya pesan teks dan lampiran gambar).
* Pembayaran, asuransi, BPJS, rekam medis elektronik (EHR), dan resep elektronik.
* Rilis ke Play Store/App Store (cukup PWA yang dapat dipasang).
* Computer vision / deteksi objek lewat kamera (sisa dari template awal; dihapus dari scope).
* Dukungan bahasa selain Bahasa Indonesia (struktur i18n disiapkan, konten hanya `id-ID`).
* Login passwordless penuh dengan biometrik (lihat 6.3, biometrik berfungsi sebagai kunci cepat perangkat).

## 4. Target Pengguna (Target Audience & Personas)

* **Persona 1 – Budi, 25, tunanetra total.** Memakai screen reader (TalkBack/VoiceOver) di ponsel. Kebutuhan: semua elemen berlabel, urutan fokus logis, mode suara bawaan yang memberi tahu "Anda berada di halaman X, ada N menu", tombol darurat yang dapat ditemukan tanpa melihat.
* **Persona 2 – Sari, 30, tunarungu.** Kebutuhan: tidak ada informasi yang hanya berupa audio, komunikasi dokter via teks, notifikasi darurat berupa getaran + banner visual, ambulans dapat diminta tanpa telepon.
* **Persona 3 – Dedi, 35, buta warna merah-hijau (deuteranopia).** Kebutuhan: grafik hasil tes dan indikator status (aman/waspada/bahaya) tidak bergantung warna; pilihan palet khusus buta warna.
* **Persona 4 – Rina, 22, mahasiswa dengan gejala cemas.** Kebutuhan: tes mental yang privat, bahasa tidak menghakimi, rujukan jelas ke dokter/psikolog, riwayat hasil tes.
* **Persona 5 – Ani, 40, pengguna awam / pendamping keluarga.** Kebutuhan: informasi kesehatan terpercaya, konsultasi cepat, cari rumah sakit dan ambulans saat keluarga sakit.
* **Persona 6 – dr. Hendra, dokter/spesialis mitra.** Kebutuhan: daftar konsultasi masuk, pesan yang terstruktur, status online, tampilan ringkas riwayat tes pasien (hanya jika pasien mengizinkan).
* **Persona 7 (internal) – Admin.** Memverifikasi akun dokter, mengelola artikel dan data rumah sakit.

## 5. Cerita Pengguna (User Stories)

| ID | Sebagai | Saya Ingin | Sehingga | Prioritas |
|---|---|---|---|---|
| US-01 | Pengguna | Mendaftar dan login dengan akun Google | Saya cepat masuk dan data tersimpan | P0 |
| US-02 | Pengguna | Mendaftar/login dengan email dan password | Saya tetap bisa masuk tanpa akun Google | P0 |
| US-03 | Pengguna | Mengaktifkan login biometrik (sidik jari/wajah) | Saya membuka aplikasi dengan cepat dan aman | P2 |
| US-04 | Tunanetra | Mengaktifkan mode suara yang membacakan halaman, komponen, dan posisinya | Saya dapat menavigasi tanpa melihat | P0 |
| US-05 | Tunanetra | Menekan menu dengan perintah keyboard/suara dan mendapat konfirmasi audio | Saya yakin aksi saya benar | P1 |
| US-06 | Tunarungu | Menerima peringatan lewat getaran dan banner visual | Saya tahu ada kejadian penting tanpa audio | P0 |
| US-07 | Tunarungu | Berkonsultasi dengan dokter lewat teks | Saya tidak perlu telepon | P0 |
| US-08 | Buta warna | Memilih mode warna (protanopia/deuteranopia/tritanopia/akromatopsia) | Semua informasi terbaca | P0 |
| US-09 | Pengguna | Melihat lokasi saya dan rumah sakit terdekat di peta dan daftar | Saya cepat menemukan layanan | P0 |
| US-10 | Pengguna | Melihat ambulans terdekat dan meminta penjemputan | Saya mendapat bantuan saat darurat | P0 (simulasi) |
| US-11 | Pengguna | Memantau status ambulans secara real-time | Saya tahu estimasi kedatangan | P1 |
| US-12 | Pengguna | Menekan satu tombol darurat (SOS) dari halaman mana pun | Saya langsung ke layanan darurat | P0 |
| US-13 | Pengguna | Menyimpan kontak darurat dan info medis pribadi (golongan darah, alergi, obat rutin) | Informasi tersedia saat darurat | P1 |
| US-14 | Pengguna | Mengerjakan tes kesehatan mental (PHQ-9, GAD-7, DASS-21) | Saya tahu kondisi awal saya | P0 |
| US-15 | Pengguna | Mengerjakan tes kepribadian (Big Five) | Saya lebih mengenal diri | P1 |
| US-16 | Pengguna | Melihat riwayat dan tren hasil tes | Saya memantau perkembangan | P1 |
| US-17 | Pengguna | Membagikan hasil tes ke dokter pilihan saya | Dokter memahami kondisi saya | P1 |
| US-18 | Pengguna dengan skor berisiko tinggi | Langsung melihat sumber bantuan krisis | Saya segera mendapat dukungan | P0 |
| US-19 | Pengguna | Mengirim pesan langsung ke dokter/spesialis | Saya berkonsultasi tentang gejala | P0 |
| US-20 | Pengguna | Menanyakan hal ringan ke chatbot | Saya mendapat informasi cepat dan diarahkan ke dokter | P1 |
| US-21 | Pengguna | Membaca berita dan edukasi kesehatan terkurasi | Saya terhindar dari hoaks | P0 |
| US-22 | Pengguna | Memasang aplikasi ke layar utama ponsel | Saya memakainya seperti aplikasi native | P0 |
| US-23 | Dokter | Melihat dan membalas pesan pasien secara real-time | Saya dapat memberi saran medis | P0 |
| US-24 | Admin | Memverifikasi akun dokter dan mengelola konten | Hanya dokter sah yang berkonsultasi | P1 |
| US-25 | Pengguna | Menghapus akun dan seluruh data saya | Saya mengendalikan data pribadi saya | P1 |

## 6. Persyaratan Fungsional (Functional Requirements)

### 6.1. Aksesibilitas Inti

**FR-A1 Mode Suara / Talkback (P0).**
* Toggle "Mode Suara" muncul di header dan dapat diaktifkan di layar pertama (onboarding menanyakan kebutuhan aksesibilitas sebelum apa pun).
* Menggunakan Web Speech API `speechSynthesis` (`lang: id-ID`). Fitur mencakup: membacakan judul halaman dan ringkasan tata letak saat halaman dibuka ("Halaman Beranda. Ada 5 menu utama: ..."), membacakan label elemen saat fokus berpindah, membacakan hasil aksi (sukses/gagal), serta membacakan konten artikel dan hasil tes.
* Pengaturan: kecepatan, volume, dan suara; tombol "Hentikan suara" selalu tersedia (Esc).
* Wajib kompatibel dengan screen reader asli (TalkBack, VoiceOver, NVDA). Mode Suara tidak boleh membacakan ganda; saat screen reader terdeteksi atau pengguna memilih, tampilkan saran memakai screen reader dan matikan pembacaan otomatis fokus.
* Perintah suara (`SpeechRecognition`, P2): "buka darurat", "buka tes", "kembali". Hanya didukung peramban tertentu (Chrome/Edge); sediakan fallback keyboard.
* **Kriteria penerimaan:** seluruh alur P0 dapat diselesaikan tanpa melihat layar dan tanpa mouse.

**FR-A2 Mode Getaran (P0).**
* Memakai `navigator.vibrate()` dengan pola berbeda: sukses (pendek), peringatan (dua pendek), darurat (panjang berulang), pesan baru dari dokter (tiga pendek), ambulans tiba (pola khusus).
* Setiap getaran **wajib berpasangan** dengan indikator visual (banner/ikon berkedip) dan teks. Getaran tidak boleh menjadi satu-satunya kanal.
* Deteksi dukungan: jika `navigator.vibrate` tidak tersedia (mis. iOS Safari), tampilkan penjelasan dan beralih ke visual + flash layar.
* Pengaturan intensitas on/off di Pengaturan Aksesibilitas.

**FR-A3 Mode Buta Warna (P0).**
* Opsi: Normal, Protanopia, Deuteranopia, Tritanopia, Akromatopsia (monokrom). Diterapkan lewat *design tokens* (CSS variables) pada `data-cb-mode` di `<html>`; palet dasar mengacu pada palet aman buta warna (mis. Okabe-Ito).
* Aturan desain: tidak ada informasi yang hanya dibedakan warna; selalu tambahkan ikon + label teks (+ pola/tekstur pada grafik).
* Preferensi disimpan di akun (tabel `user_settings`) dan `localStorage` untuk pengunjung tanpa login.

**FR-A4 Pengaturan Aksesibilitas Tambahan (P1).** Ukuran teks (100–200%), mode kontras tinggi, kurangi animasi (`prefers-reduced-motion`), font ramah disleksia (opsional), dan mode gelap. Semua default mengikuti preferensi sistem.

**FR-A5 Navigasi Keyboard & Struktur Semantik (P0).** *Skip link*, urutan fokus logis, indikator fokus jelas, landmark (`header/nav/main/footer`), satu `<h1>` per halaman, dan manajemen fokus saat berpindah rute dan membuka modal.

**FR-A6 Pengaturan Cepat dari Awal (P0).** Onboarding 1 layar: "Apakah Anda membutuhkan bantuan aksesibilitas?" dengan pilihan besar (Suara, Getaran, Warna, Teks Besar). Pilihan langsung diterapkan.

### 6.2. Lokasi, Rumah Sakit, dan Ambulans

**FR-L1 Lokasi Pengguna (P0).** `navigator.geolocation` dengan permintaan izin yang dijelaskan sebelum prompt peramban. Fallback: input manual alamat/kota jika izin ditolak. Koordinat tidak disimpan permanen kecuali saat permintaan ambulans.

**FR-L2 Rumah Sakit Terdekat (P0).**
* Peta (Leaflet + OpenStreetMap) dan **daftar teks yang setara** (untuk screen reader dan pengguna yang tidak bisa memakai peta). Daftar diurutkan berdasarkan jarak, menampilkan nama, jarak, alamat, telepon (`tel:`), dan tombol "Petunjuk arah" (tautan ke aplikasi peta).
* Sumber data: tabel `hospitals` (di-*seed* dari OpenStreetMap/Overpass dan data publik Kemenkes) dengan indeks geospasial (PostGIS) untuk kueri jarak. Alternatif: panggil Overpass API di sisi server dengan *cache*.
* Peta tidak boleh menjadi satu-satunya cara; tiap penanda memiliki padanan di daftar.

**FR-L3 Ambulans Terdekat & Permintaan Penjemputan (P0, simulasi).**
* Tampilkan ambulans tersedia di sekitar (tabel `ambulances`, posisi diperbarui via Supabase Realtime; pada demo dijalankan *simulator* yang menggeser posisi secara berkala).
* Alur permintaan: pengguna menekan "Panggil Ambulans" → konfirmasi (lokasi + kondisi singkat + kontak) → status `requested` → `accepted` → `on_the_way` → `arrived` → `completed` / `cancelled`. Status disiarkan lewat Realtime dan diumumkan lewat suara/getaran/teks sesuai mode pengguna.
* Dilarang menyiratkan bahwa ambulans nyata sedang dikirim. Tampilkan banner "Mode Demo/Simulasi" dan tombol **Telepon 119** dan **112** yang selalu terlihat pada layar ini.

**FR-L4 Tombol SOS Global (P0).** Tombol tetap (*sticky*) di setiap halaman, dapat dijangkau dengan keyboard dan memiliki label ARIA. Membuka layar darurat: panggil 119/112, panggil ambulans, rumah sakit terdekat, kontak darurat, panduan pertolongan pertama.

**FR-L5 Info Medis Pribadi & Kontak Darurat (P1).** Pengguna menyimpan golongan darah, alergi, penyakit penyerta, obat rutin, dan kontak darurat. Tersedia pada layar darurat dan dapat dibagikan ke petugas atas persetujuan pengguna. Termasuk kategori data pribadi spesifik (lihat 7.3).

**FR-L6 Panduan Pertolongan Pertama (P1).** Konten statis terkurasi (henti jantung/CPR, tersedak, luka bakar, pendarahan, pingsan) dengan langkah bernomor, teks sederhana, dapat dibacakan dan **dapat diakses offline** (cache service worker).

### 6.3. Autentikasi & Akun

**FR-U1 Login Google (P0).** Supabase Auth OAuth Google. Konfigurasi *redirect URL* untuk lingkungan lokal dan produksi.

**FR-U2 Email/Password (P0).** Registrasi dengan verifikasi email, kebijakan password minimal 10 karakter, reset password via email.

**FR-U3 Peran (P0).** Peran: `patient`, `doctor`, `admin` (disimpan di `profiles.role`, tidak pernah dari input klien). Akun dokter hanya aktif setelah `doctors.verified = true` oleh admin.

**FR-U4 Biometrik (P2).** Diimplementasikan sebagai **kunci cepat perangkat** memakai WebAuthn (autentikator platform, `userVerification: "required"`): setelah login pertama, pengguna dapat mendaftarkan sidik jari/wajah perangkat; pada pembukaan berikutnya, sesi tersimpan dibuka setelah verifikasi biometrik berhasil (diverifikasi di server). Bukan pengganti penuh login password/Google. Jika perangkat tidak mendukung, opsi disembunyikan. Pustaka yang disarankan: SimpleWebAuthn.

**FR-U5 Pengelolaan Akun (P1).** Ubah profil, ekspor dan hapus data (hak subjek data), dan keluar dari semua perangkat.

### 6.4. Tes Kesehatan Mental & Kepribadian

**FR-M1 Katalog Tes (P0).** Instrumen terstandar dan bebas digunakan:
* **PHQ-9** (depresi, 9 butir; skor 0–27: 0–4 minimal, 5–9 ringan, 10–14 sedang, 15–19 cukup berat, 20–27 berat).
* **GAD-7** (kecemasan, 7 butir; skor 0–21: 0–4 minimal, 5–9 ringan, 10–14 sedang, 15–21 berat).
* **DASS-21** (depresi, kecemasan, stres; P1).
* **Kepribadian Big Five** versi singkat berbasis IPIP (domain publik; P1). **Jangan memakai MBTI** (merek dagang dan berlisensi).
* Gunakan terjemahan Bahasa Indonesia yang sudah tervalidasi; cantumkan sumber instrumen di halaman tes. Tim memverifikasi lisensi/sumber sebelum rilis.
* Butir soal disimpan sebagai berkas JSON versi-terkontrol di repo (bukan di DB) agar mudah diaudit.

**FR-M2 Pengalaman Mengerjakan Tes (P0).** Satu pertanyaan per layar, bilah progres dengan teks ("Pertanyaan 3 dari 9"), tombol kembali, dapat dijeda dan dilanjutkan, bahasa netral dan tidak menghakimi, palet warna menenangkan, animasi minimal. Prinsip UI psikologis mengacu pada paper rujukan tim (ejournal2.unud.ac.id, JNATIA) dan **harus diringkas menjadi pedoman desain** oleh FE/UI lead sebelum implementasi halaman tes. Jawaban dapat dipilih lewat suara, keyboard, atau sentuhan.

**FR-M3 Hasil (P0).** Skor, kategori tingkat keparahan, penjelasan awam, saran langkah berikutnya, dan tombol "Konsultasikan ke dokter". Wajib ada *disclaimer*: "Hasil ini adalah skrining awal, bukan diagnosis." Visualisasi hasil memakai ikon + teks + pola (bukan warna saja) dan tersedia sebagai teks yang dapat dibacakan.

**FR-M4 Protokol Krisis (P0).** Jika PHQ-9 butir 9 (pikiran menyakiti diri) bernilai ≥ 1, atau skor kategori berat, tampilkan segera panel dukungan krisis: ajakan menghubungi orang tepercaya, layanan darurat 119 / 112, layanan kesehatan jiwa Kemenkes (119 ekstensi 8, **verifikasi nomor sebelum rilis**), dan tombol konsultasi dokter prioritas. Dilarang menyajikan informasi metode menyakiti diri. Bahasa suportif, tanpa kata yang menyalahkan.

**FR-M5 Riwayat & Berbagi (P1).** Riwayat hasil dengan grafik tren (dengan alternatif tabel teks). Berbagi hasil ke dokter bersifat **opt-in per hasil** dan dapat dicabut.

### 6.5. Konsultasi Dokter (Direct Message) & Chatbot

**FR-C1 Direktori Dokter (P0).** Daftar dokter/spesialis terverifikasi dengan spesialisasi, status online, dan filter (umum, psikiater, psikolog, dll.). Pada demo, gunakan akun dokter *seed* yang diberi label jelas.

**FR-C2 Pesan Langsung (P0).** Percakapan 1-satu-1 pasien–dokter dengan Supabase Realtime. Fitur: pesan teks, lampiran gambar (Supabase Storage dengan *signed URL*), status terkirim/dibaca, indikator mengetik, dan notifikasi dalam aplikasi (+ getaran/suara sesuai mode). Pesan baru diumumkan lewat `aria-live="polite"`. Pesan tidak boleh hanya mengandalkan suara.

**FR-C3 Privasi Percakapan (P0).** Hanya dua peserta percakapan (dan tidak ada admin) yang dapat membaca pesan, ditegakkan lewat RLS (lihat 8.3). Tampilkan *disclaimer*: konsultasi daring tidak untuk kondisi darurat; arahkan ke SOS.

**FR-C4 Chatbot Pendamping (P1).** Chatbot berbasis LLM (dipanggil dari *route handler* server; kunci API tidak pernah di klien) untuk informasi kesehatan umum dan navigasi aplikasi. Aturan wajib: tidak memberikan diagnosis atau dosis obat spesifik, selalu menyarankan dokter untuk gejala bermakna, mendeteksi kata kunci darurat/krisis dan langsung menampilkan panel SOS/krisis, menolak topik di luar kesehatan, dan memberi label "Chatbot AI, bukan dokter". Pembatasan laju (rate limit) per pengguna.

### 6.6. Informasi & Edukasi Kesehatan

**FR-I1 Artikel Terkurasi (P0).** Daftar dan detail artikel kesehatan dengan kategori (penyakit umum, gizi, kesehatan mental, disabilitas, pertolongan pertama). Sumber: Kemenkes (kemkes.go.id, sehatnegeriku.kemkes.go.id, p2p.kemkes.go.id) dan sumber kredibel lain yang ditetapkan tim *[konfirmasi: sumber "web aga" pada catatan awal]*. **Aturan konten:** simpan ringkasan buatan sendiri + tautan sumber + atribusi, bukan salinan penuh artikel (hak cipta). Setiap artikel menampilkan sumber, tanggal, dan tombol "Dengarkan artikel".

**FR-I2 Pencarian & Format Mudah Dibaca (P1).** Pencarian teks, bahasa sederhana, struktur heading jelas, ukuran teks dapat diatur.

**FR-I3 Informasi Pengobatan Pribadi (P2).** Pengingat dan catatan obat pribadi pengguna (nama, jadwal, catatan). Bukan rekomendasi pengobatan.

### 6.7. PWA (Dapat Dipasang Seperti Aplikasi Native)

**FR-P1 Instalasi (P0).** `manifest.webmanifest` (nama, ikon 192/512 + *maskable*, `display: standalone`, `theme_color`, `lang: id`), service worker, dan tombol "Pasang Aplikasi" yang aksesibel (menangani `beforeinstallprompt`; di iOS tampilkan petunjuk "Tambah ke Layar Utama").

**FR-P2 Offline Dasar (P1).** Halaman *offline fallback*, cache aset statis, serta cache untuk panduan pertolongan pertama, nomor darurat, dan info medis pribadi. Fitur real-time (chat, ambulans) menampilkan status "Anda sedang offline".

**FR-P3 Catatan Batasan (diketahui):** Getaran tidak didukung iOS Safari; push notification web di iOS hanya setelah PWA dipasang. Push notification adalah P2.

### 6.8. Keamanan sebagai Fitur (rincian di Bagian 7.2)

Perlindungan terhadap SQL injection, brute force, dan DDoS merupakan persyaratan P0 (lihat 7.2).

## 7. Persyaratan Non-Fungsional (Non-Functional Requirements)

### 7.1. Aksesibilitas (Prioritas Tertinggi)
* Memenuhi **WCAG 2.2 level AA** (naik dari 2.1 pada draf awal): kontras teks ≥ 4.5:1 (teks besar ≥ 3:1), target sentuh ≥ 24×24 px (disarankan 44×44 px), tidak ada jebakan fokus, alternatif teks untuk semua media non-teks, input berlabel, pesan galat jelas dan terhubung ke input (`aria-describedby`), tidak ada konten berkedip > 3 kali/detik.
* Informasi tidak boleh disampaikan **hanya** lewat satu kanal indra (warna saja, suara saja, atau getaran saja).
* Gunakan komponen dasar aksesibel (mis. Radix UI/shadcn/ui) dan elemen HTML semantik; ARIA hanya jika semantik HTML tidak cukup.
* Pengujian: audit otomatis (axe-core, Lighthouse Accessibility ≥ 95) **dan** uji manual dengan TalkBack (Android) atau VoiceOver (iOS) serta navigasi keyboard penuh. Ideal: uji bersama pengguna disabilitas nyata.

### 7.2. Keamanan & Privasi
Catatan realistis: tidak ada sistem yang "kebal"; target adalah **mitigasi berlapis** terhadap risiko berikut.

* **SQL Injection:** Seluruh akses data memakai Supabase client / kueri berparameter; **dilarang** menyusun SQL dengan *string concatenation*. Fungsi Postgres (RPC) memakai parameter ber-tipe. Validasi semua input server-side dengan Zod (tipe, panjang, format). Row Level Security (RLS) aktif di **semua** tabel.
* **Brute Force:** Pembatasan laju pada autentikasi (rate limit bawaan Supabase Auth + pembatasan tambahan lewat Upstash Ratelimit pada *route handler*/middleware berdasarkan IP dan akun), CAPTCHA (Cloudflare Turnstile/hCaptcha) pada pendaftaran/login/reset password setelah percobaan gagal, kebijakan password kuat, pesan galat generik ("email atau password salah").
* **DDoS:** Gunakan perlindungan lapis jaringan dari platform (Vercel Firewall/WAF dan/atau Cloudflare di depan domain), *rate limit* per endpoint (terutama chatbot, ambulans, dan upload), batas ukuran *payload* dan lampiran (mis. maks 5 MB, tipe MIME diperiksa), cache untuk endpoint baca yang berat. Catatan: perlindungan DDoS volumetrik diserahkan ke penyedia infrastruktur.
* **Aplikasi web umum:** Header keamanan (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` yang mengizinkan geolocation), pencegahan XSS (tidak memakai `dangerouslySetInnerHTML` pada konten pengguna; sanitasi), perlindungan CSRF (cookie `SameSite`, pemeriksaan origin pada mutasi), HTTPS wajib.
* **Rahasia:** `SUPABASE_SERVICE_ROLE_KEY` dan kunci LLM hanya di server; tidak pernah diawali `NEXT_PUBLIC_`. File `.env*` masuk `.gitignore`. Aktifkan *secret scanning* repo.
* **Otorisasi:** Peran ditegakkan di RLS dan server, bukan hanya di UI.
* **Log audit:** Catat aksi sensitif (login gagal, berbagi hasil tes, akses data dokter) tanpa menyimpan isi pesan atau hasil tes.

### 7.3. Privasi Data & Kepatuhan
* Data kesehatan dan kesehatan jiwa termasuk **data pribadi yang bersifat spesifik** menurut UU No. 27 Tahun 2022 (UU PDP). Wajib: persetujuan eksplisit dan terpisah (*consent*) saat pendaftaran dan sebelum berbagi hasil tes, minimisasi data, kebijakan privasi berbahasa sederhana yang dapat dibaca/didengar, dan hak hapus akun.
* Lokasi: hanya diambil saat dibutuhkan; disimpan hanya pada permintaan ambulans.
* Hasil tes hanya dapat dibaca pemiliknya (dan dokter yang diberi akses oleh pemilik).
* Gunakan data **dummy** untuk demo; jangan memakai data kesehatan nyata.

### 7.4. Kinerja
* LCP < 2.5 detik pada jaringan 4G; JavaScript awal ringan (code-splitting; peta dimuat *lazy*).
* Pembaruan real-time (chat, posisi ambulans) < 1 detik pada kondisi normal.
* Halaman darurat harus interaktif tanpa bergantung pada pemuatan peta.

### 7.5. Keandalan & Kompatibilitas
* Peramban: Chrome/Edge (Android dan desktop) dan Safari iOS versi terkini. Fitur yang bergantung API peramban (getaran, pengenalan suara) harus **dideteksi fiturnya** dan memiliki *fallback* yang jelas.
* Responsif *mobile-first* (lebar 360 px ke atas).
* Penanganan galat ramah: pesan jelas, tidak membocorkan detail teknis.

## 8. Arsitektur Teknis & Tech Stack

### 8.1. Stack
* **Frontend:** Next.js (App Router) + TypeScript, Tailwind CSS, shadcn/ui (Radix), React Hook Form + Zod.
* **Backend:** Next.js Route Handlers / Server Actions (tanpa server terpisah); Supabase sebagai BaaS.
* **Database & Auth:** Supabase (PostgreSQL, Auth [Google OAuth + email/password], Row Level Security, Realtime, Storage, PostGIS untuk kueri jarak).
* **Peta:** Leaflet + OpenStreetMap (tanpa biaya); Overpass API/Nominatim untuk data dan geocoding (patuhi kebijakan penggunaan dan atribusi OSM).
* **PWA:** Serwist (service worker untuk Next.js) atau konfigurasi manual; `manifest.webmanifest`.
* **Biometrik:** WebAuthn via SimpleWebAuthn (P2).
* **Keamanan:** Upstash Redis + `@upstash/ratelimit`, Cloudflare Turnstile, header via `next.config`.
* **AI/Chatbot:** LLM API dipanggil dari server (penyedia ditentukan tim; kunci di env server).
* **Suara/Getaran:** Web Speech API (`speechSynthesis`, `SpeechRecognition`), Vibration API.
* **Desain:** Figma *[tautan: isi]* dengan halaman *design tokens* (warna per mode buta warna, tipografi, spasi).
* **Pengujian:** Vitest, Playwright, `@axe-core/playwright`, Lighthouse CI.
* **Hosting:** Vercel (frontend + server functions) dan Supabase Cloud.

### 8.2. Struktur Rute (Next.js App Router)
```
/                     Beranda + onboarding aksesibilitas
/login, /register     Autentikasi
/darurat              Layar darurat (SOS, 119/112, kontak darurat, P3K)
/lokasi               Peta + daftar rumah sakit & ambulans terdekat
/ambulans/[id]        Status permintaan ambulans (real-time)
/tes                  Katalog tes
/tes/[slug]           Pengerjaan tes (phq9, gad7, dass21, big5)
/tes/hasil/[id]       Hasil tes
/konsultasi           Direktori dokter + daftar percakapan
/konsultasi/[id]      Ruang percakapan
/chatbot              Chatbot pendamping
/informasi            Artikel kesehatan
/informasi/[slug]     Detail artikel
/profil               Profil, info medis, kontak darurat
/pengaturan           Aksesibilitas, keamanan (biometrik), privasi
/dokter               Dasbor dokter
/admin                Dasbor admin (verifikasi dokter, konten)
```

### 8.3. Model Data (Supabase / Postgres)
Semua tabel: RLS **aktif**; kebijakan *deny by default*. Kolom `id uuid` PK, `created_at timestamptz`.

| Tabel | Kolom Utama | Aturan Akses (RLS) |
|---|---|---|
| `profiles` | `id` (=`auth.users.id`), `full_name`, `role` (`patient`/`doctor`/`admin`), `phone`, `birth_date`, `consent_at` | Baca/ubah milik sendiri; `role` hanya ubah oleh admin/server |
| `user_settings` | `user_id`, `talkback` bool, `speech_rate`, `vibration` bool, `cb_mode` enum, `font_scale`, `high_contrast`, `reduce_motion` | Milik sendiri |
| `medical_info` | `user_id`, `blood_type`, `allergies`, `conditions`, `medications` | Milik sendiri |
| `emergency_contacts` | `user_id`, `name`, `phone`, `relation` | Milik sendiri |
| `hospitals` | `name`, `address`, `phone`, `location geography(Point)`, `type`, `source` | Baca publik; tulis admin |
| `ambulances` | `code`, `operator`, `location geography(Point)`, `status` (`available`/`busy`/`offline`), `is_simulated` | Baca publik (tanpa data pribadi); tulis server/simulator |
| `ambulance_requests` | `user_id`, `ambulance_id`, `pickup_location`, `note`, `status`, `eta_minutes` | Pemilik baca/buat/batalkan; server memperbarui status |
| `assessment_results` | `user_id`, `instrument` (`phq9`/`gad7`/`dass21`/`big5`), `instrument_version`, `answers jsonb`, `score`, `severity`, `flagged_risk` bool | Pemilik; dokter hanya jika ada `result_shares` aktif |
| `result_shares` | `result_id`, `doctor_id`, `revoked_at` | Pemilik mengelola; dokter terkait membaca |
| `doctors` | `user_id`, `specialty`, `str_number`, `verified` bool, `bio`, `is_online` | Baca publik hanya yang `verified`; ubah milik sendiri/admin |
| `conversations` | `patient_id`, `doctor_id`, `status` | Hanya dua peserta |
| `messages` | `conversation_id`, `sender_id`, `body`, `attachment_path`, `read_at` | Hanya peserta percakapan |
| `articles` | `slug`, `title`, `summary`, `category`, `source_name`, `source_url`, `published_at` | Baca publik; tulis admin |
| `webauthn_credentials` | `user_id`, `credential_id`, `public_key`, `counter` | Hanya server |
| `audit_logs` | `actor_id`, `action`, `meta jsonb` | Hanya server/admin |

Indeks geospasial (GiST) pada kolom `location`. Aktifkan Realtime hanya pada `messages`, `ambulance_requests`, dan `ambulances`.

### 8.4. Pemetaan Fitur Peramban
| Kebutuhan | API | Catatan |
|---|---|---|
| Talkback | `speechSynthesis` | Tersedia luas; pilih suara `id-ID` bila ada |
| Perintah suara | `SpeechRecognition` | Terbatas; fallback wajib |
| Getaran | `navigator.vibrate` | Tidak ada di iOS Safari |
| Lokasi | `navigator.geolocation` | HTTPS + izin pengguna |
| Biometrik | WebAuthn | Autentikator platform |
| Instal | Web App Manifest + SW | iOS: manual "Tambah ke Layar Utama" |

## 9. Desain Antarmuka (UI/UX)

* **Tautan Figma:** [isi tautan Figma]
* **Prinsip desain:**
  1. *Accessibility-first:* komponen dirancang dan diuji aksesibilitasnya sebelum estetika.
  2. Satu tujuan per layar, target sentuh besar, label teks di samping setiap ikon.
  3. Nada bahasa hangat, sederhana, tidak menghakimi (terutama di tes mental).
  4. Palet tenang untuk tes mental; merah/oranye untuk darurat **selalu disertai ikon + teks + pola**.
  5. Tombol SOS konsisten di posisi yang sama pada semua halaman.
* **Design tokens:** warna semantik (`--color-success/warning/danger/info`) didefinisikan per mode buta warna; tidak ada nilai warna *hard-coded* di komponen.
* **Alur utama:**
  1. **Onboarding:** Buka aplikasi → pilih kebutuhan aksesibilitas → (opsional) login → Beranda.
  2. **Darurat:** Tombol SOS → Layar Darurat → Telepon 119/112 *atau* Panggil Ambulans → konfirmasi lokasi → pantau status.
  3. **Tes mental:** Katalog → pilih tes → intro + disclaimer → pertanyaan satu per satu → hasil → konsultasi dokter / bantuan krisis bila berisiko.
  4. **Konsultasi:** Direktori dokter → pilih dokter → kirim pesan → terima balasan (notifikasi sesuai mode).
  5. **Informasi:** Informasi → pilih kategori → baca/dengarkan artikel.
* **Layar P0 yang harus ada di Figma:** Onboarding aksesibilitas, Beranda, Darurat, Lokasi (peta + daftar), Status Ambulans, Katalog Tes, Pertanyaan Tes, Hasil Tes, Panel Krisis, Direktori Dokter, Ruang Chat, Artikel, Pengaturan Aksesibilitas, Login/Register.

## 10. Kriteria Kesuksesan (Success Metrics / KPIs)

**Keberhasilan teknis (saat demo):**
* Seluruh alur P0 (Bagian 6) berjalan tanpa *error/crash* pada ponsel Android nyata dan satu peramban desktop.
* Skor Lighthouse: Accessibility ≥ 95, Best Practices ≥ 90, PWA *installable*; tidak ada pelanggaran axe tingkat *critical/serious*.
* RLS aktif di 100% tabel; uji manual membuktikan pengguna A tidak dapat membaca data pengguna B (pesan, hasil tes, info medis).
* Rate limit terbukti memblokir uji 10 percobaan login gagal beruntun; percobaan injeksi sederhana (`' OR 1=1 --`) pada input tidak berdampak.
* Alur darurat (SOS → ambulans dipesan → status berubah *real-time*) selesai < 30 detik.

**Keberhasilan pengguna (uji coba mini, bila memungkinkan):**
* Minimal 3 penguji (idealnya 1 per kelompok disabilitas) menyelesaikan tugas: (a) mencari rumah sakit terdekat, (b) mengerjakan PHQ-9, (c) mengirim pesan ke dokter, tanpa bantuan.
* Skor SUS ≥ 70 atau umpan balik kualitatif terdokumentasi.

**Keberhasilan juri/demo:** Skenario demo 5 menit yang memperlihatkan: onboarding aksesibilitas, Mode Suara, mode buta warna, SOS + ambulans, tes mental + panel krisis, konsultasi dokter, dan instalasi PWA.

## 11. Rencana Pelaksanaan (Timeline 7 Hari)

| Hari | Fokus | Keluaran |
|---|---|---|
| **H1** | Fondasi | Repo + CI, boilerplate Next.js/Tailwind/shadcn, proyek Supabase, skema DB + RLS, *design tokens* + Figma layar P0, Auth (Google + email) |
| **H2** | Aksesibilitas inti | Layout semantik, skip link, onboarding aksesibilitas, `user_settings`, mode buta warna, Mode Suara v1, mode getaran |
| **H3** | Darurat & lokasi | Geolokasi, seed `hospitals`, peta + daftar, SOS global, layar darurat, P3K |
| **H4** | Ambulans & tes mental | Simulator ambulans + Realtime + alur permintaan; PHQ-9 dan GAD-7 + hasil + protokol krisis |
| **H5** | Konsultasi & informasi | Direktori dokter, DM real-time (RLS), artikel terkurasi; chatbot (P1) |
| **H6** | Keamanan, PWA, polish | Rate limit, CAPTCHA, header keamanan, validasi Zod; manifest + service worker; riwayat tes; Big Five/DASS-21 bila sempat; biometrik (P2) bila sempat |
| **H7** | Uji dan presentasi | Uji aksesibilitas (axe, Lighthouse, TalkBack manual), uji RLS, perbaikan bug, data demo, video/skrip demo, *pitch deck*, *freeze* kode |

**Aturan pelaksanaan:** *feature freeze* pada awal H7. Setiap PR memenuhi Definition of Done (Bagian 13). Jika terlambat, buang P2 lebih dulu, lalu P1; jangan korbankan P0 aksesibilitas dan keamanan.

## 12. Pertanyaan Terbuka & Risiko (Open Questions & Risks)

**Risiko:**
* **R1 – Sumber data rumah sakit/ambulans tidak lengkap.** *Mitigasi:* seed dari OSM + kurasi manual wilayah demo; ambulans disimulasikan dan diberi label jelas.
* **R2 – Dukungan Web Speech/Vibration tidak merata (terutama iOS).** *Mitigasi:* deteksi fitur, *fallback* visual/teks, dokumentasikan batasan; uji utama di Android.
* **R3 – Mode Suara bentrok dengan screen reader asli.** *Mitigasi:* deteksi dan sarankan screen reader; opsi matikan pembacaan fokus otomatis; `aria-live` secukupnya.
* **R4 – Risiko etika/keselamatan tes mental dan chatbot.** *Mitigasi:* *disclaimer* jelas, protokol krisis (FR-M4), chatbot dibatasi dan tidak mendiagnosis.
* **R5 – Kebocoran data kesehatan.** *Mitigasi:* RLS, minimisasi data, data dummy saat demo, rahasia hanya di server.
* **R6 – Lingkup terlalu besar untuk 7 hari.** *Mitigasi:* prioritas P0/P1/P2, *feature freeze* H7, ambulans disimulasikan, biometrik hanya P2.
* **R7 – Klaim keamanan berlebihan ("kebal").** *Mitigasi:* gunakan istilah mitigasi berlapis; tampilkan bukti uji (rate limit, RLS) saat presentasi.
* **R8 – Lisensi instrumen tes/terjemahan.** *Mitigasi:* gunakan PHQ-9, GAD-7, IPIP (bebas pakai); verifikasi sumber terjemahan; hindari MBTI.

**Pertanyaan terbuka (perlu keputusan sebelum H2):**
1. Nama produk final dan tautan Figma.
2. Sumber "web aga" yang dimaksud pada catatan awal, dan daftar sumber artikel final.
3. Wilayah geografis demo (kota) untuk seed rumah sakit dan ambulans.
4. Penyedia LLM untuk chatbot dan anggaran kuotanya.
5. Ketersediaan dokter/psikolog nyata untuk validasi konten dan uji, atau cukup akun *seed*.
6. Anggota tim dan pembagian peran (FE, UI/UX, backend/Supabase, QA aksesibilitas, konten).

## 13. Panduan untuk AI Coding Agent & Definition of Done

**Konvensi:**
* TypeScript *strict*; komponen fungsional; validasi input dengan Zod di setiap *route handler/server action*.
* Gunakan elemen HTML semantik terlebih dahulu; setiap elemen interaktif punya nama aksesibel; setiap gambar punya `alt` bermakna (atau `alt=""` bila dekoratif).
* Warna **hanya** dari design tokens; tidak ada informasi yang disampaikan lewat warna saja.
* Setiap fitur yang memakai audio/getaran **harus** memiliki padanan teks/visual.
* Teks UI dalam Bahasa Indonesia, disimpan di berkas pesan (siap i18n), bukan *hard-coded* tersebar.
* Akses DB hanya lewat Supabase client/RPC berparameter; **jangan** menulis SQL dengan interpolasi string.
* Jangan pernah menaruh `service_role` key atau kunci LLM di kode klien atau variabel `NEXT_PUBLIC_*`.
* Setiap tabel baru: tulis RLS di migrasi yang sama.
* Jangan menambah dependensi besar tanpa alasan; periksa dampaknya pada ukuran bundle.
* Jangan membuat klaim medis; semua keluaran hasil tes/chatbot memuat *disclaimer*.

**Variabel lingkungan (contoh):**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server only
UPSTASH_REDIS_REST_URL=           # server only
UPSTASH_REDIS_REST_TOKEN=         # server only
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=             # server only
LLM_API_KEY=                      # server only
```

**Definition of Done (per fitur/PR):**
- [ ] Memenuhi kriteria penerimaan pada PRD.
- [ ] Dapat dioperasikan dengan keyboard saja dan dibacakan dengan screen reader.
- [ ] Lolos axe tanpa pelanggaran *critical/serious*; informasi tidak bergantung warna.
- [ ] Input divalidasi server-side; RLS ditulis dan diuji untuk tabel terkait.
- [ ] Responsif pada lebar 360 px; tidak ada galat konsol.
- [ ] Teks UI Bahasa Indonesia; *disclaimer* medis hadir bila relevan.
- [ ] Dokumentasi singkat/komentar pada logika non-trivial.

## Lampiran A – Catatan Awal Tim (dari draf)

* Informasi kesehatan: situs Kemenkes + sumber tambahan *[konfirmasi]*.
* Kesehatan mental: tampilan frontend berdasarkan psikologis, rujukan: https://ejournal2.unud.ac.id/index.php/jnatia/en/article/view/1468/1108
* Disabilitas: fitur talkback wajib; mode getaran untuk tunanetra dan tunarungu; mode buta warna.
* Tech stack awal: Next.js, Figma, Supabase.

## Lampiran B – Referensi

* WCAG 2.2: https://www.w3.org/TR/WCAG22/
* Supabase (Auth, RLS, Realtime): https://supabase.com/docs
* Web Speech API, Vibration API, WebAuthn: MDN Web Docs
* UU No. 8 Tahun 2016 (Penyandang Disabilitas); UU No. 27 Tahun 2022 (Pelindungan Data Pribadi)
* Instrumen: PHQ-9, GAD-7 (bebas digunakan), IPIP (domain publik), DASS-21 (bebas digunakan untuk non-komersial)