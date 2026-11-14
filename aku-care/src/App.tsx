import { type FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import { TalkbackProvider } from "./Talkback";
import { DoctorSection } from "./Dokter";
import { Chatbot, ChatbotSheet } from "./Chatbot";
import NearbyHospitalsMap, { RumahSakit } from "./RumahSakit";
import { TesMental } from "./TesMental";
import { Konsultasi } from "./Konsultasi";
import { Profil } from "./Profil";
import { Pengaturan } from "./Pengaturan";
import { useShakeDetection } from "./hooks/useShakeDetection";
import Landing from "./pages/Landing";
import { A11yWidget } from "./components/A11yWidget"; // <-- Import yang hilang

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

/* ============================================================
   INFORMASI DETAIL
   ============================================================ */
function InformasiDetail({ go }: { go: (view: View) => void }) {
  return (
    <div className="public-page">
      <header className="public-header" style={{ borderBottom: "1px solid #dce6f0", position: "sticky", top: 0, background: "rgba(255, 255, 255, 0.95)", zIndex: 10 }}>
        <div className="public-header-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Brand />
          <button 
            className="login-link" 
            onClick={() => go("landing")}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
          >
            <span style={{ transform: "rotate(180deg)", display: "inline-block" }}>
              <Icon name="arrow" size={16} />
            </span>
            Kembali ke Beranda
          </button>
        </div>
      </header>

      <main id="main-public" style={{ maxWidth: "840px", margin: "40px auto", padding: "0 24px", minHeight: "70vh" }}>
        <button
          onClick={() => go("landing")}
          style={{
            background: "none",
            border: "none",
            color: "#0066cc",
            cursor: "pointer",
            fontWeight: "600",
            marginBottom: "24px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: 0
          }}
        >
          <span style={{ transform: "rotate(180deg)", display: "inline-block" }}>
            <Icon name="arrow" size={16} />
          </span>
          Kembali ke Beranda
        </button>

        <article style={{ lineHeight: "1.75", color: "#334155" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
            <span className="doc-type" style={{ margin: 0 }}>EDUKASI KESEHATAN</span>
            <span style={{ color: "#94a3b8" }}>•</span>
            <span style={{ fontSize: "14px", color: "#64748b" }}>8 November 2026</span>
          </div>

          <h1 style={{ fontSize: "28px", color: "#0f172a", marginBottom: "16px", lineHeight: "1.3", fontWeight: "700" }}>
            Akses Kesehatan yang Inklusif Dimulai dari Informasi yang Mudah Dipahami
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "28px" }}>
            <Icon name="shield" size={20} />
            <span style={{ fontSize: "14px", color: "#475569" }}>
              <strong>Sumber Resmi:</strong> Kementerian Kesehatan Republik Indonesia & Pusdatin Kemenkes
            </span>
          </div>

          <p style={{ fontSize: "16px", marginBottom: "18px" }}>
            Kesehatan adalah hak fundamental bagi setiap warga negara tanpa terkecuali. Namun dalam praktiknya, kesenjangan akses informasi kesehatan sering kali menjadi kendala utama bagi kelompok masyarakat rentan, termasuk penyandang disabilitas fisik maupun sensorik, kelompok lansia, dan warga di wilayah pelosok.
          </p>

          <h2 style={{ fontSize: "20px", color: "#0f172a", margin: "28px 0 12px 0", fontWeight: "600" }}>
            Prinsip Layanan Kesehatan yang Setara
          </h2>
          <p style={{ marginBottom: "16px" }}>
            Platform Aku Care dibangun dengan komitmen pemenuhan standar aksesibilitas WCAG (Web Content Accessibility Guidelines) 2.1 level AA dan prinsip desain universal:
          </p>
          <ul style={{ paddingLeft: "24px", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><strong>Mode Suara & Pembaca Layar:</strong> Informasi disajikan dalam teks terstruktur semantik yang ramah pembaca layar (Talkback/Screen Reader) serta sintesis suara bahasa Indonesia.</li>
            <li><strong>Tipografi Ramah Disleksia & Ukuran Teks Fleksibel:</strong> Tersedia opsi pembesaran teks dan font khusus (OpenDyslexic) dengan kontras terukur untuk kemudahan membaca.</li>
            <li><strong>Antarmuka Berkontras Tinggi:</strong> Menjamin teks dan komponen interaktif memiliki rasio kontras warna minimal 4.5:1 agar terbaca jelas oleh individu dengan gangguan penglihatan atau buta warna.</li>
            <li><strong>Aksesibilitas Multikanal & Tanggap Darurat:</strong> Peringatan darurat disalurkan melalui audio, visual (toast/modal), dan getaran haptik (DeviceMotion API).</li>
          </ul>

          <h2 style={{ fontSize: "20px", color: "#0f172a", margin: "28px 0 12px 0", fontWeight: "600" }}>
            Langkah Cepat Tanggap Darurat Medis
          </h2>
          <p style={{ marginBottom: "16px" }}>
            Apabila Anda atau orang di sekitar mengalami kondisi gawat darurat medis, segera gunakan fitur <strong>Layanan Darurat / SOS</strong> pada platform Aku Care atau hubungi nomor darurat nasional:
          </p>
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "18px", marginBottom: "28px" }}>
            <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#dc2626", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icon name="phone" size={18} /> Nomor Kontak Kegawatdaruratan Nasional:
            </p>
            <p style={{ margin: "0 0 8px 0", fontSize: "15px" }}>🚑 <strong>119</strong> — Sistem Penanggulangan Gawat Darurat Terpadu (SPGDT) Kemenkes RI</p>
            <p style={{ margin: "0", fontSize: "15px" }}>🚨 <strong>112</strong> — Layanan Panggilan Darurat Nasional Terpadu</p>
          </div>

          <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => go("landing")}
              className="login-link"
              style={{ padding: "10px 20px" }}
            >
              ← Kembali ke Beranda
            </button>
            <button
              onClick={() => go("tes_mental")}
              className="register-cta"
              style={{ padding: "10px 20px" }}
            >
              Coba Tes Kesehatan Mental (PHQ-9)
            </button>
          </div>
        </article>
      </main>

      <footer className="public-footer">
        <div>
          <Brand light />
          <p>Platform kesehatan inklusif untuk masyarakat Indonesia.</p>
          <small>Aku Care · Informasi pada situs ini bukan pengganti diagnosis atau konsultasi tenaga medis langsung.</small>
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
   AUTH SCREEN — Ditambahkan kembali karena hilang saat merge
   ============================================================ */
function AuthScreen({
  mode,
  go,
  onAuthSuccess,
}: {
  mode: "login" | "register" | "forgot" | "update_password";
  go: (view: View) => void;
  onAuthSuccess: () => void;
}) {
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isUpdate = mode === "update_password";
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Laki-laki");
  const [consent, setConsent] = useState(false);

  const handleGoogle = async () => {
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setErrorMsg(`Gagal login Google: ${error.message}`);
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    if (!consent) {
      setErrorMsg("Anda harus menyetujui pemrosesan data pribadi.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: username.trim(),
          full_name: fullName.trim(),
          phone: phone.trim(),
          dob,
          gender,
        },
      },
    });

    setLoading(false);
    if (error) {
      setErrorMsg(`Gagal mendaftar: ${error.message}`);
      return;
    }
    
    setPassword("");
    setIdentifier(username.trim());
    setSuccessMsg("Pendaftaran berhasil! Silakan masuk dengan kata sandi Anda.");
    go("login");
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      let loginEmail = identifier.trim();

      if (!loginEmail.includes("@")) {
        const { data: resolvedEmail, error: rpcError } = await supabase.rpc(
          "get_email_by_username",
          { p_username: loginEmail }
        );
        if (rpcError || !resolvedEmail) {
          throw new Error("Username tidak ditemukan.");
        }
        loginEmail = resolvedEmail as string;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });
      if (error) throw error;

      onAuthSuccess();
    } catch (err) {
      let message = err instanceof Error ? err.message : "Terjadi kesalahan saat login.";
      if (message.includes("Invalid login credentials")) {
        message = "Email/Username atau kata sandi yang Anda masukkan salah.";
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/`,
    });

    setLoading(false);
    if (error) {
      setErrorMsg(`Gagal mengirim email reset: ${error.message}`);
    } else {
      setSuccessMsg("Tautan reset kata sandi telah dikirim ke email Anda.");
      setEmail("");
    }
  };

  const handleUpdatePassword = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);
    if (error) {
      setErrorMsg(`Gagal memperbarui kata sandi: ${error.message}`);
    } else {
      setSuccessMsg("Kata sandi berhasil diperbarui. Mengalihkan ke dashboard...");
      setTimeout(() => {
        go("dashboard");
      }, 2000);
    }
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
          <p>Akses layanan kesehatan, skrining mental, konsultasi dokter, dan bantuan darurat dalam satu platform yang aksesibel.</p>
        </div>
      </section>
      
      <section className="auth-form-panel">
        <div className="auth-mobile-brand">
          <Brand />
        </div>
        <div className="auth-form-wrap">
          <span className="auth-step">
            {isRegister ? "BUAT AKUN BARU" : isForgot ? "PEMULIHAN AKUN" : isUpdate ? "KATA SANDI BARU" : "SELAMAT DATANG KEMBALI"}
          </span>
          <h2>
            {isRegister ? "Daftar ke Aku Care" : isForgot ? "Lupa Kata Sandi" : isUpdate ? "Atur Kata Sandi Baru" : "Masuk ke akun Anda"}
          </h2>
          <p>
            {isRegister ? "Lengkapi data berikut untuk memulai." : 
             isForgot ? "Masukkan email Anda untuk menerima tautan reset kata sandi." : 
             isUpdate ? "Masukkan kata sandi baru Anda." : 
             "Gunakan email atau username yang telah terdaftar."}
          </p>

          {!isForgot && !isUpdate && (
            <>
              <button className="google-button" type="button" onClick={handleGoogle}>
                <span>G</span> Lanjutkan dengan Google
              </button>
              <div className="divider">
                <span>atau dengan email</span>
              </div>
            </>
          )}

          <form onSubmit={isRegister ? handleRegister : isForgot ? handleResetRequest : isUpdate ? handleUpdatePassword : handleLogin}>
            
            {isForgot && (
              <label>
                Alamat email
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" />
              </label>
            )}

            {isRegister && (
              <>
                <label>Nama lengkap <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Masukkan nama lengkap" /></label>
                <label>Username <input required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Pilih username unik" /></label>
                <label>Nomor telepon <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" /></label>
                <label>Tanggal lahir <input required type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></label>
                <label>Jenis kelamin
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </label>
              </>
            )}

            {!isForgot && !isUpdate && (
              <label>
                {isRegister ? "Alamat email" : "Email atau username"}
                <input
                  required
                  type={isRegister ? "email" : "text"}
                  value={isRegister ? email : identifier}
                  onChange={(e) => isRegister ? setEmail(e.target.value) : setIdentifier(e.target.value)}
                  placeholder={isRegister ? "nama@email.com" : "nama@email.com atau username"}
                />
              </label>
            )}

            {!isForgot && (
              <label>
                Kata sandi
                <div className="password-field">
                  <input
                    required
                    minLength={6} 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isRegister || isUpdate ? "Minimal 6 karakter" : "Masukkan kata sandi"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>
            )}

            {!isRegister && !isForgot && !isUpdate && (
              <div className="form-options">
                <label><input type="checkbox" /> Ingat saya</label>
                <button type="button" onClick={() => { setErrorMsg(""); setSuccessMsg(""); go("forgot"); }}>
                  Lupa kata sandi?
                </button>
              </div>
            )}

            {isRegister && (
              <label className="consent">
                <input required type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>Saya menyetujui pemrosesan data pribadi untuk penyediaan layanan Aku Care dan telah membaca Kebijakan Privasi.</span>
              </label>
            )}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Memproses..." : isRegister ? "Daftar sekarang" : isForgot ? "Kirim tautan reset" : isUpdate ? "Simpan kata sandi baru" : "Masuk"} 
              {!loading && <Icon name="arrow" size={17} />}
            </button>
          </form>

          {errorMsg && <p style={{ color: "#b91c1c", marginTop: 12, fontSize: 14 }} role="alert">{errorMsg}</p>}
          {successMsg && <p style={{ color: "#15803d", marginTop: 12, fontSize: 14 }} role="status">{successMsg}</p>}

          {!isUpdate && (
            <p className="auth-switch">
              {isRegister || isForgot ? "Sudah ingat akun Anda?" : "Belum punya akun?"}{" "}
              <button onClick={() => { setErrorMsg(""); setSuccessMsg(""); go(isRegister || isForgot ? "login" : "register"); }}>
                {isRegister || isForgot ? "Masuk" : "Daftar sekarang"}
              </button>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

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
  const [showChatbot, setShowChatbot] = useState(false);
  const [showMap, setShowMap] = useState(false);
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
    let timer: NodeJS.Timeout;
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
              <button className="icon-only" aria-label="Notifikasi" onClick={() => setNotice("Belum ada notifikasi baru")}><Icon name="bell" /></button>
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
                  setShowMap(true);
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
        {showChatbot && <ChatbotSheet onClose={() => setShowChatbot(false)} />}
        {showMap && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column' }}>
            <header style={{ padding: '16px', backgroundColor: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <button 
                onClick={() => setShowMap(false)} 
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 'bold', padding: 0 }}
              >
                <span style={{ transform: 'rotate(180deg)', display: 'inline-block', marginRight: '8px' }}>
                  <Icon name="arrow" size={20} />
                </span> 
                Kembali
              </button>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Fasilitas Kesehatan Terdekat</h2>
            </header>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <NearbyHospitalsMap />
            </div>
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
      if (event === 'PASSWORD_RECOVERY') {
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
  if (view === "login" || view === "register" || view === "forgot" || view === "update_password") {
    content = <AuthScreen mode={view} go={setView} onAuthSuccess={() => setView("dashboard")} />;
  } else if (view === "dashboard") {
    if (!user) {
      content = <AuthScreen mode="login" go={setView} onAuthSuccess={() => setView("dashboard")} />;
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