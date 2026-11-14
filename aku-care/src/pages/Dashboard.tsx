import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconName } from "../components/ui/Icons";
import { Brand } from "../components/ui/Brand";
import { AppHeader } from "../components/layout/AppHeader";
import { supabase } from "../lib/supabase";
import { TalkbackProvider } from "../Talkback";
import { DoctorSection } from "../Dokter";
import { ChatbotSheet } from "../Chatbot";
import PHQ9Screen from "../components/PHQ9Screen";
import ChatRoom from "../components/ChatRoom";
import NearbyHospitalsMap from "../RumahSakit";
import { activateVibration, setColorBlindMode } from "../utils/accessibility";
import { publicArticles } from "../data/publicArticles";
import type { View } from "../App";

type ColorBlindMode = "normal" | "protanopia" | "deuteranopia" | "tritanopia";

const dashboardServices: { icon: IconName; title: string; text: string; tag?: string }[] = [
  { icon: "hospital", title: "Rumah Sakit Terdekat", text: "Peta dan daftar layanan di sekitar Anda" },
  { icon: "ambulance", title: "Panggil Ambulans", text: "Permintaan penjemputan terdekat", tag: "Simulasi" },
  { icon: "brain", title: "Tes Kesehatan Mental", text: "PHQ-9, GAD-7, DASS-21, dan Big Five" },
  { icon: "doctor", title: "Konsultasi Dokter", text: "Pesan langsung dengan dokter terverifikasi" },
  { icon: "bot", title: "Chatbot Pendamping", text: "Informasi umum dan panduan aplikasi" },
  { icon: "book", title: "Informasi Kesehatan", text: "Artikel terkurasi dari sumber kredibel" },
];

const serviceIconStyles: Partial<Record<IconName, string>> = {
  ambulance: "text-[#c63e4a] bg-[#ffeaec]",
  brain: "text-[#7257b5] bg-[#efebff]",
  doctor: "text-[#147d76] bg-[#e5f5f2]",
};

const sidebarMenu: { icon: IconName; label: string }[] = [
  { icon: "home", label: "Beranda" },
  { icon: "phone", label: "Darurat" },
  { icon: "brain", label: "Tes Kesehatan" },
  { icon: "message", label: "Konsultasi" },
  { icon: "book", label: "Informasi" },
];

/* ------------------------------ Utilities ------------------------------ */
const EASE = [0.22, 1, 0.36, 1] as const;

function formatTanggalIndo(d: Date) {
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

function getSapaan(d: Date) {
  const h = d.getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

export default function Dashboard({ go, user }: { go: (view: View) => void; user: User }) {
  const [voice, setVoice] = useState(false);
  const [vibration, setVibration] = useState(false);
  const [cbMode, setCbMode] = useState<ColorBlindMode>("normal");
  const [sos, setSos] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [showPHQ9, setShowPHQ9] = useState(false);
  const [showNearbyHospitals, setShowNearbyHospitals] = useState(false);
  const [notice, setNotice] = useState("");

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const displayName = (meta.full_name as string) || (meta.username as string) || user.email || "Budi Pratama";
  const firstName = displayName.split(" ")[0];
  const initials = displayName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "BP";

  const today = useMemo(() => new Date(), []);
  const tanggalIndo = useMemo(() => formatTanggalIndo(today), [today]);
  const sapaan = useMemo(() => getSapaan(today), [today]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2800);
    return () => clearTimeout(timeout);
  }, [notice]);

  const toggleVoice = () => {
    const next = !voice;
    setVoice(next);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (next) {
        const utterance = new SpeechSynthesisUtterance("Mode suara aktif. Anda berada di dasbor Aku Care.");
        utterance.lang = "id-ID";
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const toggleVibration = () => {
    const next = !vibration;
    setVibration(next);
    if (next) activateVibration([200, 100, 200]);
    setNotice(next ? "Mode getaran aktif" : "Mode getaran nonaktif");
  };

  const handleColorBlind = (mode: ColorBlindMode) => {
    setCbMode(mode);
    setColorBlindMode(mode);
    setNotice(`Mode warna: ${mode}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    go("landing");
  };

  const handleServiceClick = (serviceTitle: string, icon: IconName) => {
    if (icon === "ambulance" || serviceTitle === "Panggil Ambulans") {
      if (vibration) activateVibration([300, 100, 300]);
      setSos(true);
    } else if (serviceTitle === "Rumah Sakit Terdekat") {
      go("lokasi");
    } else if (serviceTitle === "Chatbot Pendamping") {
      go("chatbot");
    } else if (serviceTitle === "Konsultasi Dokter") {
      go("chat");
    } else if (serviceTitle === "Tes Kesehatan Mental") {
      go("tes_mental");
    } else if (serviceTitle === "Informasi Kesehatan") {
      go("informasi_detail");
    } else {
      setNotice(`${serviceTitle} dibuka`);
    }
  };

  /* ------------------------------ Variants ------------------------------ */
  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };
  const staggerItem = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };

  return (
    <TalkbackProvider voiceModeActive={voice}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-[#f6f8fb] font-sans text-slate-800"
      >
        <a
          className="fixed z-[100] left-4 -top-16 focus:top-4 px-4 py-2.5 rounded-lg text-white bg-[#082d58] transition-all shadow-lg"
          href="#dashboard-main"
        >
          Lewati ke konten utama
        </a>

        {/* ================= SIDEBAR (desktop & tablet) ================= */}
        <aside className="fixed z-20 inset-y-0 left-0 w-[240px] lg:w-[260px] hidden md:flex flex-col bg-white border-r border-slate-200">
          <div className="h-[76px] flex items-center px-6 border-b border-slate-100">
            <Brand />
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1" aria-label="Menu utama">
            <span className="px-3 mb-2 text-slate-400 text-[10px] font-bold tracking-[0.15em] uppercase">
              Menu Utama
            </span>
            {sidebarMenu.map(({ icon, label }, index) => (
              <button
                key={label}
                onClick={
                  index === 1
                    ? () => setSos(true)
                    : label === "Tes Kesehatan"
                    ? () => go("tes_mental")
                    : label === "Konsultasi"
                    ? () => go("chat")
                    : label === "Informasi"
                    ? () => go("informasi_detail")
                    : () => setNotice(`${label} dibuka`)
                }
                className={`min-h-[44px] flex items-center gap-3 px-3 rounded-xl text-[13px] font-medium text-left transition-all ${
                  index === 0
                    ? "text-[#0066cc] bg-[#eaf4ff] shadow-[inset_2px_0_0_#0066cc]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon name={icon} size={18} /> {label}
              </button>
            ))}

            <span className="px-3 mt-6 mb-2 text-slate-400 text-[10px] font-bold tracking-[0.15em] uppercase">
              Pengelolaan
            </span>
            <button
              onClick={() => go("profil")}
              className="min-h-[44px] flex items-center gap-3 px-3 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <Icon name="user" size={18} /> Profil & Info Medis
            </button>
            <button
              onClick={() => go("pengaturan")}
              className="min-h-[44px] flex items-center gap-3 px-3 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <Icon name="settings" size={18} /> Pengaturan
            </button>
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="min-w-0 flex-1">
                <strong className="block text-[13px] text-slate-800 truncate">{displayName}</strong>
                <small className="block text-[11px] text-slate-500 truncate">
                  {(meta.username as string) || "Pengguna"}
                </small>
              </div>
              <button
                onClick={handleLogout}
                className="px-2 py-1 border-0 rounded-md bg-transparent text-[11px] font-semibold text-slate-400 hover:text-red-500 transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </aside>

        {/* ================= KONTEN UTAMA ================= */}
        <div className="md:ml-[240px] lg:ml-[260px] flex flex-col min-h-screen">
          
          {/* HEADER REUSABLE */}
          <AppHeader
            user={user}
            hideBrand={true}
            onNotify={(msg) => setNotice(msg)}
          />

          {/* Main content */}
          <main
            id="dashboard-main"
            className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8"
          >
            {/* Welcome */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
            >
              <div>
                <span className="text-slate-500 text-[11px] font-bold tracking-[0.15em] uppercase">
                  {tanggalIndo}
                </span>
                <h1 className="mt-1.5 text-[#082d58] font-manrope font-extrabold text-2xl sm:text-3xl tracking-tight">
                  {sapaan}, {firstName}.
                </h1>
                <p className="mt-1.5 text-slate-500 text-[14px]">
                  Akses layanan dan informasi kesehatan Anda dari satu tempat.
                </p>
              </div>
              <button
                onClick={() => go("pengaturan")}
                className="hidden sm:flex h-[42px] items-center gap-2 px-4 border border-slate-200 rounded-xl text-slate-700 bg-white text-[13px] font-semibold hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Icon name="settings" size={18} /> Pengaturan Aksesibilitas
              </button>
            </motion.section>

            {/* Hero Banner */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05, ease: EASE }}
              className="relative flex overflow-hidden rounded-2xl text-white bg-gradient-to-r from-[#082d58] via-[#004fa3] to-[#0066cc] shadow-[0_8px_30px_#082d581a] min-h-[220px] sm:min-h-[240px]"
            >
              <div className="relative z-10 w-full sm:w-[80%] md:w-[65%] p-6 sm:p-8 md:p-10">
                <span className="inline-flex items-center gap-1.5 text-[#b9dcff] text-[10px] font-bold tracking-[0.15em] uppercase">
                  <Icon name="shield" size={14} /> Pendamping Kesehatan Anda
                </span>
                <h2 className="mt-3 font-manrope font-bold text-xl sm:text-2xl md:text-[28px] leading-snug">
                  Layanan kesehatan yang dapat
                  <br className="hidden sm:block" /> Anda akses secara mandiri.
                </h2>
                <p className="max-w-md mt-2.5 text-[#c2d9ef] text-[13px] leading-relaxed">
                  Gunakan skrining kesehatan mental, konsultasi dokter, layanan darurat, dan informasi tepercaya sesuai kebutuhan Anda.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => go("chat")}
                  className="min-h-[42px] flex items-center gap-2 mt-6 px-5 rounded-lg text-[#0755a3] bg-white text-[13px] font-bold hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Mulai Konsultasi <Icon name="arrow" size={16} />
                </motion.button>
              </div>
              <img
                src="/fitur-0.jpg"
                alt="Dokter profesional Aku Care"
                className="absolute z-[1] -right-[40px] sm:right-[20px] -bottom-[40px] w-[220px] h-[300px] object-cover rounded-t-full opacity-30 sm:opacity-100 pointer-events-none"
              />
            </motion.section>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8 mt-8">
              {/* Kolom kiri */}
              <div className="min-w-0 flex flex-col gap-8">
                {/* Layanan Utama */}
                <section>
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <h2 className="text-[#082d58] font-manrope font-bold text-lg">Layanan Utama</h2>
                      <p className="mt-1 text-slate-500 text-[13px]">
                        Seluruh layanan tersedia untuk akun Anda
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 py-1 px-2.5 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-100 text-[11px] font-bold">
                      <Icon name="shield" size={13} /> Akses Aktif
                    </span>
                  </div>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                  >
                    {dashboardServices.map((service) => (
                      <motion.button
                        key={service.title}
                        variants={staggerItem}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={
                          service.title === "Rumah Sakit Terdekat"
                            ? () => go("lokasi")
                            : service.title === "Chatbot Pendamping"
                            ? () => go("chatbot")
                            : service.title === "Konsultasi Dokter"
                            ? () => go("chat")
                            : service.title === "Tes Kesehatan Mental"
                            ? () => go("tes_mental")
                            : service.title === "Panggil Ambulans"
                            ? () => setSos(true)
                            : service.title === "Informasi Kesehatan"
                            ? () => go("informasi_detail")
                            : () => handleServiceClick(service.title, service.icon)
                        }
                        aria-label={`Buka layanan ${service.title}`}
                        className="min-h-[84px] grid grid-cols-[48px_1fr_auto] items-center gap-4 p-4 border border-slate-200 rounded-xl text-slate-600 bg-white text-left transition-all hover:border-[#b9d6f2] hover:shadow-[0_8px_24px_#082d5810] group"
                      >
                        <span
                          className={`w-12 h-12 grid place-items-center rounded-xl ${
                            serviceIconStyles[service.icon] ?? "text-[#0066cc] bg-[#eaf4ff]"
                          }`}
                        >
                          <Icon name={service.icon} size={24} />
                        </span>
                        <span>
                          <strong className="block text-slate-800 text-[14px] group-hover:text-[#0066cc] transition-colors">
                            {service.title}{" "}
                            {service.tag && (
                              <em className="ml-1.5 py-0.5 px-1.5 rounded text-amber-700 bg-amber-100 text-[10px] not-italic uppercase font-bold">
                                {service.tag}
                              </em>
                            )}
                          </strong>
                          <small className="block mt-1 text-slate-500 text-[12px] leading-snug">
                            {service.text}
                          </small>
                        </span>
                        <Icon
                          name="arrow"
                          size={18}
                          className="text-slate-300 group-hover:text-[#0066cc] transition-colors"
                        />
                      </motion.button>
                    ))}
                  </motion.div>
                </section>

                {/* Artikel */}
                <section>
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <h2 className="text-[#082d58] font-manrope font-bold text-lg">Informasi Pilihan</h2>
                      <p className="mt-1 text-slate-500 text-[13px]">
                        Ringkasan terbaru dari sumber kesehatan kredibel
                      </p>
                    </div>
                    <button
                      onClick={() => go("informasi_detail")}
                      className="flex items-center gap-1 p-1 border-0 text-[#0066cc] bg-transparent text-[13px] font-bold hover:underline"
                    >
                      Lihat semua <Icon name="arrow" size={15} />
                    </button>
                  </div>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    {publicArticles.map((article) => (
                      <motion.article
                        key={article.title}
                        variants={staggerItem}
                        className="p-5 border border-slate-200 rounded-xl bg-white flex flex-col justify-between hover:border-[#b9d6f2] hover:shadow-[0_8px_24px_#082d5810] transition-all group"
                      >
                        <div>
                          <span className="text-[#0066cc] text-[10px] font-bold uppercase tracking-wider">
                            {article.type}
                          </span>
                          <h3 className="mt-2 text-slate-800 font-manrope font-bold text-[14px] leading-snug group-hover:text-[#0066cc] transition-colors">
                            {article.title}
                          </h3>
                          <p className="mt-3 text-slate-400 text-[11px] font-medium">
                            {article.source}
                          </p>
                        </div>
                        <button
                          onClick={() => go("informasi_detail")}
                          className="flex items-center gap-1.5 mt-4 p-0 border-0 text-[#0066cc] bg-transparent text-[12px] font-bold hover:gap-2.5 transition-all w-fit"
                        >
                          Baca artikel <Icon name="arrow" size={14} />
                        </button>
                      </motion.article>
                    ))}
                  </motion.div>
                </section>
              </div>

              {/* Kolom kanan */}
              <aside className="flex flex-col gap-4 sm:gap-6">
                {/* Riwayat */}
                <section className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-[#082d58] font-manrope font-bold text-base">Riwayat Skrining</h2>
                      <p className="mt-1 text-slate-500 text-[12px]">Hasil tersimpan pribadi</p>
                    </div>
                    <span className="text-[#0066cc]">
                      <Icon name="brain" size={22} />
                    </span>
                  </div>

                  <div className="pt-6 pb-2 text-center">
                    <span className="w-12 h-12 grid place-items-center mx-auto rounded-full text-slate-400 bg-slate-100">
                      <Icon name="book" size={22} />
                    </span>
                    <strong className="block mt-3 text-slate-800 text-[14px]">
                      Belum ada hasil tes
                    </strong>
                    <p className="mt-1.5 mx-auto text-slate-500 text-[12px] leading-relaxed">
                      Mulai skrining awal untuk memantau kondisi kesehatan mental Anda.
                    </p>
                    <button
                      onClick={() => go("tes_mental")}
                      className="mt-4 py-2 px-4 border border-[#b9d6f2] rounded-lg text-[#0066cc] bg-[#eaf4ff] text-[12px] font-bold hover:bg-[#d8eaff] transition-colors"
                    >
                      Lihat katalog tes
                    </button>
                  </div>

                  <small className="block pt-4 mt-2 border-t border-slate-100 text-slate-400 text-[11px] text-center">
                    Hasil skrining bukan diagnosis medis.
                  </small>
                </section>

                <DoctorSection
                  voiceModeActive={voice}
                  onOpenChat={() => go("chat")}
                />

              </aside>
            </div>
          </main>
        </div>

        {/* ================= MODAL SOS ================= */}
        <AnimatePresence>
          {sos && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="presentation"
              onMouseDown={(e) => e.target === e.currentTarget && setSos(false)}
              onKeyDown={(e) => e.key === "Escape" && setSos(false)}
              className="fixed inset-0 z-[80] grid place-items-center p-5 bg-slate-900/60 backdrop-blur-sm"
            >
              <motion.section
                initial={{ opacity: 0, scale: 0.93, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 12 }}
                transition={{ type: "spring", damping: 25, stiffness: 320 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sos-title"
                className="relative w-full max-w-[430px] p-6 sm:p-8 rounded-2xl bg-white shadow-2xl text-center"
              >
                <button
                  onClick={() => setSos(false)}
                  aria-label="Tutup"
                  className="absolute right-4 top-4 w-9 h-9 grid place-items-center border-0 rounded-lg text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <Icon name="close" size={18} />
                </button>
                <div className="w-16 h-16 grid place-items-center mx-auto mb-4 rounded-full text-red-600 bg-red-50">
                  <Icon name="phone" size={32} />
                </div>
                <p className="text-red-600 text-[11px] font-extrabold tracking-widest uppercase">
                  Bantuan Darurat
                </p>
                <h2 id="sos-title" className="mt-2 text-[#082d58] font-manrope font-bold text-2xl">
                  Anda membutuhkan bantuan?
                </h2>
                <p className="mt-2 text-slate-500 text-[13px]">
                  Hubungi layanan darurat nasional atau gunakan simulasi ambulans terdekat.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  <a
                    href="tel:119"
                    className="min-h-[44px] flex items-center justify-center gap-2 rounded-xl text-white bg-red-600 no-underline text-[13px] font-bold hover:bg-red-700 transition-colors shadow-sm"
                  >
                    <Icon name="phone" size={18} /> Telepon 119
                  </a>
                  <a
                    href="tel:112"
                    className="min-h-[44px] flex items-center justify-center gap-2 rounded-xl text-white bg-red-600 no-underline text-[13px] font-bold hover:bg-red-700 transition-colors shadow-sm"
                  >
                    <Icon name="phone" size={18} /> Telepon 112
                  </a>
                </div>
                <button
                  onClick={() => {
                    setSos(false);
                    setNotice("Simulasi pencarian ambulans dimulai");
                  }}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 mt-3 border border-[#b9d6f2] rounded-xl text-[#0066cc] bg-[#eaf4ff] text-[13px] font-bold hover:bg-[#d8eaff] transition-colors"
                >
                  <Icon name="ambulance" size={18} /> Cari ambulans terdekat
                  <span className="py-0.5 px-1.5 rounded text-amber-700 bg-amber-200 text-[10px] uppercase font-bold">
                    Simulasi
                  </span>
                </button>
                <small className="block mt-4 text-slate-400 text-[11px]">
                  Untuk kondisi gawat darurat, segera hubungi 119 atau 112.
                </small>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= MODAL PETA RUMAH SAKIT ================= */}
        <AnimatePresence>
          {showNearbyHospitals && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[9999] flex flex-col bg-[#f3f4f6]"
            >
              <div className="flex-1 relative overflow-hidden">
                <NearbyHospitalsMap 
                  user={user} 
                  onNotify={(msg: string) => setNotice(msg)} 
                  onBack={() => setShowNearbyHospitals(false)} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Fitur Lanjutan */}
        {showChatbot && <ChatbotSheet onClose={() => setShowChatbot(false)} />}
        {showPHQ9 && <PHQ9Screen onClose={() => setShowPHQ9(false)} />}
        {showChatRoom && (
          <ChatRoom
            userId={user.id}
            displayName={displayName}
            channelName={`chat_${user.id}`}
            onClose={() => setShowChatRoom(false)}
          />
        )}

        {/* Toast */}
        <div
          role="status"
          className={`fixed z-[100] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] sm:w-auto px-5 py-3 rounded-xl text-white bg-slate-800 shadow-xl text-[13px] font-medium text-center transition-all duration-300 ${
            notice ? "bottom-6 opacity-100 translate-y-0" : "-bottom-16 opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          {notice}
        </div>
      </motion.div>
    </TalkbackProvider>
  );
}