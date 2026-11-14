// src/Chatbot.tsx
import React, { useState, useRef, useEffect } from "react";

export function ChatbotSheet({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Halo! Saya asisten AI Aku Care. Ada yang bisa saya bantu terkait informasi kesehatan atau cara menggunakan aplikasi ini?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(50); 
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const newHeight = 100 - (e.clientY / window.innerHeight) * 100;
      setSheetHeight(Math.min(Math.max(newHeight, 30), 90));
    };

    const handlePointerUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const handlePointerDown = () => {
    isDragging.current = true;
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` 
        },
        body: JSON.stringify({
          // GUNAKAN MODEL TERBARU YANG DIJAMIN AKTIF
          model: "openai/gpt-oss-20b", 
          messages: [
            { 
              role: "system", 
              content: "Anda adalah asisten AI untuk aplikasi kesehatan inklusif bernama 'Aku Care'. Jawablah dengan bahasa Indonesia yang sopan, ringkas, dan empatik. Tugas Anda: 1. Menjawab pertanyaan kesehatan umum. 2. Membantu menjelaskan fitur aplikasi." 
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMessage }
          ],
          temperature: 0.5,
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
      }

      const aiReply = data.choices[0].message.content;
      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gangguan jaringan";
      setMessages((prev) => [...prev, { role: "assistant", content: `Gagal memproses pesan. Detail error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        role="presentation"
        style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100 }}
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
      />
      
      <div 
        className="chatbot-sheet-container"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, 
          height: `${sheetHeight}vh`, 
          width: "100%", 
          backgroundColor: "#ffffff", borderRadius: "24px 24px 0 0",
          zIndex: 101, display: "flex", flexDirection: "column",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div 
          onPointerDown={handlePointerDown}
          style={{ width: "100%", padding: "12px 0 4px 0", cursor: "ns-resize", display: "flex", justifyContent: "center", touchAction: "none" }}
          aria-label="Tarik untuk menyesuaikan ukuran chatbot"
        >
          <div style={{ width: "40px", height: "5px", backgroundColor: "#cbd5e1", borderRadius: "10px" }} />
        </div>

        <div style={{ padding: "8px 24px 16px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", color: "#0f172a", fontWeight: "bold" }}>Chatbot Pendamping</h3>
            <small style={{ color: "#10b981", fontWeight: 600 }}>● AI Terhubung</small>
          </div>
          <button onClick={onClose} aria-label="Tutup chatbot" style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#64748b" }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
              <div style={{ 
                backgroundColor: msg.role === "user" ? "#2563eb" : "#f1f5f9",
                color: msg.role === "user" ? "#ffffff" : "#0f172a",
                padding: "12px 16px", borderRadius: "16px",
                fontSize: "0.7rem", lineHeight: 1.5 
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ alignSelf: "flex-start", backgroundColor: "#f1f5f9", padding: "12px 16px", borderRadius: "16px", color: "#64748b" }}>
              AI sedang memikirkan jawaban...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} style={{ padding: "16px 20px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "10px" }}>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Tanyakan kesehatan atau fitur aplikasi..."
            aria-label="Ketik pesan ke chatbot"
            style={{ flex: 1, padding: "12px 16px", borderRadius: "999px", border: "1px solid #cbd5e1", fontSize: "0.7rem", outline: "none" }}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            aria-label="Kirim pesan"
            style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "0 20px", borderRadius: "999px", cursor: isLoading ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: "0.7rem" }}
          >
            Kirim
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .chatbot-sheet-container {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
}