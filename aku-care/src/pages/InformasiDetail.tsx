import { Brand } from "../components/ui/Brand";
import { Icon } from "../components/ui/Icons";
import type { View } from "../App";

export default function InformasiDetail({ go }: { go: (view: View) => void }) {
  return (
    <div className="public-page">
      <header
        className="public-header"
        style={{
          borderBottom: "1px solid #dce6f0",
          position: "sticky",
          top: 0,
          background: "rgba(255, 255, 255, 0.95)",
          zIndex: 10,
        }}
      >
        <div
          className="public-header-inner"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Brand />
          <button
            className="login-link"
            onClick={() => go("landing")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <span
              style={{ transform: "rotate(180deg)", display: "inline-block" }}
            >
              <Icon name="arrow" size={16} />
            </span>
            Kembali ke Beranda
          </button>
        </div>
      </header>

      <main
        id="main-public"
        style={{
          maxWidth: "840px",
          margin: "40px auto",
          padding: "0 24px",
          minHeight: "70vh",
        }}
      >
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
            padding: 0,
          }}
        >
          <span
            style={{ transform: "rotate(180deg)", display: "inline-block" }}
          >
            <Icon name="arrow" size={16} />
          </span>
          Kembali ke Beranda
        </button>

        <article style={{ lineHeight: "1.75", color: "#334155" }}>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span className="doc-type" style={{ margin: 0 }}>
              EDUKASI KESEHATAN
            </span>
            <span style={{ color: "#94a3b8" }}>•</span>
            <span style={{ fontSize: "14px", color: "#64748b" }}>
              8 November 2026
            </span>
          </div>

          <h1
            style={{
              fontSize: "28px",
              color: "#0f172a",
              marginBottom: "16px",
              lineHeight: "1.3",
              fontWeight: "700",
            }}
          >
            Akses Kesehatan yang Inklusif Dimulai dari Informasi yang Mudah
            Dipahami
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              background: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              marginBottom: "28px",
            }}
          >
            <Icon name="shield" size={20} />
            <span style={{ fontSize: "14px", color: "#475569" }}>
              <strong>Sumber Resmi:</strong> Kementerian Kesehatan Republik
              Indonesia & Pusdatin Kemenkes
            </span>
          </div>

          <p style={{ fontSize: "16px", marginBottom: "18px" }}>
            Kesehatan adalah hak fundamental bagi setiap warga negara tanpa
            terkecuali. Namun dalam praktiknya, kesenjangan akses informasi
            kesehatan sering kali menjadi kendala utama bagi kelompok masyarakat
            rentan, termasuk penyandang disabilitas fisik maupun sensorik,
            kelompok lansia, dan warga di wilayah pelosok.
          </p>

          <h2
            style={{
              fontSize: "20px",
              color: "#0f172a",
              margin: "28px 0 12px 0",
              fontWeight: "600",
            }}
          >
            Prinsip Layanan Kesehatan yang Setara
          </h2>
          <p style={{ marginBottom: "16px" }}>
            Platform Aku Care dibangun dengan komitmen pemenuhan standar
            aksesibilitas WCAG (Web Content Accessibility Guidelines) 2.1 level
            AA dan prinsip desain universal:
          </p>
          <ul
            style={{
              paddingLeft: "24px",
              marginBottom: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <li>
              <strong>Mode Suara & Pembaca Layar:</strong> Informasi disajikan
              dalam teks terstruktur semantik yang ramah pembaca layar
              (Talkback/Screen Reader) serta sintesis suara bahasa Indonesia.
            </li>
            <li>
              <strong>Tipografi Ramah Disleksia & Ukuran Teks Fleksibel:</strong>{" "}
              Tersedia opsi pembesaran teks dan font khusus (OpenDyslexic)
              dengan kontras terukur untuk kemudahan membaca.
            </li>
            <li>
              <strong>Antarmuka Berkontras Tinggi:</strong> Menjamin teks dan
              komponen interaktif memiliki rasio kontras warna minimal 4.5:1
              agar terbaca jelas oleh individu dengan gangguan penglihatan atau
              buta warna.
            </li>
            <li>
              <strong>Aksesibilitas Multikanal & Tanggap Darurat:</strong>{" "}
              Peringatan darurat disalurkan melalui audio, visual
              (toast/modal), dan getaran haptik (DeviceMotion API).
            </li>
          </ul>

          <h2
            style={{
              fontSize: "20px",
              color: "#0f172a",
              margin: "28px 0 12px 0",
              fontWeight: "600",
            }}
          >
            Langkah Cepat Tanggap Darurat Medis
          </h2>
          <p style={{ marginBottom: "16px" }}>
            Apabila Anda atau orang di sekitar mengalami kondisi gawat darurat
            medis, segera gunakan fitur <strong>Layanan Darurat / SOS</strong>{" "}
            pada platform Aku Care atau hubungi nomor darurat nasional:
          </p>
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "18px",
              marginBottom: "28px",
            }}
          >
            <p
              style={{
                margin: "0 0 10px 0",
                fontWeight: "bold",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Icon name="phone" size={18} /> Nomor Kontak Kegawatdaruratan
              Nasional:
            </p>
            <p style={{ margin: "0 0 8px 0", fontSize: "15px" }}>
              🚑 <strong>119</strong> — Sistem Penanggulangan Gawat Darurat
              Terpadu (SPGDT) Kemenkes RI
            </p>
            <p style={{ margin: "0", fontSize: "15px" }}>
              🚨 <strong>112</strong> — Layanan Panggilan Darurat Nasional
              Terpadu
            </p>
          </div>

          <div
            style={{
              marginTop: "40px",
              paddingTop: "24px",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
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
          <small>
            Aku Care · Informasi pada situs ini bukan pengganti diagnosis atau
            konsultasi tenaga medis langsung.
          </small>
        </div>
      </footer>
    </div>
  );
}