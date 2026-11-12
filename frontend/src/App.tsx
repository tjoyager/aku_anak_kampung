import { type FormEvent, useEffect, useState } from "react";
import doctorPhoto from "./assets/akk-doctor.jpg";

type View = "landing" | "login" | "register" | "dashboard";
type IconName =
  | "home"
  | "heart"
  | "calendar"
  | "message"
  | "book"
  | "settings"
  | "bell"
  | "search"
  | "hospital"
  | "brain"
  | "doctor"
  | "ambulance"
  | "arrow"
  | "shield"
  | "clock"
  | "phone"
  | "close"
  | "volume"
  | "location"
  | "lock"
  | "bot"
  | "user";

const paths: Record<IconName, React.ReactNode> = {
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  message: (
    <>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
      <path d="M8 9h8M8 13h5" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.4 3.1a7 7 0 0 0-1.7 1L5 6.1 3 9.5 5.1 11a7 7 0 0 0 0 2L3 14.5 5 18l2.4-1a7 7 0 0 0 1.7 1l.4 3h5l.4-3a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2.1-1.5a7 7 0 0 0 .1-1Z" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  hospital: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M12 7v8M8 11h8M7 21v-3h10v3" />
    </>
  ),
  brain: (
    <>
      <path d="M9.5 4.5A3 3 0 0 0 6 7.4a3 3 0 0 0-1 5.8A3.5 3.5 0 0 0 9 18.8V4.5ZM14.5 4.5A3 3 0 0 1 18 7.4a3 3 0 0 1 1 5.8 3.5 3.5 0 0 1-4 5.6V4.5Z" />
      <path d="M9 9H7M15 9h2M9 14H7M15 14h2" />
    </>
  ),
  doctor: (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0M18 13v5M15.5 15.5h5" />
    </>
  ),
  ambulance: (
    <>
      <path d="M3 17V6h11v11M14 10h4l3 4v3h-2M5 17h10M8 8v5M5.5 10.5h5" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" />
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  volume: (
    <>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" />
    </>
  ),
  location: (
    <>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  bot: (
    <>
      <rect x="4" y="7" width="16" height="13" rx="3" />
      <path d="M12 3v4M8 12h.01M16 12h.01M8 16h8" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <button className={`brand ${light ? "light" : ""}`} aria-label="AkuCare, kembali ke beranda">
      <span className="brand-mark">
        <Icon name="heart" size={21} />
      </span>
      <span>
        <strong>AkuCare</strong>
        <small>Layanan kesehatan inklusif</small>
      </span>
    </button>
  );
}

const guestServices: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "hospital",
    title: "Lokasi Layanan Kesehatan",
    text: "Temukan rumah sakit dan ambulans terdekat dalam peta dan daftar aksesibel.",
  },
  {
    icon: "brain",
    title: "Tes Kesehatan Mental",
    text: "Skrining awal PHQ-9, GAD-7, DASS-21, dan tes kepribadian Big Five.",
  },
  {
    icon: "doctor",
    title: "Konsultasi Dokter",
    text: "Pesan langsung dengan dokter atau spesialis terverifikasi.",
  },
  {
    icon: "bot",
    title: "Chatbot Pendamping",
    text: "Informasi kesehatan umum dan panduan menggunakan layanan AkuCare.",
  },
  {
    icon: "ambulance",
    title: "Layanan Darurat",
    text: "Akses 119/112, rumah sakit, kontak darurat, dan ambulans simulasi.",
  },
  {
    icon: "user",
    title: "Profil Medis Pribadi",
    text: "Simpan golongan darah, alergi, obat rutin, dan kontak darurat.",
  },
];

const publicArticles = [
  {
    type: "Edukasi Kesehatan",
    title: "Langkah sederhana menjaga kesehatan mental setiap hari",
    summary:
      "Kenali kebiasaan yang membantu menjaga kesehatan emosi dan kapan perlu menghubungi tenaga profesional.",
    source: "Sumber: Kementerian Kesehatan RI",
    date: "8 Nov 2026",
    theme: "mental",
  },
  {
    type: "Pertolongan Pertama",
    title: "Panduan awal menghadapi kondisi pingsan",
    summary:
      "Pelajari langkah aman yang dapat dilakukan sembari menunggu bantuan tenaga kesehatan.",
    source: "Sumber: Kementerian Kesehatan RI",
    date: "6 Nov 2026",
    theme: "firstaid",
  },
  {
    type: "Gizi",
    title: "Memahami pola gizi seimbang untuk keluarga",
    summary: "Ringkasan praktis mengenai variasi makanan, porsi, dan kebiasaan makan sehat.",
    source: "Sumber: Kementerian Kesehatan RI",
    date: "4 Nov 2026",
    theme: "nutrition",
  },
];

function PublicHeader({ go }: { go: (view: View) => void }) {
  return (
    <>
      <div className="gov-strip">
        <div>
          <span>Portal Informasi Kesehatan Inklusif</span>
          <span className="gov-meta">Bahasa Indonesia</span>
          <button>
            <Icon name="volume" size={15} /> Mode Suara
          </button>
          <button>Ukuran Teks A+</button>
        </div>
      </div>
      <header className="public-header">
        <div className="public-header-inner">
          <Brand />
          <nav aria-label="Navigasi publik">
            <a className="home-nav-link" href="#beranda">
              Beranda
            </a>
            <a href="#informasi">Informasi Kesehatan</a>
            <a href="#layanan">Layanan</a>
            <a href="#pengumuman">Pengumuman</a>
            <a href="#tentang">Tentang AkuCare</a>
            <a className="mental-health-nav" href="#kesehatan-mental">
              <Icon name="brain" size={15} /> Kesehatan Mental
            </a>
          </nav>
          <div className="auth-actions">
            <button className="login-link" onClick={() => go("login")}>
              Masuk
            </button>
            <button className="register-cta" onClick={() => go("register")}>
              Daftar
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

function Landing({ go }: { go: (view: View) => void }) {
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const search = (event: FormEvent) => {
    event.preventDefault();
    setNotice(query ? `Menampilkan pencarian untuk “${query}”` : "Masukkan kata kunci pencarian.");
  };
  return (
    <div className="public-page">
      <a className="skip-link" href="#main-public">
        Lewati ke konten utama
      </a>
      <PublicHeader go={go} />
      <main id="main-public">
        <section className="public-hero" id="beranda">
          <div className="public-hero-inner">
            <div className="public-hero-copy">
              <span className="official-label">
                <Icon name="shield" size={16} /> INFORMASI KESEHATAN TERPERCAYA
              </span>
              <h1>
                Sehat, mandiri,
                <br />
                dan setara untuk semua.
              </h1>
              <p>
                AkuCare menghadirkan informasi dan layanan kesehatan yang dirancang agar dapat
                diakses secara mandiri oleh setiap orang.
              </p>
              <form className="hero-search" onSubmit={search}>
                <Icon name="search" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Cari informasi kesehatan"
                  placeholder="Cari topik kesehatan, artikel, atau layanan"
                />
                <button>Cari</button>
              </form>
              <div className="popular-searches">
                <span>Pencarian populer:</span>
                <button onClick={() => setQuery("Kesehatan mental")}>Kesehatan mental</button>
                <button onClick={() => setQuery("Gizi")}>Gizi</button>
                <button onClick={() => setQuery("Pertolongan pertama")}>Pertolongan pertama</button>
              </div>
            </div>
            <div className="public-hero-visual">
              <div className="hero-photo-wrap">
                <img
                  src={doctorPhoto}
                  alt="Dokter profesional yang siap memberikan layanan kesehatan"
                />
              </div>
              <div className="trust-card">
                <Icon name="shield" size={24} />
                <div>
                  <strong>Informasi terkurasi</strong>
                  <span>Bersumber dari institusi kesehatan kredibel</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="emergency-band" aria-label="Akses cepat darurat">
          <div>
            <div>
              <span className="emergency-symbol">
                <Icon name="phone" />
              </span>
              <p>
                <strong>Butuh bantuan darurat?</strong>
                <small>Hubungi layanan kegawatdaruratan nasional</small>
              </p>
            </div>
            <div className="emergency-band-actions">
              <a href="tel:119">Telepon 119</a>
              <a href="tel:112">Telepon 112</a>
            </div>
          </div>
        </section>

        <section className="public-section news-section" id="informasi">
          <div className="section-title-row">
            <div>
              <span className="section-kicker">INFORMASI TERBARU</span>
              <h2>Berita & edukasi kesehatan</h2>
              <p>Ringkasan informasi kesehatan untuk masyarakat dari sumber tepercaya.</p>
            </div>
            <button onClick={() => setNotice("Semua artikel ditampilkan")}>
              Lihat semua informasi <Icon name="arrow" size={17} />
            </button>
          </div>
          <div className="news-layout">
            <article className="featured-news">
              <div className="featured-illustration">
                <div className="health-cross">+</div>
                <div className="figure-circle" />
                <div className="figure-body" />
                <span className="featured-date">8 NOV 2026</span>
              </div>
              <div className="featured-copy">
                <span>Berita Utama</span>
                <h3>Akses kesehatan yang inklusif dimulai dari informasi yang mudah dipahami</h3>
                <p>
                  Pelajari prinsip layanan kesehatan yang setara bagi penyandang disabilitas dan
                  masyarakat umum.
                </p>
                <small>Sumber: Kementerian Kesehatan RI</small>
                <button onClick={() => setNotice("Artikel utama dibuka")}>
                  Baca selengkapnya <Icon name="arrow" size={16} />
                </button>
              </div>
            </article>
            <div className="news-list">
              {publicArticles.map((article) => (
                <article key={article.title}>
                  <div className={`news-thumb ${article.theme}`}>
                    <Icon
                      name={
                        article.theme === "mental"
                          ? "brain"
                          : article.theme === "firstaid"
                            ? "heart"
                            : "book"
                      }
                      size={28}
                    />
                  </div>
                  <div>
                    <span>
                      {article.type} · {article.date}
                    </span>
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                    <small>{article.source}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="public-section announcements" id="pengumuman">
          <div className="announcement-heading">
            <span>
              <Icon name="bell" />
            </span>
            <div>
              <span className="section-kicker">INFORMASI PUBLIK</span>
              <h2>Pengumuman & siaran pers</h2>
            </div>
          </div>
          <div className="announcement-grid">
            <article>
              <span className="doc-type">PENGUMUMAN</span>
              <time>7 November 2026</time>
              <h3>Informasi simulasi layanan ambulans pada versi demonstrasi</h3>
              <p>
                Permintaan dan pergerakan ambulans di AkuCare bersifat simulasi. Untuk kondisi
                darurat nyata, hubungi 119 atau 112.
              </p>
              <button onClick={() => setNotice("Pengumuman dibuka")}>
                Lihat pengumuman <Icon name="arrow" size={15} />
              </button>
            </article>
            <article>
              <span className="doc-type release">SIARAN PERS</span>
              <time>5 November 2026</time>
              <h3>Penguatan akses informasi kesehatan bagi penyandang disabilitas</h3>
              <p>
                Komitmen menghadirkan informasi dalam bentuk teks, suara, visual, dan navigasi yang
                aksesibel.
              </p>
              <button onClick={() => setNotice("Siaran pers dibuka")}>
                Baca siaran pers <Icon name="arrow" size={15} />
              </button>
            </article>
            <aside>
              <strong>Jangan lewatkan informasi terbaru</strong>
              <p>Dapatkan pembaruan artikel dan pengumuman kesehatan di satu tempat.</p>
              <button onClick={() => go("register")}>Buat akun AkuCare</button>
            </aside>
          </div>
        </section>

        <section className="mental-health-section" id="kesehatan-mental">
          <div className="public-section mental-health-inner">
            <div className="mental-health-copy">
              <span className="mental-kicker">
                <Icon name="brain" size={17} /> LAYANAN KESEHATAN MENTAL
              </span>
              <h2>Ruang aman untuk memahami kondisi mental Anda.</h2>
              <p>
                Lakukan skrining awal dengan bahasa yang netral dan tidak menghakimi, pantau
                perkembangan, lalu konsultasikan hasilnya kepada dokter atau psikolog pilihan Anda.
              </p>
              <div className="mental-actions">
                <button className="mental-primary" onClick={() => go("login")}>
                  Akses layanan kesehatan mental <Icon name="arrow" size={17} />
                </button>
                <button
                  className="mental-secondary"
                  onClick={() => setNotice("Informasi tes kesehatan mental dibuka")}
                >
                  Pelajari jenis tes
                </button>
              </div>
              <small>
                Hasil tes merupakan skrining awal, bukan diagnosis atau pengganti penilaian
                profesional.
              </small>
            </div>
            <div className="mental-service-panel">
              <div className="mental-panel-head">
                <span>
                  <Icon name="shield" size={16} /> Privat & terkendali
                </span>
                <span className="mental-lock">
                  <Icon name="lock" size={12} /> Perlu masuk
                </span>
              </div>
              <div className="mental-options">
                <article>
                  <span className="mental-option-icon">
                    <Icon name="brain" size={21} />
                  </span>
                  <div>
                    <strong>Skrining terstandar</strong>
                    <p>PHQ-9, GAD-7, DASS-21, dan kepribadian Big Five.</p>
                  </div>
                </article>
                <article>
                  <span className="mental-option-icon">
                    <Icon name="book" size={21} />
                  </span>
                  <div>
                    <strong>Riwayat & perkembangan</strong>
                    <p>Simpan hasil dan bagikan kepada dokter hanya dengan izin Anda.</p>
                  </div>
                </article>
                <article>
                  <span className="mental-option-icon">
                    <Icon name="message" size={21} />
                  </span>
                  <div>
                    <strong>Konsultasi profesional</strong>
                    <p>Terhubung melalui pesan teks dengan dokter atau psikolog.</p>
                  </div>
                </article>
              </div>
              <div className="crisis-note">
                <Icon name="phone" size={18} />
                <p>
                  <strong>Butuh bantuan segera?</strong>
                  <span>Hubungi layanan darurat 119 atau 112.</span>
                </p>
                <div>
                  <a href="tel:119">119</a>
                  <a href="tel:112">112</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="services-preview" id="layanan">
          <div className="public-section">
            <div className="section-title-row centered">
              <div>
                <span className="section-kicker">LAYANAN AkuCare</span>
                <h2>Satu akses untuk kebutuhan kesehatan Anda</h2>
                <p>Masuk atau daftar untuk menggunakan layanan personal dengan aman.</p>
              </div>
            </div>
            <div className="locked-grid">
              {guestServices.map((service) => (
                <article key={service.title} className="locked-service">
                  <div className="locked-top">
                    <span className="service-symbol">
                      <Icon name={service.icon} size={25} />
                    </span>
                    <span className="lock-badge">
                      <Icon name="lock" size={13} /> Perlu masuk
                    </span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <button onClick={() => go("login")}>
                    Masuk untuk mengakses <Icon name="arrow" size={15} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="accessibility-public" id="tentang">
          <div className="public-section">
            <div className="access-copy">
              <span className="section-kicker">AKSESIBILITAS SEBAGAI FONDASI</span>
              <h2>Dirancang untuk digunakan secara mandiri.</h2>
              <p>
                AkuCare mendukung mode suara, getaran dengan indikator visual, pilihan mode buta
                warna, kontras tinggi, ukuran teks, dan navigasi keyboard.
              </p>
              <button onClick={() => setNotice("Panduan aksesibilitas dibuka")}>
                Pelajari fitur aksesibilitas
              </button>
            </div>
            <div className="access-features">
              <div>
                <Icon name="volume" />
                <span>
                  <strong>Mode Suara</strong>
                  <small>Panduan berbahasa Indonesia</small>
                </span>
              </div>
              <div>
                <Icon name="settings" />
                <span>
                  <strong>Tampilan Adaptif</strong>
                  <small>Warna, kontras, dan teks</small>
                </span>
              </div>
              <div>
                <Icon name="shield" />
                <span>
                  <strong>Informasi Multikanal</strong>
                  <small>Teks, visual, suara, dan getaran</small>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="public-footer">
        <div>
          <Brand light />
          <p>Platform kesehatan inklusif untuk masyarakat Indonesia.</p>
          <nav>
            <a href="#informasi">Informasi Kesehatan</a>
            <a href="#layanan">Layanan</a>
            <a href="#pengumuman">Pengumuman</a>
            <a href="#tentang">Aksesibilitas</a>
          </nav>
          <small>
            AkuCare · Informasi pada situs ini bukan pengganti diagnosis atau konsultasi tenaga
            medis.
          </small>
        </div>
      </footer>
      <div className={`toast ${notice ? "show" : ""}`} role="status">
        {notice}
      </div>
    </div>
  );
}

function AuthScreen({ mode, go }: { mode: "login" | "register"; go: (view: View) => void }) {
  const isRegister = mode === "register";
  const [showPassword, setShowPassword] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    go("dashboard");
  };
  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <button className="auth-back" onClick={() => go("landing")}>
          <Icon name="arrow" size={17} /> Kembali ke beranda
        </button>
        <Brand light />
        <div className="auth-message">
          <span className="official-label">
            <Icon name="shield" size={15} /> LAYANAN KESEHATAN INKLUSIF
          </span>
          <h1>Kesehatan dalam jangkauan Anda.</h1>
          <p>
            Akses layanan kesehatan, skrining mental, konsultasi dokter, dan bantuan darurat dalam
            satu platform yang aksesibel.
          </p>
          <ul>
            <li>
              <Icon name="shield" size={18} /> Data kesehatan dilindungi dan hanya Anda yang
              mengendalikan aksesnya
            </li>
            <li>
              <Icon name="volume" size={18} /> Mendukung mode suara dan pengaturan tampilan adaptif
            </li>
            <li>
              <Icon name="message" size={18} /> Konsultasi teks dengan dokter terverifikasi
            </li>
          </ul>
        </div>
        <small>Informasi medis di AkuCare bukan pengganti diagnosis profesional.</small>
      </section>
      <section className="auth-form-panel">
        <div className="auth-mobile-brand">
          <Brand />
        </div>
        <div className="auth-form-wrap">
          <span className="auth-step">
            {isRegister ? "BUAT AKUN BARU" : "SELAMAT DATANG KEMBALI"}
          </span>
          <h2>{isRegister ? "Daftar ke AkuCare" : "Masuk ke akun Anda"}</h2>
          <p>
            {isRegister
              ? "Lengkapi data berikut untuk memulai."
              : "Gunakan akun yang telah terdaftar."}
          </p>
          <button className="google-button" onClick={() => go("dashboard")}>
            <span>G</span> Lanjutkan dengan Google
          </button>
          <div className="divider">
            <span>atau dengan email</span>
          </div>
          <form onSubmit={submit}>
            {isRegister && (
              <label>
                Nama lengkap
                <input required placeholder="Masukkan nama lengkap" autoComplete="name" />
              </label>
            )}
            <label>
              Alamat email
              <input required type="email" placeholder="nama@email.com" autoComplete="email" />
            </label>
            <label>
              Kata sandi
              <div className="password-field">
                <input
                  required
                  minLength={10}
                  type={showPassword ? "text" : "password"}
                  placeholder={isRegister ? "Minimal 10 karakter" : "Masukkan kata sandi"}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Sembunyikan" : "Lihat"}
                </button>
              </div>
            </label>
            {!isRegister && (
              <div className="form-options">
                <label>
                  <input type="checkbox" /> Ingat saya
                </label>
                <button type="button">Lupa kata sandi?</button>
              </div>
            )}
            {isRegister && (
              <label className="consent">
                <input required type="checkbox" />
                <span>
                  Saya menyetujui pemrosesan data pribadi untuk penyediaan layanan AkuCare dan
                  telah membaca Kebijakan Privasi.
                </span>
              </label>
            )}
            <button className="auth-submit" type="submit">
              {isRegister ? "Daftar sekarang" : "Masuk"} <Icon name="arrow" size={17} />
            </button>
          </form>
          <p className="auth-switch">
            {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
            <button onClick={() => go(isRegister ? "login" : "register")}>
              {isRegister ? "Masuk" : "Daftar sekarang"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

const dashboardServices: { icon: IconName; title: string; text: string; tag?: string }[] = [
  {
    icon: "hospital",
    title: "Rumah Sakit Terdekat",
    text: "Peta dan daftar layanan di sekitar Anda",
  },
  {
    icon: "ambulance",
    title: "Panggil Ambulans",
    text: "Permintaan penjemputan terdekat",
    tag: "Simulasi",
  },
  { icon: "brain", title: "Tes Kesehatan Mental", text: "PHQ-9, GAD-7, DASS-21, dan Big Five" },
  {
    icon: "doctor",
    title: "Konsultasi Dokter",
    text: "Pesan langsung dengan dokter terverifikasi",
  },
  { icon: "bot", title: "Chatbot Pendamping", text: "Informasi umum dan panduan aplikasi" },
  { icon: "book", title: "Informasi Kesehatan", text: "Artikel terkurasi dari sumber kredibel" },
];

function Dashboard({ go }: { go: (view: View) => void }) {
  const [voice, setVoice] = useState(false);
  const [sos, setSos] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2800);
    return () => clearTimeout(timeout);
  }, [notice]);
  const toggleVoice = () => {
    const next = !voice;
    setVoice(next);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (next) {
        const utterance = new SpeechSynthesisUtterance(
          "Mode suara aktif. Anda berada di dasbor AkuCare.",
        );
        utterance.lang = "id-ID";
        window.speechSynthesis.speak(utterance);
      }
    }
  };
  return (
    <div className="dashboard">
      <a className="skip-link" href="#dashboard-main">
        Lewati ke konten utama
      </a>
      <aside className="dash-sidebar">
        <Brand />
        <nav>
          <span>MENU UTAMA</span>
          {[
            ["home", "Beranda"],
            ["phone", "Darurat"],
            ["brain", "Tes Kesehatan"],
            ["message", "Konsultasi"],
            ["book", "Informasi"],
          ].map(([icon, label], index) => (
            <button
              className={index === 0 ? "active" : ""}
              key={label}
              onClick={() => (index === 1 ? setSos(true) : setNotice(`${label} dibuka`))}
            >
              <Icon name={icon as IconName} />
              {label}
            </button>
          ))}
          <span>PENGELOLAAN</span>
          <button onClick={() => setNotice("Profil medis dibuka")}>
            <Icon name="user" />
            Profil & Info Medis
          </button>
          <button onClick={() => setNotice("Pengaturan aksesibilitas dibuka")}>
            <Icon name="settings" />
            Pengaturan
          </button>
        </nav>
        <div className="dash-profile">
          <div className="dash-avatar">BP</div>
          <span>
            <strong>Budi Pratama</strong>
            <small>Pengguna</small>
          </span>
          <button onClick={() => go("landing")}>Keluar</button>
        </div>
      </aside>
      <div className="dash-content">
        <header className="dash-topbar">
          <div className="dash-mobile-brand">
            <Brand />
          </div>
          <label className="dash-search">
            <Icon name="search" size={18} />
            <input
              placeholder="Cari layanan atau informasi"
              aria-label="Cari layanan atau informasi"
            />
          </label>
          <div>
            <button className={`voice-toggle ${voice ? "active" : ""}`} onClick={toggleVoice}>
              <Icon name="volume" size={17} />
              {voice ? "Suara aktif" : "Mode suara"}
            </button>
            <button className="icon-only" aria-label="Notifikasi">
              <Icon name="bell" />
            </button>
            <div className="dash-avatar">BP</div>
          </div>
        </header>
        <main id="dashboard-main">
          <section className="dash-welcome">
            <div>
              <span>KAMIS, 8 NOVEMBER 2026</span>
              <h1>Selamat pagi, Budi.</h1>
              <p>Akses layanan dan informasi kesehatan Anda dari satu tempat.</p>
            </div>
            <button onClick={() => setNotice("Pengaturan cepat dibuka")}>
              <Icon name="settings" /> Pengaturan aksesibilitas
            </button>
          </section>
          <section className="dash-banner">
            <div>
              <span className="banner-label">
                <Icon name="shield" size={15} /> PENDAMPING KESEHATAN ANDA
              </span>
              <h2>
                Layanan kesehatan yang dapat
                <br />
                Anda akses secara mandiri.
              </h2>
              <p>
                Gunakan skrining kesehatan mental, konsultasi dokter, layanan darurat, dan informasi
                tepercaya sesuai kebutuhan Anda.
              </p>
              <button onClick={() => setNotice("Direktori dokter dibuka")}>
                Mulai konsultasi <Icon name="arrow" size={17} />
              </button>
            </div>
            <img src={doctorPhoto} alt="Dokter profesional AkuCare" />
          </section>
          <div className="dash-layout">
            <div className="dash-primary">
              <section>
                <div className="dash-section-title">
                  <div>
                    <h2>Layanan utama</h2>
                    <p>Seluruh layanan tersedia untuk akun Anda</p>
                  </div>
                  <span className="unlocked">
                    <Icon name="shield" size={14} /> Akses aktif
                  </span>
                </div>
                <div className="dash-service-grid">
                  {dashboardServices.map((service) => (
                    <button
                      key={service.title}
                      onClick={() =>
                        service.icon === "ambulance"
                          ? setSos(true)
                          : setNotice(`${service.title} dibuka`)
                      }
                    >
                      <span className={`dash-service-icon ${service.icon}`}>
                        <Icon name={service.icon} size={23} />
                      </span>
                      <span>
                        <strong>
                          {service.title}
                          {service.tag && <em>{service.tag}</em>}
                        </strong>
                        <small>{service.text}</small>
                      </span>
                      <Icon name="arrow" size={16} />
                    </button>
                  ))}
                </div>
              </section>
              <section className="dash-articles">
                <div className="dash-section-title">
                  <div>
                    <h2>Informasi pilihan</h2>
                    <p>Ringkasan terbaru dari sumber kesehatan kredibel</p>
                  </div>
                  <button onClick={() => setNotice("Semua informasi dibuka")}>
                    Lihat semua <Icon name="arrow" size={15} />
                  </button>
                </div>
                <div className="dash-article-grid">
                  {publicArticles.map((article) => (
                    <article key={article.title}>
                      <span>{article.type}</span>
                      <h3>{article.title}</h3>
                      <p>{article.source}</p>
                      <button onClick={() => setNotice("Artikel dibuka")}>
                        Baca artikel <Icon name="arrow" size={14} />
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            </div>
            <aside className="dash-aside">
              <section className="screening-card">
                <div className="aside-title">
                  <div>
                    <h2>Riwayat skrining</h2>
                    <p>Hasil tersimpan pribadi</p>
                  </div>
                  <Icon name="brain" />
                </div>
                <div className="empty-record">
                  <span>
                    <Icon name="book" />
                  </span>
                  <strong>Belum ada hasil tes</strong>
                  <p>Mulai skrining awal untuk memantau kondisi kesehatan mental Anda.</p>
                  <button onClick={() => setNotice("Katalog tes dibuka")}>Lihat katalog tes</button>
                </div>
                <small>Hasil skrining bukan diagnosis medis.</small>
              </section>
              <section className="consult-card">
                <div className="aside-title">
                  <div>
                    <h2>Konsultasi aktif</h2>
                    <p>Pesan dengan dokter</p>
                  </div>
                  <span className="online-status">Tersedia</span>
                </div>
                <div className="doctor-item">
                  <div className="doctor-avatar">DR</div>
                  <div>
                    <strong>dr. Ratna Wijaya, Sp.KJ</strong>
                    <span>Spesialis Kesehatan Jiwa · Akun demo</span>
                  </div>
                </div>
                <button onClick={() => setNotice("Ruang pesan dibuka")}>
                  <Icon name="message" size={17} /> Buka ruang pesan
                </button>
                <small>Konsultasi daring tidak untuk kondisi darurat.</small>
              </section>
              <section className="access-quick">
                <div className="aside-title">
                  <div>
                    <h2>Aksesibilitas cepat</h2>
                    <p>Sesuaikan pengalaman Anda</p>
                  </div>
                </div>
                <label>
                  <span>
                    <Icon name="volume" size={17} /> Mode suara
                  </span>
                  <button
                    role="switch"
                    aria-checked={voice}
                    className={`switch ${voice ? "on" : ""}`}
                    onClick={toggleVoice}
                  >
                    <i />
                  </button>
                </label>
                <label>
                  <span>
                    <Icon name="settings" size={17} /> Teks besar
                  </span>
                  <button
                    role="switch"
                    aria-checked="false"
                    className="switch"
                    onClick={() => setNotice("Mode teks besar siap diterapkan")}
                  >
                    <i />
                  </button>
                </label>
                <label>
                  <span>
                    <Icon name="bell" size={17} /> Mode getaran
                  </span>
                  <button
                    role="switch"
                    aria-checked="false"
                    className="switch"
                    onClick={() => setNotice("Mode getaran siap diterapkan")}
                  >
                    <i />
                  </button>
                </label>
                <label>
                  <span>
                    <Icon name="settings" size={17} /> Mode buta warna
                  </span>
                  <button
                    className="access-select"
                    onClick={() => setNotice("Pilihan mode warna dibuka")}
                  >
                    Normal
                  </button>
                </label>
                <button
                  className="access-more"
                  onClick={() => setNotice("Semua pengaturan dibuka")}
                >
                  Lihat semua pengaturan
                </button>
              </section>
            </aside>
          </div>
        </main>
      </div>
      <button className="sos-floating" onClick={() => setSos(true)}>
        <Icon name="phone" size={20} />
        <span>
          <strong>SOS</strong>
          <small>Bantuan darurat</small>
        </span>
      </button>
      {sos && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && setSos(false)}
        >
          <section
            className="sos-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sos-title"
          >
            <button className="modal-close" onClick={() => setSos(false)} aria-label="Tutup">
              <Icon name="close" />
            </button>
            <div className="sos-modal-icon">
              <Icon name="phone" size={28} />
            </div>
            <p className="modal-kicker">BANTUAN DARURAT</p>
            <h2 id="sos-title">Anda membutuhkan bantuan?</h2>
            <p>Hubungi layanan darurat nasional atau gunakan simulasi ambulans terdekat.</p>
            <div className="emergency-links">
              <a href="tel:119">
                <Icon name="phone" /> Telepon 119
              </a>
              <a href="tel:112">
                <Icon name="phone" /> Telepon 112
              </a>
            </div>
            <button
              className="simulation-button"
              onClick={() => {
                setSos(false);
                setNotice("Simulasi pencarian ambulans dimulai");
              }}
            >
              <Icon name="ambulance" /> Cari ambulans terdekat <span>Simulasi</span>
            </button>
            <small>Untuk kondisi gawat darurat, segera hubungi 119 atau 112.</small>
          </section>
        </div>
      )}
      <div className={`toast ${notice ? "show" : ""}`} role="status">
        {notice}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("landing");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);
  if (view === "login" || view === "register") return <AuthScreen mode={view} go={setView} />;
  if (view === "dashboard") return <Dashboard go={setView} />;
  return <Landing go={setView} />;
}
