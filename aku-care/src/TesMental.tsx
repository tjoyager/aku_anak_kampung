import React, { useState } from "react";
import phq9Data from "./data/phq9.json";
import type { View } from "./App";

interface TesMentalProps {
  go: (view: View) => void;
}

const SCALE_OPTIONS = [
  { value: 0, label: "Tidak pernah sama sekali", score: 0 },
  { value: 1, label: "Beberapa hari", score: 1 },
  { value: 2, label: "Lebih dari separuh waktu yang dimaksud", score: 2 },
  { value: 3, label: "Hampir setiap hari", score: 3 },
];

export function TesMental({ go }: TesMentalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(phq9Data.length).fill(-1));
  const [isFinished, setIsFinished] = useState(false);
  const [vibrateStatus, setVibrateStatus] = useState("");

  const handleSelectAnswer = (score: number) => {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = score;
    setAnswers(nextAnswers);

    if (currentIndex < phq9Data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const resetQuiz = () => {
    setAnswers(Array(phq9Data.length).fill(-1));
    setCurrentIndex(0);
    setIsFinished(false);
  };

  const calculateTotalScore = () => {
    return answers.reduce((total, score) => (score >= 0 ? total + score : total), 0);
  };

  const totalScore = calculateTotalScore();
  const q9Score = answers[8] >= 0 ? answers[8] : 0;
  // Logika Krisis (P0): skor total > 14 ATAU pertanyaan 9 (keinginan menyakiti diri) >= 1
  const isCrisis = totalScore > 14 || q9Score >= 1;

  const handleVibrate = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([300, 100, 300]);
      setVibrateStatus("Umpan balik getaran darurat aktif (300ms - 100ms - 300ms)");
      setTimeout(() => setVibrateStatus(""), 4000);
    } else {
      setVibrateStatus("Perangkat ini tidak mendukung Vibration API.");
      setTimeout(() => setVibrateStatus(""), 4000);
    }
  };

  const getSeverity = (score: number) => {
    if (score <= 4) {
      return {
        label: "Normal / Minimal",
        color: "#16a34a",
        bg: "#f0fdf4",
        border: "#bbf7d0",
        advice: "Kondisi emosional Anda tergolong stabil. Tetap jaga pola tidur, olahraga, dan keseimbangan aktivitas.",
      };
    }
    if (score <= 9) {
      return {
        label: "Depresi Ringan",
        color: "#ca8a04",
        bg: "#fefce8",
        border: "#fef08a",
        advice: "Terdapat gejala kelelahan mental atau stres ringan. Luangkan waktu untuk istirahat, relaksasi, dan bercerita kepada orang terdekat.",
      };
    }
    if (score <= 14) {
      return {
        label: "Depresi Sedang",
        color: "#ea580c",
        bg: "#fff7ed",
        border: "#fed7aa",
        advice: "Gejala yang Anda rasakan mulai mengganggu kenyamanan beraktivitas. Sangat disarankan berkonsultasi dengan konselor atau dokter umum.",
      };
    }
    if (score <= 19) {
      return {
        label: "Depresi Sedang-Berat",
        color: "#dc2626",
        bg: "#fef2f2",
        border: "#fecaca",
        advice: "Diperlukan perhatian profesional. Konsultasikan dengan psikolog klinis atau dokter spesialis kedokteran jiwa (psikiater).",
      };
    }
    return {
      label: "Depresi Berat",
      color: "#991b1b",
      bg: "#fef2f2",
      border: "#f87171",
      advice: "Segera cari bantuan medis profesional. Dukungan segera akan sangat membantu proses pemulihan Anda.",
    };
  };

  const currentQ = phq9Data[currentIndex];
  const severity = getSeverity(totalScore);

  return (
    <div style={{ maxWidth: "760px", margin: "32px auto", padding: "24px", fontFamily: "sans-serif", color: "#1e293b" }}>
      {/* Header Navigasi */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", margin: "0 0 4px 0", color: "#0f172a" }}>Skrining Kesehatan Mental (PHQ-9)</h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Patient Health Questionnaire-9 terstandarisasi untuk evaluasi suasana hati dalam 2 minggu terakhir.</p>
        </div>
        <button
          type="button"
          onClick={() => go("dashboard")}
          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#334155", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      {!isFinished ? (
        /* Tampilan Soal Berjalan */
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 4px rgba(0,0,0,0.04)" }}>
          {/* Progress Bar */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "6px" }}>
              <span>Pertanyaan {currentIndex + 1} dari {phq9Data.length}</span>
              <span>{Math.round(((currentIndex) / phq9Data.length) * 100)}% Selesai</span>
            </div>
            <div style={{ height: "6px", width: "100%", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((currentIndex + 1) / phq9Data.length) * 100}%`, background: "#0066cc", transition: "width 0.2s ease" }} />
            </div>
          </div>

          {/* Teks Pertanyaan */}
          <div style={{ minHeight: "80px", marginBottom: "24px" }}>
            <span style={{ display: "inline-block", background: "#e0f2fe", color: "#0369a1", fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "4px", marginBottom: "8px" }}>
              DALAM 2 MINGGU TERAKHIR
            </span>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", lineHeight: "1.5", margin: 0 }}>
              {currentQ.text}?
            </h2>
          </div>

          {/* Opsi Jawaban */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            {SCALE_OPTIONS.map((opt) => {
              const isSelected = answers[currentIndex] === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleSelectAnswer(opt.score)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 18px",
                    borderRadius: "10px",
                    border: isSelected ? "2px solid #0066cc" : "1px solid #cbd5e1",
                    background: isSelected ? "#eff6ff" : "#ffffff",
                    color: isSelected ? "#1d4ed8" : "#334155",
                    fontSize: "15px",
                    fontWeight: isSelected ? "600" : "500",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>{opt.label}</span>
                  <span style={{ fontSize: "12px", background: isSelected ? "#0066cc" : "#f1f5f9", color: isSelected ? "#ffffff" : "#64748b", padding: "2px 8px", borderRadius: "999px" }}>
                    + {opt.score}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tombol Sebelumnya */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {currentIndex > 0 ? (
              <button
                type="button"
                onClick={handlePrevious}
                style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#475569", fontSize: "13px", cursor: "pointer" }}
              >
                ← Pertanyaan Sebelumnya
              </button>
            ) : <div />}
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Pilih salah satu jawaban di atas</span>
          </div>
        </div>
      ) : (
        /* Tampilan Hasil Skrining */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Card Hasil Skor */}
          <div style={{ background: severity.bg, border: `1px solid ${severity.border}`, borderRadius: "12px", padding: "24px", textAlign: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: severity.color }}>
              HASIL SKRINING SEMENTARA
            </span>
            <div style={{ fontSize: "48px", fontWeight: "800", color: severity.color, margin: "10px 0" }}>
              {totalScore} <span style={{ fontSize: "18px", fontWeight: "500", color: "#64748b" }}>/ 27</span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: severity.color, margin: "0 0 8px 0" }}>
              Indikasi: {severity.label}
            </h2>
            <p style={{ maxWidth: "560px", margin: "0 auto", fontSize: "14px", color: "#334155", lineHeight: "1.6" }}>
              {severity.advice}
            </p>
          </div>

          {/* Logika Krisis (P0) — Peringatan Darurat Merah */}
          {isCrisis && (
            <div
              role="alert"
              style={{
                background: "#fef2f2",
                border: "2px solid #dc2626",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 6px rgba(220, 38, 38, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ display: "inline-flex", width: "32px", height: "32px", background: "#dc2626", color: "#ffffff", borderRadius: "50%", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "18px" }}>
                  !
                </span>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#991b1b" }}>
                  PERINGATAN KRISIS & DUKUNGAN SEGERA
                </h3>
              </div>

              <p style={{ margin: "0 0 14px 0", fontSize: "14px", color: "#7f1d1d", lineHeight: "1.6" }}>
                {q9Score >= 1
                  ? "Jawaban Anda menunjukkan adanya pikiran untuk melukai diri sendiri atau merasa lebih baik mati. Anda tidak sendirian, bantuan profesional tersedia kapan saja secara gratis."
                  : "Skor Anda tergolong tinggi (>14) yang menandakan tingkat tekanan emosional signifikan. Segera hubungi tenaga kesehatan profesional untuk pendampingan."}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                <a
                  href="tel:119"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#dc2626",
                    color: "#ffffff",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                >
                  📞 Telepon Layanan SEJIWA 119 (Ekstensi 8)
                </a>

                <button
                  type="button"
                  onClick={handleVibrate}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#ffffff",
                    border: "1px solid #dc2626",
                    color: "#dc2626",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  📳 Picu Getaran Darurat (Vibration Mode)
                </button>
              </div>

              {vibrateStatus && (
                <p style={{ marginTop: "10px", marginBottom: 0, fontSize: "12px", color: "#b91c1c", fontWeight: "600" }}>
                  {vibrateStatus}
                </p>
              )}
            </div>
          )}

          {/* Penjelasan Disclaimer & Aksi */}
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px", fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>
            <strong>Catatan Medis:</strong> Hasil kuesioner PHQ-9 ini merupakan alat bantu penapisan awal (*screening tool*) dan bukan merupakan diagnosis medis klinis resmi. Untuk diagnosis menyeluruh, silakan lakukan konsultasi dengan psikiater atau dokter melalui fitur Konsultasi AkuCare.
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={resetQuiz}
              style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#334155", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
            >
              Ulangi Tes
            </button>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => go("chat")}
                style={{ padding: "10px 18px", borderRadius: "8px", border: "none", background: "#0066cc", color: "#ffffff", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
              >
                Konsultasikan Hasil ke Dokter →
              </button>
              <button
                type="button"
                onClick={() => go("dashboard")}
                style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#0f172a", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
              >
                Selesai & Ke Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default TesMental;
