import React, { useState } from "react";
import type { View } from "./App";
import { Icon } from "./components/ui/Icons";
import { Brand } from "./components/ui/Brand";

interface PengaturanProps {
  go: (view: View) => void;
}

export function Pengaturan({ go }: PengaturanProps) {
  const [voice, setVoice] = useState(false);
  const [vibrate, setVibrate] = useState(true);
  const [dyslexic, setDyslexic] = useState(() => document.body.classList.contains("font-dyslexic"));
  const [largeText, setLargeText] = useState(() => document.body.classList.contains("large-text"));
  const [colorBlind, setColorBlind] = useState("normal");
  const [notice, setNotice] = useState("");

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => {
      setNotice("");
    }, 3000);
  };

  const toggleVoice = () => {
    const next = !voice;
    setVoice(next);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (next) {
        const u = new SpeechSynthesisUtterance("Mode suara aktif. Panduan aksesibilitas Aku Care siap digunakan.");
        u.lang = "id-ID";
        window.speechSynthesis.speak(u);
      }
    }
    showToast(next ? "Mode Suara diaktifkan (Web Speech API)" : "Mode Suara dinonaktifkan");
  };

  const toggleVibrate = () => {
    const next = !vibrate;
    setVibrate(next);
    if (next && "vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    showToast(next ? "Mode getaran darurat aktif (Haptic feedback diuji)" : "Mode getaran dinonaktifkan");
  };

  const toggleDyslexic = () => {
    const next = !dyslexic;
    setDyslexic(next);
    document.body.classList.toggle("font-dyslexic", next);
    showToast(next ? "Font OpenDyslexic diterapkan" : "Font OpenDyslexic dinonaktifkan");
  };

  const toggleLargeText = () => {
    const next = !largeText;
    setLargeText(next);
    document.body.classList.toggle("large-text", next);
    showToast(next ? "Ukuran teks diperbesar (A+)" : "Ukuran teks kembali normal");
  };

  const handleColorBlindChange = (mode: string) => {
    setColorBlind(mode);
    if (mode === "monokrom") {
      document.documentElement.style.filter = "grayscale(100%)";
    } else if (mode === "protanopia") {
      document.documentElement.style.filter = "hue-rotate(30deg) saturate(120%)";
    } else if (mode === "deuteranopia") {
      document.documentElement.style.filter = "hue-rotate(-30deg) saturate(120%)";
    } else if (mode === "tritanopia") {
      document.documentElement.style.filter = "hue-rotate(180deg) saturate(90%)";
    } else {
      document.documentElement.style.filter = "none";
    }
    showToast(`Filter buta warna diubah: ${mode.toUpperCase()}`);
  };

  const handleReset = () => {
    setVoice(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();

    setVibrate(true);

    setDyslexic(false);
    document.body.classList.remove("font-dyslexic");

    setLargeText(false);
    document.body.classList.remove("large-text");

    setColorBlind("normal");
    document.documentElement.style.filter = "none";

    showToast("Pengaturan aksesibilitas dikembalikan ke setelan awal");
  };

  return (
    <div className="public-page" style={{ minHeight: "100vh", backgroundColor: "#f5f8fc" }}>
      {/* Header */}
      <header className="public-header" style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255, 255, 255, 0.95)", borderBottom: "1px solid #dce6f0", backdropFilter: "blur(8px)" }}>
        <div className="public-header-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div onClick={() => go("dashboard")} style={{ cursor: "pointer" }}>
            <Brand />
          </div>
          <button
            type="button"
            className="login-link"
            onClick={() => go("dashboard")}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
          >
            <span style={{ transform: "rotate(180deg)", display: "inline-block" }}>
              <Icon name="arrow" size={16} />
            </span>
            Kembali ke Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-public" style={{ maxWidth: "760px", margin: "32px auto", padding: "0 20px 60px" }}>
        {/* Breadcrumb Button */}
        <button
          type="button"
          onClick={() => go("dashboard")}
          style={{
            background: "none",
            border: "none",
            color: "#0066cc",
            cursor: "pointer",
            fontWeight: "600",
            marginBottom: "20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: 0,
            fontSize: "14px"
          }}
        >
          <span style={{ transform: "rotate(180deg)", display: "inline-block" }}>
            <Icon name="arrow" size={16} />
          </span>
          Kembali ke Dashboard
        </button>

        {/* Header Card */}
        <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #dce6f0", padding: "24px 28px", marginBottom: "24px", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#eaf4ff", color: "#0066cc", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="settings" size={26} />
            </div>
            <div>
              <span className="doc-type" style={{ marginBottom: "4px", display: "inline-block" }}>AKSESIBILITAS & TAMPILAN</span>
              <h1 style={{ fontSize: "24px", color: "#0f172a", margin: 0, fontWeight: "700" }}>Pengaturan Aksesibilitas</h1>
              <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                Sesuaikan pengalaman visual, audio, dan getaran sesuai kenyamanan Anda (WCAG 2.1 AA).
              </p>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #dce6f0", padding: "8px 24px", boxShadow: "0 2px 6px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column" }}>
          {/* 1. Mode Suara */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", maxWidth: "80%" }}>
              <div style={{ color: "#0066cc", marginTop: "2px" }}>
                <Icon name="volume" size={22} />
              </div>
              <div>
                <strong style={{ fontSize: "16px", color: "#0f172a", display: "block" }}>Mode Suara (Talkback / Web Speech API)</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "13.5px", color: "#64748b", lineHeight: "1.45" }}>
                  Membacakan teks panduan dan konfirmasi status aksi dalam Bahasa Indonesia secara otomatis.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={voice}
              className={`switch ${voice ? "on" : ""}`}
              onClick={toggleVoice}
              style={{ transform: "scale(1.3)", cursor: "pointer" }}
            >
              <i />
            </button>
          </div>

          {/* 2. Mode Getaran Darurat */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", maxWidth: "80%" }}>
              <div style={{ color: "#d93645", marginTop: "2px" }}>
                <Icon name="bell" size={22} />
              </div>
              <div>
                <strong style={{ fontSize: "16px", color: "#0f172a", display: "block" }}>Mode Getaran Darurat (Haptic Feedback)</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "13.5px", color: "#64748b", lineHeight: "1.45" }}>
                  Memberikan getaran fisik pada ponsel saat krisis darurat, tes PHQ-9 butuh bantuan, atau deteksi guncangan.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={vibrate}
              className={`switch ${vibrate ? "on" : ""}`}
              onClick={toggleVibrate}
              style={{ transform: "scale(1.3)", cursor: "pointer" }}
            >
              <i />
            </button>
          </div>

          {/* 3. Font OpenDyslexic */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", maxWidth: "80%" }}>
              <div style={{ color: "#0284c7", marginTop: "2px" }}>
                <Icon name="book" size={22} />
              </div>
              <div>
                <strong style={{ fontSize: "16px", color: "#0f172a", display: "block" }}>Font Ramah Disleksia (OpenDyslexic)</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "13.5px", color: "#64748b", lineHeight: "1.45" }}>
                  Mengaktifkan jenis huruf dengan bobot bagian bawah tebal guna mencegah rotasi huruf dalam persepsi visual.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={dyslexic}
              className={`switch ${dyslexic ? "on" : ""}`}
              onClick={toggleDyslexic}
              style={{ transform: "scale(1.3)", cursor: "pointer" }}
            >
              <i />
            </button>
          </div>

          {/* 4. Ukuran Teks Besar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", maxWidth: "80%" }}>
              <div style={{ color: "#475569", marginTop: "2px" }}>
                <Icon name="settings" size={22} />
              </div>
              <div>
                <strong style={{ fontSize: "16px", color: "#0f172a", display: "block" }}>Ukuran Teks Besar (Ukuran A+)</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "13.5px", color: "#64748b", lineHeight: "1.45" }}>
                  Memperbesar ukuran font seluruh elemen hingga 115% untuk memudahkan pembacaan bagi lansia atau rabun dekat.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={largeText}
              className={`switch ${largeText ? "on" : ""}`}
              onClick={toggleLargeText}
              style={{ transform: "scale(1.3)", cursor: "pointer" }}
            >
              <i />
            </button>
          </div>

          {/* 5. Mode Buta Warna */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", maxWidth: "65%" }}>
              <div style={{ color: "#0d9488", marginTop: "2px" }}>
                <Icon name="shield" size={22} />
              </div>
              <div>
                <strong style={{ fontSize: "16px", color: "#0f172a", display: "block" }}>Mode Buta Warna</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "13.5px", color: "#64748b", lineHeight: "1.45" }}>
                  Sesuaikan palet filter warna untuk tipe penglihatan protanopia, deuteranopia, tritanopia, atau monokrom.
                </p>
              </div>
            </div>
            <div>
              <select
                aria-label="Pilih mode buta warna"
                value={colorBlind}
                onChange={(e) => handleColorBlindChange(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                  color: "#334155",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                <option value="normal">Normal (Bawaan)</option>
                <option value="protanopia">Protanopia (Merah)</option>
                <option value="deuteranopia">Deuteranopia (Hijau)</option>
                <option value="tritanopia">Tritanopia (Biru)</option>
                <option value="monokrom">Monokrom (Grayscale)</option>
              </select>
            </div>
          </div>

          {/* 6. Shake-to-SOS Info */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", maxWidth: "80%" }}>
              <div style={{ color: "#d93645", marginTop: "2px" }}>
                <Icon name="phone" size={22} />
              </div>
              <div>
                <strong style={{ fontSize: "16px", color: "#0f172a", display: "block" }}>Deteksi Guncangan (Shake-to-SOS)</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "13.5px", color: "#64748b", lineHeight: "1.45" }}>
                  Akselerometer aktif mendeteksi guncangan mendadak dan memicu hitung mundur panggilan darurat 119/112.
                </p>
              </div>
            </div>
            <span style={{ fontSize: "12px", fontWeight: "700", background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0", padding: "4px 10px", borderRadius: "99px" }}>
              Aktif Otomatis
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", flexWrap: "wrap", gap: "12px" }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#64748b",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Reset ke Standar
          </button>

          <button
            type="button"
            className="register-cta"
            onClick={() => go("dashboard")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              background: "#0066cc",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Selesai & Kembali ke Dashboard
          </button>
        </div>
      </main>

      {/* Toast Notification */}
      <div className={`toast ${notice ? "show" : ""}`} role="status">
        {notice}
      </div>
    </div>
  );
}
