import { useState, useEffect, useRef, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

interface Message {
  id: string;
  user_id: string;
  display_name: string;
  content: string;
  created_at: string;
}

interface ChatRoomProps {
  userId: string;
  displayName: string;
  channelName?: string;
  onClose: () => void;
}

/**
 * Ruang Chat realtime menggunakan Supabase Realtime channels.
 * Pesan baru langsung muncul tanpa refresh melalui subscribe INSERT.
 */
export default function ChatRoom({
  userId,
  displayName,
  channelName = "chat_public",
  onClose,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 1. Muat pesan awal dari tabel `chat_messages`
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(50);

      if (!error && data) {
        setMessages(data as Message[]);
      }
      setLoading(false);
    };

    fetchMessages();
  }, []);

  // 2. Langganan Realtime — pesan baru langsung muncul
  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName]);

  // 3. Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Kirim pesan
  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const content = inputValue.trim();
    if (!content) return;

    setSending(true);
    const { error } = await supabase.from("chat_messages").insert({
      user_id: userId,
      display_name: displayName,
      content,
    });

    if (!error) {
      setInputValue("");
    }
    setSending(false);
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
    >
      <section className="chatroom-modal">
        {/* Header */}
        <div className="phq9-header">
          <div>
            <span className="modal-kicker">RUANG CHAT REALTIME</span>
            <h2 id="chatroom-title">Konsultasi &amp; Percakapan</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Tutup ruang chat">✕</button>
        </div>

        {/* Daftar Pesan */}
        <div
          className="chatroom-messages"
          role="log"
          aria-live="polite"
          aria-label="Pesan percakapan"
          aria-atomic="false"
        >
          {loading && (
            <p className="chatroom-loading" aria-busy="true">Memuat pesan…</p>
          )}
          {!loading && messages.length === 0 && (
            <p className="chatroom-empty">Belum ada pesan. Mulai percakapan!</p>
          )}
          {messages.map((msg) => {
            const isOwn = msg.user_id === userId;
            return (
              <div
                key={msg.id}
                className={`chatroom-bubble ${isOwn ? "own" : "other"}`}
                aria-label={`Pesan dari ${msg.display_name}: ${msg.content}`}
              >
                {!isOwn && (
                  <span className="chatroom-sender">{msg.display_name}</span>
                )}
                <p className="chatroom-text">{msg.content}</p>
                <time
                  className="chatroom-time"
                  dateTime={msg.created_at}
                  aria-label={`Dikirim pada ${new Date(msg.created_at).toLocaleTimeString("id-ID")}`}
                >
                  {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            );
          })}
          <div ref={bottomRef} aria-hidden="true" />
        </div>

        {/* Input Pesan */}
        <form className="chatroom-form" onSubmit={handleSend} aria-label="Kirim pesan baru">
          <label htmlFor="chat-input" className="sr-only">Ketik pesan</label>
          <input
            id="chat-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ketik pesan…"
            aria-required="true"
            disabled={sending}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={sending || !inputValue.trim()}
            aria-label="Kirim pesan"
          >
            {sending ? "…" : "Kirim"}
          </button>
        </form>
      </section>
    </div>
  );
}
