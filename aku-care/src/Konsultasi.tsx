import React, { useState } from "react";
import type { View } from "./App";

interface KonsultasiProps {
  go: (view: View) => void;
  doctorName?: string;
  specialty?: string;
}

interface Message {
  id: string;
  sender: "user" | "doctor" | "system";
  text: string;
  time: string;
}

export function Konsultasi({
  go,
  doctorName = "dr. Ratna Wijaya, Sp.KJ",
  specialty = "Spesialis Kedokteran Jiwa (Psikiater)",
}: KonsultasiProps) {
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

  // TODO (Aga): Hubungkan dengan supabase.channel('realtime_chat') untuk sinkronisasi pesan realtime:
  // useEffect(() => {
  //   const channel = supabase.channel(`consultation_${chatId}`)
  //     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
  //       setMessages((prev) => [...prev, payload.new as Message]);
  //     })
  //     .subscribe();
  //   return () => { supabase.removeChannel(channel); };
  // }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setIsTyping(true);

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
            RW
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>{doctorName}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
              <span>{specialty} · Online</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => go("dashboard")}
          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#334155", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      {/* Area Chat Messages */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto", background: "#f8fafc", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((msg) => {
          if (msg.sender === "system") {
            return (
              <div key={msg.id} style={{ alignSelf: "center", background: "#e2e8f0", color: "#475569", padding: "6px 14px", borderRadius: "999px", fontSize: "11px", maxWidth: "80%", textAlign: "center" }}>
                {msg.text}
              </div>
            );
          }

          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
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
                {msg.text}
              </div>
              <span style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px", padding: "0 4px" }}>
                {msg.time}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ alignSelf: "flex-start", background: "#ffffff", padding: "8px 14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px", color: "#64748b" }}>
            <em>dr. Ratna sedang mengetik...</em>
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
