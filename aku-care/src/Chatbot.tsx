import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Bot, User, AlertCircle, Sparkles, RefreshCw } from "lucide-react";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatbotProps {
  go?: (view: any) => void;
}

export function Chatbot({ go }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Halo! Saya asisten virtual AkuCare. Ada yang bisa saya bantu terkait informasi kesehatan umum atau panduan aplikasi kami? Silakan sampaikan pertanyaan Anda.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const userText = input.trim();
    if (!userText || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setErrorMsg(null);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content:
                "Anda adalah asisten virtual AkuCare. Jawab dengan ringkas dan ramah. Jangan berikan diagnosis medis pasti. Arahkan ke 119 jika gawat darurat.",
            },
            ...newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(
          errData?.error?.message || `Gagal menghubungi server AI (Kode: ${response.status})`
        );
      }

      const data = await response.json();
      const reply =
        data.choices?.[0]?.message?.content ||
        "Maaf, saya tidak dapat memproses jawaban saat ini.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      console.error("Chatbot error:", err);
      const fallbackMsg =
        err?.message || "Terjadi kesalahan saat menghubungkan ke asisten AI.";
      setErrorMsg(fallbackMsg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Mohon maaf, terjadi kendala: ${fallbackMsg}. Jika Anda mengalami kondisi darurat medis, segera hubungi 119.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (go) {
      go("dashboard");
    } else {
      window.history.back();
    }
  };

  return (
    <div className="chatbot-page min-h-screen h-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans">
      {/* Top Header */}
      <header className="h-16 px-4 sm:px-6 bg-[#0066cc] text-white flex items-center justify-between shadow-md shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Kembali ke Dashboard"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Dashboard</span>
          </button>
          <div className="hidden sm:block h-6 w-px bg-white/20 mx-1" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Sparkles size={18} className="text-amber-300" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold leading-tight">
                Chatbot Pendamping AkuCare
              </h1>
              <span className="text-[11px] text-blue-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Llama 3 8B • Aktif
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:119"
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold tracking-wide uppercase transition-colors"
          >
            <AlertCircle size={13} />
            Darurat 119
          </a>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 md:py-6 max-w-4xl w-full mx-auto flex flex-col gap-4">
        {/* Banner Informasi / Disclaimer */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 sm:p-4 text-amber-900 text-xs sm:text-[13px] flex items-start gap-3 shadow-sm shrink-0">
          <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold block mb-0.5">Catatan Medis Penting:</strong>
            Asisten AI AkuCare memberikan informasi kesehatan umum dan panduan aplikasi. Asisten ini
            tidak memberikan diagnosis medis definitif atau resep obat. Apabila mengalami kegawatan,
            segera telepon <strong className="text-red-700 font-bold">119</strong> atau datangi IGD
            terdekat.
          </div>
        </div>

        {/* Message Bubbles */}
        <div className="flex-1 flex flex-col gap-4">
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm ${
                    isUser ? "bg-[#0066cc]" : "bg-emerald-600"
                  }`}
                >
                  {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Bubble Body */}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? "bg-[#0066cc] text-white rounded-tr-none"
                      : "bg-white border border-slate-200/90 text-slate-800 rounded-tl-none whitespace-pre-wrap"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 mr-auto items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs shrink-0 shadow-sm">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-500 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                <span
                  className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
                <span className="ml-1 text-slate-400">Mengetik balasan...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Bar */}
      <footer className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={handleSend}
          className="max-w-4xl mx-auto flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan keluhan kesehatan, tips nutrisi, atau penggunaan aplikasi..."
            aria-label="Pesan Anda untuk Asisten AkuCare"
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/30 focus:border-[#0066cc] transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="h-11 px-5 rounded-xl bg-[#0066cc] hover:bg-[#0052a3] disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0066cc]/40 shrink-0"
            aria-label="Kirim Pesan"
          >
            <span>Kirim</span>
            <Send size={15} />
          </button>
        </form>
        <div className="max-w-4xl mx-auto mt-2 text-center text-[11px] text-slate-400">
          AkuCare AI Assistant • Jawaban dihasilkan oleh Llama 3 8B melalui Groq Cloud
        </div>
      </footer>
    </div>
  );
}

export function ChatbotSheet({ onClose }: { onClose: () => void }) {
  return <Chatbot go={() => onClose()} />;
}

export default Chatbot;
