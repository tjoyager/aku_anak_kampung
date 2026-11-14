import { useState, useEffect } from "react";
import phq9Data from "../data/phq9.json";
import CrisisModal from "./CrisisModal";

type PHQ9Question = {
  question: string;
  options: { text: string; value: number }[];
};

const questions: PHQ9Question[] = phq9Data as PHQ9Question[];

type PHQ9Result = {
  score: number;
  level: string;
  color: string;
  recommendation: string;
};

function getResult(score: number): PHQ9Result {
  if (score <= 4)
    return { score, level: "Minimal", color: "#16a34a", recommendation: "Kondisi Anda terlihat baik. Terus jaga kesehatan mental Anda." };
  if (score <= 9)
    return { score, level: "Ringan", color: "#ca8a04", recommendation: "Ada beberapa gejala. Pertimbangkan konsultasi dengan dokter umum." };
  if (score <= 14)
    return { score, level: "Sedang", color: "#ea580c", recommendation: "Disarankan untuk berkonsultasi dengan dokter atau psikolog." };
  if (score <= 19)
    return { score, level: "Cukup Berat", color: "#dc2626", recommendation: "Segera konsultasikan dengan psikolog atau psikiater." };
  return { score, level: "Berat", color: "#7f1d1d", recommendation: "Segera cari bantuan profesional. Hubungi 119 jika darurat." };
}

interface PHQ9ScreenProps {
  onClose: () => void;
}

export default function PHQ9Screen({ onClose }: PHQ9ScreenProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showCrisis, setShowCrisis] = useState(false);
  const [finished, setFinished] = useState(false);

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const answer9 = answers[8] ?? 0; // pertanyaan ke-9 (index 8)

  useEffect(() => {
    if (finished && (totalScore > 14 || answer9 >= 1)) {
      setShowCrisis(true);
    }
  }, [finished, totalScore, answer9]);

  const handleSelect = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
      setAnswers((prev) => prev.slice(0, -1));
    }
  };

  const result = finished ? getResult(totalScore) : null;

  return (
    <>
      <div
        className="modal-backdrop"
        role="presentation"
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
      >
        <section className="phq9-modal">
          <div className="phq9-header">
            <div>
              <span className="modal-kicker">TES KESEHATAN MENTAL</span>
              <h2 id="phq9-title">PHQ-9 Skrining Depresi</h2>
            </div>
            <button className="modal-close" onClick={onClose} aria-label="Tutup tes PHQ-9">✕</button>
          </div>

          {!finished && (
            <div
              className="phq9-progress"
              aria-label={`Pertanyaan ${currentIdx + 1} dari ${questions.length}`}
            >
              <div
                className="phq9-progress-bar"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                role="progressbar"
                aria-valuenow={currentIdx + 1}
                aria-valuemin={1}
                aria-valuemax={questions.length}
              />
              <span className="phq9-progress-text">{currentIdx + 1} / {questions.length}</span>
            </div>
          )}

          {!finished && (
            <div className="phq9-body">
              <p className="phq9-intro">
                Selama <strong>2 minggu terakhir</strong>, seberapa sering Anda terganggu oleh hal berikut?
              </p>
              <fieldset className="phq9-fieldset">
                <legend className="phq9-question">
                  {currentIdx + 1}. {questions[currentIdx].question}
                </legend>
                <div role="radiogroup" className="phq9-options">
                  {questions[currentIdx].options.map((opt) => (
                    <label key={opt.value} className="phq9-option">
                      <input
                        type="radio"
                        name={`phq9-q${currentIdx}`}
                        value={opt.value}
                        onChange={() => handleSelect(opt.value)}
                        aria-label={`${opt.text} (nilai ${opt.value})`}
                      />
                      <span className="phq9-option-label">{opt.text}</span>
                      <span className="phq9-option-value">{opt.value}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {currentIdx > 0 && (
                <button className="phq9-back-btn" onClick={handlePrev} aria-label="Kembali ke pertanyaan sebelumnya">
                  ← Sebelumnya
                </button>
              )}
            </div>
          )}

          {finished && result && !showCrisis && (
            <div className="phq9-result" aria-live="polite">
              <div className="phq9-score-circle" style={{ borderColor: result.color }}>
                <span style={{ color: result.color }} className="phq9-score-num">{result.score}</span>
                <span className="phq9-score-max">/ 27</span>
              </div>
              <h3 style={{ color: result.color }}>Tingkat: {result.level}</h3>
              <p>{result.recommendation}</p>
              <div className="phq9-result-actions">
                <a href="tel:119" className="crisis-btn crisis-btn-secondary" aria-label="Hubungi 119">📞 Hubungi 119</a>
                <button onClick={onClose} className="phq9-done-btn">Selesai</button>
              </div>
              <small>Hasil ini adalah skrining awal, bukan diagnosis medis.</small>
            </div>
          )}
        </section>
      </div>

      {showCrisis && (
        <CrisisModal score={totalScore} onClose={() => { setShowCrisis(false); onClose(); }} />
      )}
    </>
  );
}
