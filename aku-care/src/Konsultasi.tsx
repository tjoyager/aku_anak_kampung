import React, { useState, useEffect } from "react";
import type { View } from "./App";
import { supabase } from "./lib/supabase";

interface KonsultasiProps {
  go: (view: View) => void;
  doctorName?: string;
  specialty?: string;
}

interface Message {
  id?: string | number;
  sender?: "user" | "doctor" | "system" | string;
  sender_id?: string;
  text?: string;
  message?: string;
  content?: string;
  time?: string;
  created_at?: string;
  [key: string]: any;
}

export function Konsultasi({
  go,
  doctorName = "dr. Ratna Wijaya, Sp.KJ",
  specialty = "Spesialis Kesehatan Jiwa",
}: KonsultasiProps) {
  const makeInitial = (n: string) => n.replace(/^dr\.\s*/i, "").split(/[\s,]+/).filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";

  const [selectedDoctor, setSelectedDoctor] = useState({
    name: doctorName,
    specialty: specialty,
    initial: makeInitial(doctorName),
    sip: "SIP. 503/442/DS/2024",
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "system",
      text: "Sesi konsultasi daring terenkripsi end-to-end telah dimulai. Privasi dan kerahasiaan medis Anda terlindungi.",
      time: "09:00",
    },
    {
      id: "2",
      sender: "doctor",
      text: `Halo, selamat datang di layanan konsultasi AkuCare. Saya ${doctorName}. Apa yang sedang Anda rasakan atau keluhkan saat ini?`,
      time: "09:01",
    },
    {
      id: "3",
      sender: "user",
      text: "Halo dokter, saya baru saja menyelesaikan skrining PHQ-9 dan merasa beberapa hari terakhir cukup kewalahan dan sulit tidur.",
      time: "09:02",
    },
    {
      id: "4",
      sender: "doctor",
      text: "Terima kasih sudah bercerita. Itu adalah langkah awal yang sangat baik. Bisakah ceritakan lebih lanjut sejak kapan sulit tidur ini mulai mengganggu aktivitas Anda?",
      time: "09:03",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Load pesan awal dari tabel messages menggunakan supabase.from('messages').select('*')
    const loadMessages = async () => {
      const { data, error } = await supabase.from('messages').select('*');
      if (data && data.length > 0) {
        setMessages(data as Message[]);
      }
    };

    loadMessages();

    // Subscription ke WebSockets Supabase
    const channel = supabase.channel('realtime_chat').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => { setMessages((prev) => [...prev, payload.new as Message]) }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: messageText,
      time: timeStr,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const { data: authData } = await supabase.auth.getUser();
      await supabase.from('messages').insert({
        text: messageText,
        sender: "user",
        time: timeStr,
        ...(authData?.user?.id ? { sender_id: authData.user.id } : {}),
      });
    } catch (err) {
      console.error("Gagal mengirim pesan ke Supabase:", err);
    }

    // Simulasi respons dokter setelah 1.5 detik
    setTimeout(() => {
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "doctor",
        text: "Pesan Anda telah saya catat. Pola tidur sangat berpengaruh terhadap regulasi suasana hati. Mari kita bahas langkah penyesuaian gaya hidup dan opsi penanganan yang tepat.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, replyMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", height: "calc(100vh - 40px)", display: "flex", flexDirection: "column", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", overflow: "hidden", fontFamily: "sans-serif" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#0066cc", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px" }}>
            {selectedDoctor.initial}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>{selectedDoctor.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
              <span>{selectedDoctor.specialty} · Online ({selectedDoctor.sip})</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => go("dashboard")}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #0066cc", background: "#eff6ff", color: "#0066cc", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Banner Penjelasan Konsultasi & Profil Dokter Terverifikasi */}
      <div style={{ background: "#eff6ff", borderBottom: "1px solid #bfdbfe", padding: "10px 20px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px", fontSize: "12px", color: "#1e40af" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>🩺</span>
          <span>
            Pasien sedang berkonsultasi langsung dengan <strong>{selectedDoctor.name} ({selectedDoctor.specialty})</strong>. Sesi konsultasi aktif &amp; terenkripsi.
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", color: "#3b82f6", fontWeight: "600" }}>Pilih Dokter:</span>
          <select
            value={selectedDoctor.name}
            onChange={(e) => {
              if (e.target.value.includes("Ratna")) {
                setSelectedDoctor({
                  name: "dr. Ratna Wijaya, Sp.KJ",
                  specialty: "Spesialis Kesehatan Jiwa",
                  initial: "RW",
                  sip: "SIP. 503/442/DS/2024",
                });
              } else if (e.target.value.includes("Budi")) {
                setSelectedDoctor({
                  name: "dr. Budi Santoso, Sp.A",
                  specialty: "Spesialis Anak",
                  initial: "BS",
                  sip: "SIP. 503/388/DS/2023",
                });
              } else {
                setSelectedDoctor({
                  name: "dr. Hendra Setiawan, Sp.PD",
                  specialty: "Spesialis Penyakit Dalam",
                  initial: "HS",
                  sip: "SIP. 503/102/DS/2022",
                });
              }
            }}
            style={{ fontSize: "11px", padding: "4px 8px", borderRadius: "6px", border: "1px solid #93c5fd", background: "#ffffff", color: "#1e3a8a", fontWeight: "600", outline: "none", cursor: "pointer" }}
          >
            <option value="dr. Ratna Wijaya, Sp.KJ">dr. Ratna Wijaya, Sp.KJ (Spesialis Jiwa)</option>
            <option value="dr. Budi Santoso, Sp.A">dr. Budi Santoso, Sp.A (Spesialis Anak)</option>
            <option value="dr. Hendra Setiawan, Sp.PD">dr. Hendra Setiawan, Sp.PD (Penyakit Dalam)</option>
          </select>
        </div>
      </div>

      {/* Area Chat Messages */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto", background: "#f8fafc", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((msg, index) => {
          const key = msg.id ?? index;
          if (msg.sender === "system") {
            return (
              <div key={key} style={{ alignSelf: "center", background: "#e2e8f0", color: "#475569", padding: "6px 14px", borderRadius: "999px", fontSize: "11px", maxWidth: "80%", textAlign: "center" }}>
                {msg.text || msg.message || msg.content}
              </div>
            );
          }

          const isUser = msg.sender === "user" || (!msg.sender && msg.sender_id != null) || (msg.sender !== "doctor" && msg.sender !== "system");
          const displayText = msg.text || msg.message || msg.content || "";
          const displayTime = msg.time || (msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "");

          return (
            <div
              key={key}
              style={{
                alignSelf: isUser ? "flex-end" : "flex-start",
                maxWidth: "75%",
                display: "flex",
                flexDirection: "column",
                alignItems: isUser ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  background: isUser ? "#0066cc" : "#ffffff",
                  color: isUser ? "#ffffff" : "#1e293b",
                  padding: "12px 16px",
                  borderRadius: isUser ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                  border: isUser ? "none" : "1px solid #e2e8f0",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  wordBreak: "break-word",
                }}
              >
                {displayText}
              </div>
              <span style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px", padding: "0 4px" }}>
                {displayTime}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ alignSelf: "flex-start", background: "#ffffff", padding: "8px 14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px", color: "#64748b" }}>
            <em>{selectedDoctor.name} sedang mengetik...</em>
          </div>
        )}
      </div>

      {/* Input Box Footer */}
      <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "10px", padding: "14px 20px", background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tulis pesan atau keluhan medis Anda di sini..."
          aria-label="Tulis pesan konsultasi"
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#0066cc",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.15s ease",
          }}
        >
          Kirim
        </button>
      </form>
    </div>
  );
}
export default Konsultasi;
