import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Bot, User, Sparkles, RefreshCw, AlertCircle, ShieldAlert } from "lucide-react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

const SYSTEM_PROMPT = {
  role: "system",
  content:
    "Anda adalah asisten virtual AkuCare. Jawab pertanyaan kesehatan umum dengan ringkas, ramah, dan menggunakan Bahasa Indonesia yang mudah dipahami. Jangan pernah memberikan diagnosis medis pasti atau resep obat. Jika ada indikasi gawat darurat atau gejala serius, selalu arahkan pengguna untuk segera menghubungi dokter atau layanan darurat 119.",
};

const SUGGESTIONS = [
  "Pertolongan pertama pada orang pingsan",
  "Gejala umum demam berdarah (DBD)",
  "Kapan saya harus segera ke IGD?",
  "Cara meredakan kecemasan dan stres",
];

function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function Chatbot({ go }: { go?: (view: any) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Halo! Saya asisten virtual AkuCare. Ada yang bisa saya bantu terkait pertanyaan kesehatan umum atau panduan layanan medis hari ini?",
      timestamp: formatTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText ?? input).trim();
    if (!textToSend || isLoading) return;

    setErrorNotice(null);
    setInput("");

    const userMessage: ChatMessage = {
      role: "user",
      content: textToSend,
      timestamp: formatTime(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY || "";

    // Build payload messages including mandatory system prompt
    const apiMessages = [
      SYSTEM_PROMPT,
      ...updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    try {
      // Primary model as per prompt: llama3-8b-8192 (or fallback to active models)
      let response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: apiMessages,
          temperature: 0.6,
          max_tokens: 500,
        }),
      });

      // If llama3-8b-8192 is decommissioned/unavailable on this key, fallback smoothly
      if (!response.ok) {
        response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: apiMessages,
            temperature: 0.6,
            max_tokens: 500,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      const aiReply =
        data.choices?.[0]?.message?.content ||
        "Maaf, saya tidak dapat merumuskan jawaban saat ini. Silakan ulangi pertanyaan Anda.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiReply,
          timestamp: formatTime(),
        },
      ]);
    } catch (err) {
      const errText = err instanceof Error ? err.message : "Gangguan jaringan.";
      setErrorNotice(errText);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Mohon maaf, saat ini sedang terjadi kendala teknis dalam menghubungkan ke asisten AI. Untuk kondisi darurat, segera hubungi nomor 119 atau fasilitas medis terdekat.",
          timestamp: formatTime(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Percakapan telah diatur ulang. Ada hal lain seputar kesehatan yang ingin Anda tanyakan kepada AkuCare?",
        timestamp: formatTime(),
      },
    ]);
    setErrorNotice(null);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f1f5f9] font-sans text-slate-800">
      {/* ================= HEADER ================= */}
      <header className="flex-none bg-white border-b border-slate-200 shadow-sm z-10 px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (go ? go("dashboard") : window.history.back())}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-xs sm:text-sm font-semibold"
              aria-label="Kembali ke Dashboard"
            >
              <ArrowLeft size={16} />
              <span>Kembali ke Dashboard</span>
            </button>

            <div className="flex items-center gap-2.5 ml-1">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-[#0066cc] to-[#00a3ff] text-white flex items-center justify-center shadow-sm">
                <Bot size={20} />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="leading-tight">
                <h1 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                  AkuCare AI <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold uppercase">Groq</span>
                </h1>
                <p className="text-[11px] text-emerald-600 font-medium">Aktif • Asisten Kesehatan</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Mulai Percakapan Baru"
            aria-label="Mulai Percakapan Baru"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {/* ================= DISCLAIMER BANNER ================= */}
      <div className="flex-none bg-amber-50 border-b border-amber-200 px-4 py-2 text-amber-900 text-xs text-center flex items-center justify-center gap-1.5">
        <ShieldAlert size={14} className="text-amber-700 flex-shrink-0" />
        <span>
          <strong>Pengingat Medis:</strong> Asisten virtual hanya memberikan informasi umum, bukan diagnosis atau resep obat. Darurat? Hubungi <strong>119</strong>.
        </span>
      </div>

      {/* ================= CHAT CONTAINER ================= */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {/* Suggestion Chips */}
          {messages.length <= 2 && (
            <div className="mb-2 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#0066cc]" /> Contoh topik yang bisa Anda tanyakan:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug)}
                    className="text-left text-xs bg-slate-50 hover:bg-blue-50 hover:text-[#0066cc] hover:border-blue-200 border border-slate-200 text-slate-700 py-1.5 px-3 rounded-full transition-all"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                className={`flex gap-3 max-w-[88%] sm:max-w-[78%] ${
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-none w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-xs ${
                    isUser
                      ? "bg-slate-700 text-white"
                      : "bg-[#0066cc] text-white"
                  }`}
                  aria-hidden="true"
                >
                  {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Bubble */}
                <div className="flex flex-col">
                  <div
                    className={`p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-xs whitespace-pre-wrap ${
                      isUser
                        ? "bg-[#0066cc] text-white rounded-2xl rounded-tr-xs"
                        : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-xs"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.timestamp && (
                    <span
                      className={`text-[10px] text-slate-400 mt-1 px-1 ${
                        isUser ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-end">
              <div className="w-8 h-8 rounded-full bg-[#0066cc] text-white flex items-center justify-center flex-none">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
                <span className="text-xs text-slate-500 mr-1">AkuCare sedang mengetik</span>
                <span className="w-1.5 h-1.5 bg-[#0066cc] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-[#0066cc] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-[#0066cc] rounded-full animate-bounce"></span>
              </div>
            </div>
          )}

          {errorNotice && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
              <AlertCircle size={16} />
              <span>{errorNotice}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ================= INPUT FOOTER ================= */}
      <footer className="flex-none bg-white border-t border-slate-200 p-3 sm:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-4xl mx-auto flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pertanyaan seputar kesehatan Anda di sini..."
            aria-label="Ketik pesan untuk chatbot AI"
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:bg-white transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex-none w-11 h-11 bg-[#0066cc] hover:bg-[#0052a3] text-white rounded-full flex items-center justify-center shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Kirim Pesan"
          >
            <Send size={18} className="translate-x-0.5" />
          </button>
        </form>
        <p className="max-w-4xl mx-auto text-[10px] text-center text-slate-400 mt-2">
          Tekan Enter untuk mengirim pesan • Didukung oleh model AI Groq
        </p>
      </footer>
    </div>
  );
}

/* ============================================================
   CHATBOT SHEET (COMPATIBILITY FALLBACK MODAL)
   ============================================================ */
export function ChatbotSheet({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chatbot Pendamping Aku Care"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4"
    >
      <div className="w-full sm:max-w-xl h-[85vh] sm:h-[650px] bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <Chatbot go={() => onClose()} />
      </div>
    </div>
  );
}

export default Chatbot;
