// src/Dokter.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  initial: string;
}

interface DoctorSectionProps {
  onOpenChat: (doctorName: string) => void;
  voiceModeActive?: boolean;
}

export function DoctorSection({ onOpenChat, voiceModeActive = false }: DoctorSectionProps) {
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [activeDocId, setActiveDocId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      const { data, error } = await supabase.from("doctors").select("*").order("id");
      if (!error && data) {
        setDoctorsList(data);
      }
      setLoading(false);
    }
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!voiceModeActive) setActiveDocId(null);
  }, [voiceModeActive]);

  const handleMessageClick = (doc: Doctor, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!voiceModeActive) {
      onOpenChat(doc.name);
      return;
    }

    e.preventDefault();

    if (activeDocId !== doc.id) {
      setActiveDocId(doc.id);

      window.speechSynthesis.cancel();
      const textToSpeak = `Tombol pesan dengan ${doc.name}, ${doc.specialty}. Ketuk sekali lagi untuk membuka ruang pesan.`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "id-ID";
      window.speechSynthesis.speak(utterance);
    } else {
      setActiveDocId(null);
      window.speechSynthesis.cancel();
      onOpenChat(doc.name);
    }
  };

  return (
    <section className="consult-card">
      <div className="aside-title">
        <div>
          <h2>Konsultasi aktif</h2>
          <p>Pesan dengan dokter</p>
        </div>
        <span className="online-status">Tersedia</span>
      </div>

      <div className="doctor-section-list">
        {loading ? (
          <p className="doctor-loading-text">Memuat data dokter...</p>
        ) : doctorsList.length === 0 ? (
          <p className="doctor-loading-text">Belum ada dokter terdaftar.</p>
        ) : (
          doctorsList.map((doc) => {
            const isSelected = activeDocId === doc.id;

            return (
              <div key={doc.id} className="doctor-row-item">
                <div className="doctor-info-group">
                  <div className="doctor-avatar">{doc.initial}</div>
                  <div className="doctor-text-group">
                    <strong>{doc.name}</strong>
                    <span>{doc.specialty}</span>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => handleMessageClick(doc, e)}
                  aria-label={`Pesan dengan ${doc.name}`}
                  className="doctor-message-btn"
                  style={{
                    outline: isSelected ? "4px solid #facc15" : "none",
                    outlineOffset: "2px",
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
                    <path d="M8 9h8M8 13h5" />
                  </svg>
                  <span>Pesan</span>
                </button>
              </div>
            );
          })
        )}
      </div>

      <small className="consult-footer-note">Konsultasi daring tidak untuk kondisi darurat.</small>

      {/* CSS Lokal yang Menyelaraskan Font dan Ukuran dengan Desain Dashboard */}
      <style>{`
        .doctor-section-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 14px;
        }
        .doctor-loading-text {
          font-size: 14px;
          color: #64748b;
          text-align: center;
          padding: 12px;
          font-family: inherit;
        }
        .doctor-row-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }
        .doctor-info-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }
        .doctor-text-group {
          min-width: 0;
          font-family: inherit;
        }
        .doctor-text-group strong {
          display: block;
          font-size: 10px;
          color: #0f172a;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: inherit;
        }
        .doctor-text-group span {
          display: block;
          font-size: 8px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: inherit;
          margin-top: 2px;
        }
        .doctor-message-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          color: #2563eb;
          font-size: 8px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          transition: background-color 0.15s ease, border-color 0.15s ease, outline 0.15s ease;
        }
        .doctor-message-btn:hover {
          background-color: #f8fafc;
          border-color: #94a3b8;
        }
        .consult-footer-note {
          display: block;
          margin-top: 16px;
          font-size: 12px;
          color: #64748b;
          font-family: inherit;
        }
      `}</style>
    </section>
  );
}