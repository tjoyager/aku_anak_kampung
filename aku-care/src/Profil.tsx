import React, { useState } from "react";
import type { View } from "./App";
import { Icon } from "./components/ui/Icons";
import { Brand } from "./components/ui/Brand";

interface ProfilProps {
  go: (view: View) => void;
}

export function Profil({ go }: ProfilProps) {
  const [nama, setNama] = useState("Budi Pratama");
  const [email, setEmail] = useState("budi.pratama@example.com");
  const [telepon, setTelepon] = useState("0812-3456-7890");
  const [tanggalLahir, setTanggalLahir] = useState("1992-05-14");
  const [golonganDarah, setGolonganDarah] = useState("O+");
  const [alergi, setAlergi] = useState("Penisilin, Kacang tanah");
  const [penyakit, setPenyakit] = useState("Asma (ringan), Riwayat gastritis");
  const [kontakDarurat, setKontakDarurat] = useState("Siti Rahma (Istri) - 0813-9876-5432");
  const [notice, setNotice] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setNotice("Profil & Info Medis Darurat berhasil disimpan!");
    setTimeout(() => {
      setNotice("");
    }, 3500);
  };

  return (
    <div className="public-page" style={{ minHeight: "100vh", backgroundColor: "#f5f8fc" }}>
      {/* Top Header */}
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

      {/* Main Content Area */}
      <main id="main-public" style={{ maxWidth: "760px", margin: "32px auto", padding: "0 20px 60px" }}>
        {/* Navigation Breadcrumb */}
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

        {/* Header Title Card */}
        <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #dce6f0", padding: "24px 28px", marginBottom: "24px", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#eaf4ff", color: "#0066cc", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "20px" }}>
              BP
            </div>
            <div>
              <span className="doc-type" style={{ marginBottom: "4px", display: "inline-block" }}>PROFIL PENGGUNA</span>
              <h1 style={{ fontSize: "24px", color: "#0f172a", margin: 0, fontWeight: "700" }}>Profil & Informasi Medis</h1>
              <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                Kelola identitas pribadi dan data riwayat medis darurat Anda secara mandiri.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Section 1: Informasi Pengguna */}
          <section style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #dce6f0", padding: "24px 28px", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
              <div style={{ color: "#0066cc" }}>
                <Icon name="user" size={20} />
              </div>
              <h2 style={{ fontSize: "17px", color: "#0f172a", margin: 0, fontWeight: "600" }}>Informasi Pribadi</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
              <div>
                <label htmlFor="profil-nama" style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Nama Lengkap
                </label>
                <input
                  id="profil-nama"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                <div>
                  <label htmlFor="profil-email" style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                    Alamat Email
                  </label>
                  <input
                    id="profil-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "15px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="profil-telepon" style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                    Nomor Telepon
                  </label>
                  <input
                    id="profil-telepon"
                    type="tel"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "15px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="profil-tgl-lahir" style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Tanggal Lahir
                </label>
                <input
                  id="profil-tgl-lahir"
                  type="date"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Info Medis Darurat */}
          <section style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #dce6f0", padding: "24px 28px", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
              <div style={{ color: "#d93645" }}>
                <Icon name="heart" size={20} />
              </div>
              <h2 style={{ fontSize: "17px", color: "#0f172a", margin: 0, fontWeight: "600" }}>
                Informasi Medis Darurat (Akses Cepat 119/112)
              </h2>
            </div>

            <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ color: "#dc2626", marginTop: "2px" }}>
                <Icon name="shield" size={16} />
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "#991b1b", lineHeight: "1.5" }}>
                Informasi ini sangat krusial dan dapat ditampilkan secara otomatis saat Anda mengaktifkan tombol <strong>SOS Darurat</strong> atau <strong>Deteksi Guncangan (Shake-to-SOS)</strong> kepada petugas medis.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
              <div>
                <label htmlFor="profil-gol-darah" style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Golongan Darah
                </label>
                <select
                  id="profil-gol-darah"
                  value={golonganDarah}
                  onChange={(e) => setGolonganDarah(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                    backgroundColor: "#ffffff",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="A+">A (Rh+)</option>
                  <option value="A-">A (Rh-)</option>
                  <option value="B+">B (Rh+)</option>
                  <option value="B-">B (Rh-)</option>
                  <option value="AB+">AB (Rh+)</option>
                  <option value="AB-">AB (Rh-)</option>
                  <option value="O+">O (Rh+)</option>
                  <option value="O-">O (Rh-)</option>
                  <option value="Belum Tahu">Belum Diketahui</option>
                </select>
              </div>

              <div>
                <label htmlFor="profil-alergi" style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Riwayat Alergi (Obat / Makanan / Lingkungan)
                </label>
                <input
                  id="profil-alergi"
                  type="text"
                  value={alergi}
                  onChange={(e) => setAlergi(e.target.value)}
                  placeholder="Contoh: Penisilin, Makanan Laut, Debu"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label htmlFor="profil-penyakit" style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Penyakit Penyerta & Kondisi Kronis
                </label>
                <input
                  id="profil-penyakit"
                  type="text"
                  value={penyakit}
                  onChange={(e) => setPenyakit(e.target.value)}
                  placeholder="Contoh: Diabetes Tipe 2, Hipertensi, Asma"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label htmlFor="profil-kontak-darurat" style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Kontak Darurat Utama (Nama, Hubungan & No. HP)
                </label>
                <input
                  id="profil-kontak-darurat"
                  type="text"
                  value={kontakDarurat}
                  onChange={(e) => setKontakDarurat(e.target.value)}
                  placeholder="Contoh: Siti Rahma (Istri) - 0813-9876-5432"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          </section>

          {/* Buttons Area */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", flexWrap: "wrap", marginTop: "8px" }}>
            <button
              type="button"
              className="login-link"
              onClick={() => go("dashboard")}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#475569",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Kembali ke Dashboard
            </button>
            <button
              type="submit"
              className="register-cta"
              style={{
                padding: "12px 28px",
                borderRadius: "8px",
                border: "none",
                background: "#0066cc",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Icon name="shield" size={17} />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </main>

      {/* Toast Notification */}
      <div className={`toast ${notice ? "show" : ""}`} role="status">
        {notice}
      </div>
    </div>
  );
}
