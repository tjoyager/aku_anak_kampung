import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import { TalkbackProvider } from "./Talkback";
import { DoctorSection } from "./Dokter";
import { Chatbot } from "./Chatbot";
import { RumahSakit } from "./RumahSakit";
import { TesMental } from "./TesMental";
import { Konsultasi } from "./Konsultasi";
import { Profil } from "./Profil";
import { Pengaturan } from "./Pengaturan";
import { useShakeDetection } from "./hooks/useShakeDetection";
import Landing from "./pages/Landing";
import AuthScreen from "./pages/AuthScreen";
import InformasiDetail from "./pages/InformasiDetail";
import { A11yWidget } from "./components/A11yWidget";

export type View =
  | "landing"
  | "login"
  | "register"
  | "forgot"
  | "update_password"
  | "dashboard"
  | "tes_mental"
  | "chat"
  | "informasi_detail"
  | "profil"
  | "pengaturan"
  | "lokasi"
  | "chatbot";

type IconName =
  | "home" | "heart" | "calendar" | "message" | "book" | "settings"
  | "bell" | "search" | "hospital" | "brain" | "doctor" | "ambulance"
  | "arrow" | "shield" | "clock" | "phone" | "close" | "volume"
  | "location" | "lock" | "bot" | "user";

const paths: Record<IconName, React.ReactNode> = {
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /><path d="M8 9h8M8 13h5" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.4 3.1a7 7 0 0 0-1.7 1L5 6.1 3 9.5 5.1 11a7 7 0 0 0 0 2L3 14.5 5 18l2.4-1a7 7 0 0 0 1.7 1l.4 3h5l.4-3a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2.1-1.5a7 7 0 0 0 .1-1Z" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  hospital: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M12 7v8M8 11h8M7 21v-3h10v3" /></>,
  brain: <><path d="M9.5 4.5A3 3 0 0 0 6 7.4a3 3 0 0 0-1 5.8A3.5 3.5 0 0 0 9 18.8V4.5ZM14.5 4.5A3 3 0 0 1 18 7.4a3 3 0 0 1 1 5.8 3.5 3.5 0 0 1-4 5.6V4.5Z" /><path d="M9 9H7M15 9h2M9 14H7M15 14h2" /></>,
  doctor: <><circle cx="12" cy="7" r="4" /><path d="M4 21a8 8 0 0 1 16 0M18 13v5M15.5 15.5h5" /></>,
  ambulance: <><path d="M3 17V6h11v11M14 10h4l3 4v3h-2M5 17h10M8 8v5M5.5 10.5h5" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  volume: <><path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" /></>,
  location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  bot: <><rect x="4" y="7" width="16" height="13" rx="3" /><path d="M12 3v4M8 12h.01M16 12h.01M8 16h8" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <button className={`brand ${light ? "light" : ""}`} aria-label="Aku Care, kembali ke beranda">
      <span className="brand-mark"><Icon name="heart" size={21} /></span>
      <span><strong>Aku Care</strong><small>Layanan kesehatan inklusif</small></span>
    </button>
  );
}

const publicArticles = [
  { type: "Edukasi Kesehatan", title: "Langkah sederhana menjaga kesehatan mental setiap hari", summary: "Kenali kebiasaan yang membantu menjaga kesehatan emosi dan kapan perlu menghubungi tenaga profesional.", source: "Sumber: Kementerian Kesehatan RI", date: "8 Nov 2026", theme: "mental" },
  { type: "Pertolongan Pertama", title: "Panduan awal menghadapi kondisi pingsan", summary: "Pelajari langkah aman yang dapat dilakukan sembari menunggu bantuan tenaga kesehatan.", source: "Sumber: Kementerian Kesehatan RI", date: "6 Nov 2026", theme: "firstaid" },
  { type: "Gizi", title: "Memahami pola gizi seimbang untuk keluarga", summary: "Ringkasan praktis mengenai variasi makanan, porsi, dan kebiasaan makan sehat.", source: "Sumber: Kementerian Kesehatan RI", date: "4 Nov 2026", theme: "nutrition" },
];

const dashboardServices: { icon: IconName; title: string; text: string; tag?: string }[] = [
  { icon: "hospital", title: "Rumah Sakit Terdekat", text: "Peta dan daftar layanan di sekitar Anda" },
  { icon: "ambulance", title: "Panggil Ambulans", text: "Permintaan penjemputan terdekat", tag: "Simulasi" },
  { icon: "brain", title: "Tes Kesehatan Mental", text: "PHQ-9, GAD-7, DASS-21, dan Big Five" },
  { icon: "doctor", title: "Konsultasi Dokter", text: "Pesan langsung dengan dokter terverifikasi" },
  { icon: "bot", title: "Chatbot Pendamping", text: "Informasi umum dan panduan aplikasi" },
  { icon: "book", title: "Informasi Kesehatan", text: "Artikel terkurasi dari sumber kredibel" },
];

/* ============================================================
   DASHBOARD
   ============================================================ */
function Dashboard({ go, user }: { go: (view: View) => void; user: User }) {
  const [voice, setVoice] = useState(false);
  const [sos, setSos] = useState(false);
  const [notice, setNotice] = useState("");
  const [dyslexic, setDyslexic] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);
  const [shakeModalOpen, setShakeModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const displayName = (meta.full_name as string) || (meta.username as string) || user.email || "Budi Pratama";
  const firstName = displayName.split(" ")[0];
  const initials = displayName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "BP";

  useEffect(() => {
    if (dyslexic) {
      document.body.classList.add("font-dyslexic");
    } else {
      document.body.classList.remove("font-dyslexic");
    }
    return () => {
      document.body.classList.remove("font-dyslexic");
    };
  }, [dyslexic]);

  useEffect(() => {
    return () => {
      document.body.classList.remove("large-text");
    };
  }, []);

  const toggleDyslexic = () => {
    setDyslexic((prev) => !prev);
  };

  const toggleLargeText = () => {
    setLargeText((prev) => {
      const next = !prev;
      document.body.classList.toggle("large-text", next);
      return next;
    });
  };

  const toggleVibration = () => {
    setVibrationEnabled((prev) => {
      const next = !prev;
      if (next && "vibrate" in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      return next;
    });
  };

  useShakeDetection(() => {
    if (!shakeModalOpen && !sos) {
      setCountdown(3);
      setShakeModalOpen(true);
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  });

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (shakeModalOpen) {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown((c) => c - 1);
        }, 1000);
      } else {
        setShakeModalOpen(false);
        setSos(true);
        setNotice("Panggilan darurat SOS diaktifkan otomatis via deteksi guncangan!");
      }
    }
    return () => clearTimeout(timer);
  }, [shakeModalOpen, countdown]);

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
        const utterance = new SpeechSynthesisUtterance("Mode suara aktif. Anda berada di dasbor Aku Care.");
        utterance.lang = "id-ID";
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    go("landing");
  };

  return (
    <TalkbackProvider voiceModeActive={voice}>
      <div className="dashboard">
        <a className="skip-link" href="#dashboard-main">Lewati ke konten utama</a>
        <aside className="dash-sidebar">
          <Brand />
          <nav>
            <span>MENU UTAMA</span>
            {[["home", "Beranda"], ["phone", "Darurat"], ["brain", "Tes Kesehatan"], ["message", "Konsultasi"], ["book", "Informasi"]].map(([icon, label], index) => (
              <button
                className={index === 0 ? "active" : ""}
                key={label}
                onClick={() => {
                  if (index === 0) window.scrollTo({ top: 0, behavior: "smooth" });
                  else if (index === 1) setSos(true);
                  else if (index === 2) go("tes_mental");
                  else if (index === 3) go("chat");
                  else if (index === 4) go("informasi_detail");
                  else setNotice(`${label} dibuka`);
                }}
              >
                <Icon name={icon as IconName} /> {label}
              </button>
            ))}
            <span>PENGELOLAAN</span>
            <button onClick={() => go("profil")}><Icon name="user" /> Profil & Info Medis</button>
            <button onClick={() => go("pengaturan")}><Icon name="settings" /> Pengaturan</button>
          </nav>
          <div className="dash-profile">
            <div className="dash-avatar">{initials}</div>
            <span><strong>{displayName}</strong><small>{(meta.username as string) || "Pengguna"}</small></span>
            <button onClick={handleLogout}>Keluar</button>
          </div>
        </aside>
        <div className="dash-content">
          <header className="dash-topbar">
            <div className="dash-mobile-brand"><Brand /></div>
            <label className="dash-search">
              <Icon name="search" size={18} />
              <input
                placeholder="Cari layanan atau informasi"
                aria-label="Cari layanan atau informasi"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    go("informasi_detail");
                  }
                }}
              />
            </label>
            <div>
              <button className={`voice-toggle ${voice ? "active" : ""}`} onClick={toggleVoice}>
                <Icon name="volume" size={17} /> {voice ? "Suara aktif" : "Mode suara"}
              </button>
              <button className="icon-only" aria-label="Notifikasi" onClick={() => setNotice("Belum ada notifikasi baru")}>
                <Icon name="bell" />
              </button>
              <div className="dash-avatar">{initials}</div>
            </div>
          </header>
          <main id="dashboard-main">
            <section className="dash-welcome">
              <div>
                <span>KAMIS, 8 NOVEMBER 2026</span>
                <h1>Selamat pagi, {firstName}.</h1>
                <p>Akses layanan dan informasi kesehatan Anda dari satu tempat.</p>
              </div>
              <button onClick={() => go("pengaturan")}><Icon name="settings" /> Pengaturan aksesibilitas</button>
            </section>
            <section className="dash-banner">
              <div>
                <span className="banner-label"><Icon name="shield" size={15} /> PENDAMPING KESEHATAN ANDA</span>
                <h2>Layanan kesehatan yang dapat<br />Anda akses secara mandiri.</h2>
                <p>Gunakan skrining kesehatan mental, konsultasi dokter, layanan darurat, dan informasi tepercaya sesuai kebutuhan Anda.</p>
                <button onClick={() => go("chat")}>Mulai konsultasi <Icon name="arrow" size={17} /></button>
              </div>
              <img src="/fitur-1.jpg" alt="Dokter profesional Aku Care" />
            </section>
            <div className="dash-layout">
              <div className="dash-primary">
                <section>
                  <div className="dash-section-title">
                    <div><h2>Layanan utama</h2><p>Seluruh layanan tersedia untuk akun Anda</p></div>
                    <span className="unlocked"><Icon name="shield" size={14} /> Akses aktif</span>
                  </div>
                  <div className="dash-service-grid">
                    {dashboardServices.map((service) => (
                      <button 
                        key={service.title} 
                        onClick={() => {
                          if (service.icon === "hospital") {
                            go("lokasi");
                          } else if (service.icon === "ambulance") {
                            setSos(true);
                          } else if (service.icon === "brain") {
                            go("tes_mental");
                          } else if (service.icon === "doctor") {
                            go("chat");
                          } else if (service.icon === "bot") {
                            go("chatbot");
                          } else if (service.icon === "book") {
                            go("informasi_detail");
                          } else {
                            go("informasi_detail");
                          }
                        }}
                      >
                        <span className={`dash-service-icon ${service.icon}`}><Icon name={service.icon} size={23} /></span>
                        <span><strong>{service.title} {service.tag && <em>{service.tag}</em>}</strong><small>{service.text}</small></span>
                        <Icon name="arrow" size={16} />
                      </button>
                    ))}
                  </div>
                </section>
                <section className="dash-articles">
                  <div className="dash-section-title">
                    <div><h2>Informasi pilihan</h2><p>Ringkasan terbaru dari sumber kesehatan kredibel</p></div>
                    <button onClick={() => go("informasi_detail")}>Lihat semua <Icon name="arrow" size={15} /></button>
                  </div>
                  <div className="dash-article-grid">
                    {publicArticles.map((article) => (
                      <article key={article.title}>
                        <span>{article.type}</span><h3>{article.title}</h3><p>{article.source}</p>
                        <button onClick={() => go("informasi_detail")}>Baca artikel <Icon name="arrow" size={14} /></button>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
              <aside className="dash-aside">
                <section className="screening-card">
                  <div className="aside-title"><div><h2>Riwayat skrining</h2><p>Hasil tersimpan pribadi</p></div><Icon name="brain" /></div>
                  <div className="empty-record">
                    <span><Icon name="book" /></span><strong>Belum ada hasil tes</strong><p>Mulai skrining awal untuk memantau kondisi kesehatan mental Anda.</p>
                    <button onClick={() => go("tes_mental")}>Lihat katalog tes</button>
                  </div>
                  <small>Hasil skrining bukan diagnosis medis.</small>
                </section>
                <DoctorSection
                  voiceModeActive={voice} 
                  onOpenChat={() => go("chat")} 
                />
                <section className="access-quick">
                  <div className="aside-title"><div><h2>Aksesibilitas cepat</h2><p>Sesuaikan pengalaman Anda</p></div></div>
                  <label>
                    <span><Icon name="volume" size={17} /> Mode suara</span>
                    <button role="switch" aria-checked={voice} className={`switch ${voice ? "on" : ""}`} onClick={toggleVoice}><i /></button>
                  </label>
                  <label>
                    <span><Icon name="settings" size={17} /> Teks besar</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={largeText}
                      className={`switch ${largeText ? "on" : ""}`}
                      onClick={toggleLargeText}
                    >
                      <i />
                    </button>
                  </label>
                  <label>
                    <span><Icon name="bell" size={17} /> Mode getaran</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={vibrationEnabled}
                      className={`switch ${vibrationEnabled ? "on" : ""}`}
                      onClick={toggleVibration}
                    >
                      <i />
                    </button>
                  </label>
                  <label>
                    <span><Icon name="book" size={17} /> Font Ramah Disleksia</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={dyslexic}
                      className={`switch ${dyslexic ? "on" : ""}`}
                      onClick={toggleDyslexic}
                    >
                      <i />
                    </button>
                  </label>
                  <label>
                    <span><Icon name="settings" size={17} /> Mode buta warna</span>
                    <button className="access-select" onClick={() => go("pengaturan")}>Normal</button>
                  </label>
                  <button className="access-more" onClick={() => go("pengaturan")}>Lihat semua pengaturan</button>
                </section>
              </aside>
            </div>
          </main>
        </div>
        <button className="sos-floating" onClick={() => setSos(true)}><Icon name="phone" size={20} /><span><strong>SOS</strong><small>Bantuan darurat</small></span></button>
        {sos && (
          <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSos(false)}>
            <section className="sos-modal" role="dialog" aria-modal="true" aria-labelledby="sos-title">
              <button className="modal-close" onClick={() => setSos(false)} aria-label="Tutup"><Icon name="close" /></button>
              <div className="sos-modal-icon"><Icon name="phone" size={28} /></div>
              <p className="modal-kicker">BANTUAN DARURAT</p>
              <h2 id="sos-title">Anda membutuhkan bantuan?</h2>
              <p>Hubungi layanan darurat nasional atau gunakan simulasi ambulans terdekat.</p>
              <div className="emergency-links"><a href="tel:119"><Icon name="phone" /> Telepon 119</a><a href="tel:112"><Icon name="phone" /> Telepon 112</a></div>
              <button
                type="button"
                className="simulation-button"
                onClick={() => {
                  setSos(false);
                  go("lokasi");
                }}
              >
                <Icon name="ambulance" /> Cari ambulans terdekat <span>Simulasi</span>
              </button>
              <small>Untuk kondisi gawat darurat, segera hubungi 119 atau 112.</small>
            </section>
          </div>
        )}
        {shakeModalOpen && (
          <div className="modal-backdrop" style={{ zIndex: 10000 }}>
            <section
              className="sos-modal"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="shake-sos-title"
              style={{
                border: "3px solid #dc2626",
                boxShadow: "0 10px 25px rgba(220, 38, 38, 0.3)",
                textAlign: "center",
                maxWidth: "420px",
              }}
            >
              <div
                className="sos-modal-icon"
                style={{
                  background: "#fee2e2",
                  color: "#dc2626",
                  margin: "0 auto 12px auto",
                  fontSize: "30px",
                }}
              >
                📳
              </div>
              <p className="modal-kicker" style={{ color: "#dc2626", fontWeight: "800" }}>
                DETEKSI GUNCANGAN PERANGKAT
              </p>
              <h2 id="shake-sos-title" style={{ fontSize: "19px", color: "#991b1b", marginBottom: "8px" }}>
                Guncangan Darurat Terdeteksi!
              </h2>
              <p style={{ color: "#475569", margin: "0 0 16px 0", fontSize: "14px" }}>
                Memanggil bantuan darurat dalam:
              </p>
              <div
                style={{
                  fontSize: "52px",
                  fontWeight: "900",
                  color: "#dc2626",
                  margin: "0 0 16px 0",
                  lineHeight: "1",
                }}
              >
                {countdown}
              </div>
              <button
                type="button"
                className="simulation-button"
                onClick={() => setShakeModalOpen(false)}
                style={{
                  background: "#ffffff",
                  color: "#334155",
                  border: "2px solid #cbd5e1",
                  width: "100%",
                }}
              >
                ✕ Batal (Bukan Situasi Darurat)
              </button>
            </section>
          </div>
        )}
        <div className={`toast ${notice ? "show" : ""}`} role="status">{notice}</div>
      </div>
    </TalkbackProvider>
  );
}

/* ============================================================
   APP — Session router & listener untuk event reset password
   ============================================================ */
export default function App() {
  const [view, setView] = useState<View>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setSessionLoading(false);
      if (session?.user) setView("dashboard");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "PASSWORD_RECOVERY") {
        setView("update_password");
      } else if (session?.user && view !== "update_password") {
        setView("dashboard");
      } else if (!session?.user) {
        setView((v) => (v === "dashboard" ? "landing" : v));
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [view]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  if (sessionLoading) {
    return (
      <div className="grid place-items-center min-h-screen font-sans text-slate-700 bg-canvas">
        <div className="animate-pulse">Memuat Aku Care...</div>
      </div>
    );
  }

  let content;
  if (
    view === "login" ||
    view === "register" ||
    view === "forgot" ||
    view === "update_password"
  ) {
    content = (
      <AuthScreen
        mode={view}
        go={setView}
        onAuthSuccess={() => setView("dashboard")}
      />
    );
  } else if (view === "dashboard") {
    if (!user) {
      content = (
        <AuthScreen
          mode="login"
          go={setView}
          onAuthSuccess={() => setView("dashboard")}
        />
      );
    } else {
      content = <Dashboard go={setView} user={user} />;
    }
  } else if (view === "tes_mental") {
    content = <TesMental go={setView} />;
  } else if (view === "chat") {
    content = <Konsultasi go={setView} />;
  } else if (view === "lokasi") {
    content = <RumahSakit go={setView} />;
  } else if (view === "chatbot") {
    content = <Chatbot go={setView} />;
  } else if (view === "informasi_detail") {
    content = <InformasiDetail go={setView} />;
  } else if (view === "profil") {
    content = <Profil go={setView} />;
  } else if (view === "pengaturan") {
    content = <Pengaturan go={setView} />;
  } else {
    content = <Landing go={setView} />;
  }

  return (
    <>
      <A11yWidget />
      {content}
    </>
  );
}
