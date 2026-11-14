import { activateVibration } from "../utils/accessibility";

interface CrisisModalProps {
  score: number;
  onClose: () => void;
}

/**
 * Modal darurat yang muncul ketika skor PHQ-9 > 14 atau
 * jawaban pertanyaan ke-9 (pikiran menyakiti diri) >= 1.
 * Memiliki atribut ARIA lengkap dan memicu getaran saat terbuka.
 */
export default function CrisisModal({ score, onClose }: CrisisModalProps) {
  // Aktifkan getaran saat modal muncul
  activateVibration([300, 100, 300, 100, 300]);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <section className="crisis-modal">
        {/* Header */}
        <div className="crisis-modal-header">
          <span className="crisis-icon" aria-hidden="true">🚨</span>
          <h2 id="crisis-title">Peringatan Kesehatan Mental</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Tutup peringatan krisis"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div id="crisis-desc" className="crisis-modal-body">
          <p>
            Berdasarkan jawaban Anda, skor PHQ-9 Anda adalah{" "}
            <strong>{score}/27</strong> yang menunjukkan risiko yang perlu
            mendapat perhatian segera dari tenaga profesional.
          </p>
          <p>
            Anda <strong>tidak sendirian</strong>. Hubungi layanan darurat
            atau orang terpercaya sekarang.
          </p>
        </div>

        {/* Aksi Darurat */}
        <div className="crisis-modal-actions">
          <a
            href="tel:119"
            className="crisis-btn crisis-btn-primary"
            aria-label="Telepon layanan darurat 119"
          >
            📞 Telepon 119
          </a>
          <a
            href="tel:112"
            className="crisis-btn crisis-btn-primary"
            aria-label="Telepon layanan darurat 112"
          >
            📞 Telepon 112
          </a>
          <a
            href="https://www.halo-kemkes.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="crisis-btn crisis-btn-secondary"
            aria-label="Hubungi layanan konseling Kemenkes (tautan eksternal)"
          >
            💬 Halo Kemkes 1500-567
          </a>
        </div>

        <small className="crisis-modal-note">
          Hasil skrining ini bukan diagnosis medis. Segera konsultasikan dengan
          dokter atau psikolog.
        </small>
      </section>
    </div>
  );
}
