import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconName } from "../components/ui/Icons";
import { Brand } from "../components/ui/Brand";
import { supabase } from "../lib/supabase";
import { TalkbackProvider } from "../Talkback";
import { DoctorSection } from "../Dokter";
import { ChatbotSheet } from "../Chatbot";
import PHQ9Screen from "../components/PHQ9Screen";
import HospitalMap from "../components/HospitalMap";
import ChatRoom from "../components/ChatRoom";
import { activateVibration, setColorBlindMode } from "../utils/accessibility";
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

const publicArticles = [
  {
    type: "Edukasi Kesehatan",
    title: "Langkah sederhana menjaga kesehatan mental setiap hari",
    summary: "Kenali kebiasaan yang membantu menjaga kesehatan emosi dan kapan perlu menghubungi tenaga profesional.",
    source: "Sumber: Kementerian Kesehatan RI",
    date: "8 Nov 2026",
    theme: "mental",
  },
  {
    type: "Pertolongan Pertama",
    title: "Panduan awal menghadapi kondisi pingsan",
    summary: "Pelajari langkah aman yang dapat dilakukan sembari menunggu bantuan tenaga kesehatan.",
    source: "Sumber: Kementerian Kesehatan RI",
    date: "6 Nov 2026",
    theme: "firstaid",
  },
  {
    type: "Gizi",
    title: "Memahami pola gizi seimbang untuk keluarga",
    summary: "Ringkasan praktis mengenai variasi makanan, porsi, dan kebiasaan makan sehat.",
    source: "Sumber: Kementerian Kesehatan RI",
    date: "4 Nov 2026",
    theme: "nutrition",
  },
];

const serviceIconStyles: Partial<Record<IconName, string>> = {
  ambulance: "text-[#c63e4a] bg-[#ffeaec]",
  brain: "text-[#7257b5] bg-[#efebff]",
  doctor: "text-[#147d76] bg-[#e5f5f2]",
};

export default function Dashboard({ go, user }: { go: (view: View) => void; user: User }) {
  const [voice, setVoice] = useState(false);
  const [vibration, setVibration] = useState(false);
  const [cbMode, setCbMode] = useState<ColorBlindMode>("normal");
  const [sos, setSos] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [showPHQ9, setShowPHQ9] = useState(false);
  const [showHospitalMap, setShowHospitalMap] = useState(false);
  const [notice, setNotice] = useState("");

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const displayName = (meta.full_name as string) || (meta.username as string) || user.email || "Budi Pratama";
  const firstName = displayName.split(" ")[0];
  const initials = displayName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "BP";

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
    if (icon === "ambulance") {
      if (vibration) activateVibration([300, 100, 300]);
      setSos(true);
    } else if (serviceTitle === "Tes Kesehatan Mental") {
      setShowPHQ9(true);
    } else if (serviceTitle === "Rumah Sakit Terdekat") {
      setShowHospitalMap(true);
    } else if (serviceTitle === "Chatbot Pendamping") {
      setShowChatbot(true);
    } else if (serviceTitle === "Konsultasi Dokter") {
      setShowChatRoom(true);
    } else {
      setNotice(`${serviceTitle} dibuka`);
    }
  };

  return (
    <TalkbackProvider voiceModeActive={voice}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-canvas font-sans text-text"
      >
        <a
          className="fixed z-[100] left-[15px] -top-[60px] focus:top-3 px-4 py-2.5 rounded-[7px] text-white bg-navy transition-all"
          href="#dashboard-main"
        >
          Lewati ke konten utama
        </a>

        {/* Sidebar Desktop & Tablet */}
        <aside className="fixed z-20 inset-y-0 left-0 w-[205px] lg:w-[235px] hidden md:flex flex-col pt-[25px] px-[17px] pb-[17px] border-r border-[#dce6f0] bg-white">
          <div className="px-2 pb-[27px]">
            <Brand />
          </div>

          <nav className="flex flex-col gap-[3px]" aria-label="Menu utama dasbor">
            <span className="mx-2.5 mt-[13px] mb-[5px] text-[#9aa7b4] text-[7.5px] font-extrabold tracking-[0.12em]">
              MENU UTAMA
            </span>
            {(
              [
                ["home", "Beranda"],
                ["phone", "Darurat"],
                ["brain", "Tes Kesehatan"],
                ["message", "Konsultasi"],
                ["book", "Informasi"],
              ] as [IconName, string][]
            ).map(([icon, label], index) => (
              <button
                key={label}
                onClick={() => (index === 1 ? setSos(true) : setNotice(`${label} dibuka`))}
                className={`min-h-[43px] flex items-center gap-[11px] px-[11px] border-0 rounded-lg text-[10px] text-left transition-colors ${
                  index === 0
                    ? "text-blue bg-pale font-bold"
                    : "text-[#60758a] bg-transparent hover:bg-slate-50 hover:text-navy"
                }`}
              >
                <Icon name={icon} /> {label}
              </button>
            ))}

            <span className="mx-2.5 mt-[13px] mb-[5px] text-[#9aa7b4] text-[7.5px] font-extrabold tracking-[0.12em]">
              PENGELOLAAN
            </span>
            <button
              onClick={() => setNotice("Profil medis dibuka")}
              className="min-h-[43px] flex items-center gap-[11px] px-[11px] border-0 rounded-lg text-[10px] text-left text-[#60758a] bg-transparent hover:bg-slate-50 hover:text-navy transition-colors"
            >
              <Icon name="user" /> Profil & Info Medis
            </button>
            <button
              onClick={() => setNotice("Pengaturan aksesibilitas dibuka")}
              className="min-h-[43px] flex items-center gap-[11px] px-[11px] border-0 rounded-lg text-[10px] text-left text-[#60758a] bg-transparent hover:bg-slate-50 hover:text-navy transition-colors"
            >
              <Icon name="settings" /> Pengaturan
            </button>
          </nav>

          <div className="flex items-center gap-2 mt-auto pt-[13px] px-[5px] border-t border-[#edf1f5]">
            <div className="w-[34px] h-[34px] flex-none grid place-items-center rounded-[9px] text-white bg-[#365e86] text-[9px] font-extrabold">
              {initials}
            </div>
            <span className="min-w-0 flex-1">
              <strong className="block text-[9px] truncate">{displayName}</strong>
              <small className="block mt-0.5 text-[#8291a0] text-[7px] truncate">
                {(meta.username as string) || "Pengguna"}
              </small>
            </span>
            <button
              onClick={handleLogout}
              className="p-[3px] border-0 bg-transparent text-[#8a98a6] text-[7.5px] hover:text-danger transition-colors"
            >
              Keluar
            </button>
          </div>
        </aside>

        {/* Konten Utama */}
        <div className="md:ml-[205px] lg:ml-[235px]">
          {/* Topbar */}
          <header className="sticky md:static z-25 top-0 h-[68px] flex items-center justify-between px-[18px] md:px-8 border-b border-[#dce6f0] bg-white/95 backdrop-blur-sm">
            <div className="block md:hidden">
              <Brand />
            </div>

            <label className="hidden md:flex w-[330px] h-[36px] items-center gap-2 px-[11px] border border-[#dce5ee] rounded-[7px] text-[#8493a2] bg-[#f8fafc] focus-within:border-blue transition-colors">
              <Icon name="search" size={18} />
              <input
                className="min-w-0 flex-1 border-0 outline-none bg-transparent text-[9px] text-text"
                placeholder="Cari layanan atau informasi"
                aria-label="Cari layanan atau informasi"
              />
            </label>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoice}
                className={`h-[34px] w-[34px] md:w-auto flex items-center justify-center gap-1.5 p-0 md:px-[11px] border rounded-[7px] text-[8.5px] transition-colors ${
                  voice
                    ? "text-blue border-[#a8ccec] bg-pale font-semibold"
                    : "text-[#5f7388] border-[#dbe5ee] bg-white hover:bg-slate-50"
                }`}
              >
                <Icon name="volume" size={17} />
                <span className="hidden md:inline">{voice ? "Suara aktif" : "Mode suara"}</span>
              </button>
              <button
                className="w-[34px] h-[34px] grid place-items-center border border-[#dbe5ee] rounded-[7px] text-[#65778a] bg-white hover:bg-slate-50 transition-colors"
                aria-label="Notifikasi"
              >
                <Icon name="bell" />
              </button>
              <div className="w-[34px] h-[34px] grid flex-none place-items-center rounded-[9px] text-white bg-[#365e86] text-[9px] font-extrabold">
                {initials}
              </div>
            </div>
          </header>

          <main id="dashboard-main" className="mx-auto px-[18px] pt-[22px] pb-[80px] md:px-8 md:pt-[27px] md:pb-[55px]">
            {/* Welcome Header */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-start sm:items-end justify-between mb-5 gap-3"
            >
              <div>
                <span className="text-[#8798a8] text-[7.5px] font-extrabold tracking-[0.11em]">
                  KAMIS, 8 NOVEMBER 2026
                </span>
                <h1 className="mt-1.5 text-navy font-manrope font-extrabold text-[23px] tracking-[-0.03em]">
                  Selamat pagi, {firstName}.
                </h1>
                <p className="mt-[3px] text-[#718398] text-[10px]">
                  Akses layanan dan informasi kesehatan Anda dari satu tempat.
                </p>
              </div>
              <button
                onClick={() => setNotice("Pengaturan cepat dibuka")}
                className="hidden sm:flex h-[35px] items-center gap-[7px] px-[11px] border border-[#cbd9e7] rounded-[7px] text-[#45627e] bg-white text-[8.5px] hover:bg-slate-50 transition-colors"
              >
                <Icon name="settings" /> Pengaturan aksesibilitas
              </button>
            </motion.section>

            {/* Hero Banner */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="relative min-h-[300px] sm:min-h-[245px] flex overflow-hidden rounded-[14px] text-white bg-gradient-to-br from-[#082f5e] to-blue shadow-sm"
            >
              <div className="relative z-10 w-full sm:w-[85%] md:w-[70%] py-[25px] px-[22px] sm:p-[27px] md:py-8 md:px-[37px]">
                <span className="inline-flex items-center gap-[5px] text-[#b9dcff] text-[7.5px] font-extrabold tracking-[0.1em]">
                  <Icon name="shield" size={15} /> PENDAMPING KESEHATAN ANDA
                </span>
                <h2 className="mt-[13px] font-manrope font-bold text-[22px] sm:text-[26px] leading-[1.25] tracking-[-0.025em]">
                  Layanan kesehatan yang dapat
                  <br />
                  Anda akses secara mandiri.
                </h2>
                <p className="max-w-[80%] sm:max-w-[560px] mt-2 text-[#c2d9ef] text-[10px] leading-[1.6]">
                  Gunakan skrining kesehatan mental, konsultasi dokter, layanan darurat, dan informasi tepercaya sesuai kebutuhan Anda.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setNotice("Direktori dokter dibuka")}
                  className="min-h-[36px] flex items-center gap-2 mt-[17px] px-[14px] border-0 rounded-md text-[#0755a3] bg-white text-[9px] font-bold hover:bg-slate-50 transition-colors"
                >
                  Mulai konsultasi <Icon name="arrow" size={17} />
                </motion.button>
              </div>
              <img
                src="/fitur-0.jpg"
                alt="Dokter profesional Aku Care"
                className="absolute z-[1] -right-[60px] md:right-[30px] -bottom-[68px] w-[215px] h-[315px] object-cover object-[center_20%] rounded-[120px_120px_20px_20px] opacity-45 md:opacity-95 pointer-events-none"
              />
            </motion.section>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_295px] gap-[22px] mt-[25px]">
              {/* Kolom Kiri: Layanan & Artikel */}
              <div className="min-w-0">
                {/* Layanan Utama */}
                <section>
                  <div className="flex items-end justify-between mb-[13px]">
                    <div>
                      <h2 className="text-navy font-manrope font-bold text-[14px]">Layanan utama</h2>
                      <p className="mt-[3px] text-[#8191a1] text-[8px]">Seluruh layanan tersedia untuk akun Anda</p>
                    </div>
                    <span className="flex items-center gap-1 py-[5px] px-2 rounded-full text-[#147250] bg-[#e6f5ee] text-[7px] font-bold">
                      <Icon name="shield" size={14} /> Akses aktif
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[9px]">
                    {dashboardServices.map((service, idx) => (
                      <motion.button
                        key={service.title}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.08 + idx * 0.04 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleServiceClick(service.title, service.icon)}
                        aria-label={`Buka layanan ${service.title}`}
                        className="min-h-[76px] grid grid-cols-[42px_1fr_auto] items-center gap-2.5 p-3 border border-[#dce6f0] rounded-[10px] text-[#75879a] bg-white text-left transition-colors hover:border-[#b9d3ec] hover:shadow-[0_8px_18px_#244d7915]"
                      >
                        <span
                          className={`w-[42px] h-[42px] grid place-items-center rounded-[10px] ${
                            serviceIconStyles[service.icon] ?? "text-blue bg-pale"
                          }`}
                        >
                          <Icon name={service.icon} size={23} />
                        </span>
                        <span>
                          <strong className="block text-[#294158] text-[9.5px]">
                            {service.title}{" "}
                            {service.tag && (
                              <em className="ml-[5px] py-0.5 px-1 rounded-[3px] text-[#80631a] bg-[#fff1bd] text-[6px] not-italic uppercase">
                                {service.tag}
                              </em>
                            )}
                          </strong>
                          <small className="block mt-1 text-[#7f8e9d] text-[7.5px]">{service.text}</small>
                        </span>
                        <Icon name="arrow" size={16} />
                      </motion.button>
                    ))}
                  </div>
                </section>

                {/* Informasi Pilihan (Artikel) */}
                <section className="mt-6">
                  <div className="flex items-end justify-between mb-[13px]">
                    <div>
                      <h2 className="text-navy font-manrope font-bold text-[14px]">Informasi pilihan</h2>
                      <p className="mt-[3px] text-[#8191a1] text-[8px]">
                        Ringkasan terbaru dari sumber kesehatan kredibel
                      </p>
                    </div>
                    <button
                      onClick={() => setNotice("Semua informasi dibuka")}
                      className="flex items-center gap-[5px] p-1 border-0 text-blue bg-transparent text-[8px] font-bold hover:underline"
                    >
                      Lihat semua <Icon name="arrow" size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-[9px]">
                    {publicArticles.map((article, idx) => (
                      <motion.article
                        key={article.title}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.25 + idx * 0.05 }}
                        className="p-[15px] border border-[#dce6f0] rounded-[9px] bg-white flex flex-col justify-between hover:border-[#b9d3ec] transition-colors"
                      >
                        <div>
                          <span className="text-blue text-[6.5px] font-extrabold">{article.type}</span>
                          <h3 className="sm:min-h-[48px] mt-1.5 text-[#2c4359] font-manrope font-bold text-[9px] leading-[1.45]">
                            {article.title}
                          </h3>
                          <p className="mt-[7px] text-[#8a98a6] text-[6.5px]">{article.source}</p>
                        </div>
                        <button
                          onClick={() => setNotice("Artikel dibuka")}
                          className="flex items-center gap-[5px] mt-[11px] p-0 border-0 text-blue bg-transparent text-[7.5px] font-bold hover:translate-x-0.5 transition-transform w-fit"
                        >
                          Baca artikel <Icon name="arrow" size={14} />
                        </button>
                      </motion.article>
                    ))}
                  </div>
                </section>
              </div>

              {/* Kolom Kanan (Aside) */}
              <aside className="grid grid-cols-1 md:grid-cols-3 lg:flex lg:flex-col gap-[11px]">
                {/* Riwayat Skrining */}
                <section className="p-[17px] border border-[#dce6f0] rounded-[11px] bg-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-navy font-manrope font-bold text-[14px]">Riwayat skrining</h2>
                      <p className="mt-[3px] text-[#8191a1] text-[8px]">Hasil tersimpan pribadi</p>
                    </div>
                    <span className="text-blue">
                      <Icon name="brain" />
                    </span>
                  </div>

                  <div className="pt-[18px] px-[5px] pb-3 text-center">
                    <span className="w-[42px] h-[42px] grid place-items-center mx-auto rounded-full text-[#728ba3] bg-[#eff4f8]">
                      <Icon name="book" />
                    </span>
                    <strong className="block mt-[9px] text-[#344b62] text-[9.5px]">Belum ada hasil tes</strong>
                    <p className="mt-[5px] mx-auto text-[#8190a0] text-[7.5px] leading-[1.5]">
                      Mulai skrining awal untuk memantau kondisi kesehatan mental Anda.
                    </p>
                    <button
                      onClick={() => setNotice("Katalog tes dibuka")}
                      className="mt-2.5 py-[7px] px-[11px] border border-[#bed3e8] rounded-[5px] text-blue bg-[#f7fbff] text-[7.5px] font-bold hover:bg-pale transition-colors"
                    >
                      Lihat katalog tes
                    </button>
                  </div>

                  <small className="block pt-[9px] border-t border-[#edf1f5] text-[#8b98a5] text-[6.5px] text-center">
                    Hasil skrining bukan diagnosis medis.
                  </small>
                </section>

                {/* Komponen Dokter */}
                <DoctorSection
                  voiceModeActive={voice}
                  onOpenChat={(docName) => setNotice(`Membuka ruang pesan dengan ${docName}`)}
                />

                {/* Aksesibilitas Cepat */}
                <section
                  className="p-[17px] border border-[#dce6f0] rounded-[11px] bg-white"
                  aria-labelledby="a11y-quick-title"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 id="a11y-quick-title" className="text-navy font-manrope font-bold text-[14px]">
                        Aksesibilitas cepat
                      </h2>
                      <p className="mt-[3px] text-[#8191a1] text-[8px]">Sesuaikan pengalaman Anda</p>
                    </div>
                  </div>

                  <label
                    htmlFor="toggle-suara"
                    className="flex items-center justify-between mt-3 text-[#4f657b] text-[8px]"
                  >
                    <span className="flex items-center gap-[7px]">
                      <Icon name="volume" size={17} /> Mode suara
                    </span>
                    <button
                      id="toggle-suara"
                      role="switch"
                      aria-checked={voice}
                      aria-label="Aktifkan atau nonaktifkan mode suara"
                      onClick={toggleVoice}
                      className={`relative w-[30px] h-[17px] p-0 border-0 rounded-full transition-colors ${
                        voice ? "bg-blue" : "bg-[#cbd5df]"
                      }`}
                    >
                      <i
                        className={`absolute left-[3px] top-[3px] w-[11px] h-[11px] rounded-full bg-white transition-transform duration-200 ${
                          voice ? "translate-x-[13px]" : ""
                        }`}
                      />
                    </button>
                  </label>

                  <label
                    htmlFor="toggle-teks"
                    className="flex items-center justify-between mt-3 text-[#4f657b] text-[8px]"
                  >
                    <span className="flex items-center gap-[7px]">
                      <Icon name="settings" size={17} /> Teks besar
                    </span>
                    <button
                      id="toggle-teks"
                      role="switch"
                      aria-checked={false}
                      aria-label="Aktifkan atau nonaktifkan teks besar"
                      onClick={() => setNotice("Mode teks besar siap diterapkan")}
                      className="relative w-[30px] h-[17px] p-0 border-0 rounded-full bg-[#cbd5df] transition-colors"
                    >
                      <i className="absolute left-[3px] top-[3px] w-[11px] h-[11px] rounded-full bg-white transition-transform duration-200" />
                    </button>
                  </label>

                  <label
                    htmlFor="toggle-vibration"
                    className="flex items-center justify-between mt-3 text-[#4f657b] text-[8px]"
                  >
                    <span className="flex items-center gap-[7px]">
                      <Icon name="bell" size={17} /> Mode getaran
                    </span>
                    <button
                      id="toggle-vibration"
                      role="switch"
                      aria-checked={vibration}
                      aria-label="Aktifkan atau nonaktifkan mode getaran"
                      onClick={toggleVibration}
                      className={`relative w-[30px] h-[17px] p-0 border-0 rounded-full transition-colors ${
                        vibration ? "bg-blue" : "bg-[#cbd5df]"
                      }`}
                    >
                      <i
                        className={`absolute left-[3px] top-[3px] w-[11px] h-[11px] rounded-full bg-white transition-transform duration-200 ${
                          vibration ? "translate-x-[13px]" : ""
                        }`}
                      />
                    </button>
                  </label>

                  <label
                    htmlFor="select-cb-mode"
                    className="flex items-center justify-between mt-3 text-[#4f657b] text-[8px]"
                  >
                    <span className="flex items-center gap-[7px]">
                      <Icon name="settings" size={17} /> Mode buta warna
                    </span>
                    <select
                      id="select-cb-mode"
                      value={cbMode}
                      onChange={(e) => handleColorBlind(e.target.value as ColorBlindMode)}
                      aria-label="Pilih mode buta warna"
                      className="py-1 px-[7px] border border-[#ccd9e5] rounded-[5px] text-[#526a81] bg-[#f8fafc] text-[6.5px] font-bold outline-none focus:border-blue"
                    >
                      <option value="normal">Normal</option>
                      <option value="protanopia">Protanopia (Merah-Hijau)</option>
                      <option value="deuteranopia">Deuteranopia (Hijau-Merah)</option>
                      <option value="tritanopia">Tritanopia (Biru-Kuning)</option>
                    </select>
                  </label>

                  <button
                    onClick={() => setNotice("Semua pengaturan dibuka")}
                    className="w-full mt-3 pt-2 border-0 border-t border-[#edf1f5] text-blue bg-transparent text-[7.5px] font-bold hover:underline"
                  >
                    Lihat semua pengaturan
                  </button>
                </section>
              </aside>
            </div>
          </main>
        </div>

        {/* Tombol SOS Mengambang */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (vibration) activateVibration([300, 100, 300]);
            setSos(true);
          }}
          aria-label="Tombol SOS bantuan darurat"
          className="fixed z-35 right-[15px] bottom-[15px] sm:right-6 sm:bottom-[22px] min-h-[48px] flex items-center gap-2 px-[15px] border-[3px] border-[#ffd7da] rounded-full text-white bg-danger shadow-[0_8px_20px_#9f253244] hover:bg-red-700 transition-colors"
        >
          <Icon name="phone" size={20} />
          <span className="text-left">
            <strong className="block text-[10px]">SOS</strong>
            <small className="block mt-[1px] text-[6.5px]">Bantuan darurat</small>
          </span>
        </motion.button>

        {/* Modal SOS Darurat */}
        <AnimatePresence>
          {sos && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="presentation"
              onMouseDown={(e) => e.target === e.currentTarget && setSos(false)}
              onKeyDown={(e) => e.key === "Escape" && setSos(false)}
              className="fixed inset-0 z-[80] grid place-items-center p-5 bg-[#071a34a6] backdrop-blur-xs"
            >
              <motion.section
                initial={{ opacity: 0, scale: 0.93, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 12 }}
                transition={{ type: "spring", damping: 25, stiffness: 320 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sos-title"
                className="relative w-full max-w-[430px] p-[30px] rounded-2xl bg-white shadow-[0_25px_70px_#071a3460] text-center"
              >
                <button
                  onClick={() => setSos(false)}
                  aria-label="Tutup"
                  className="absolute right-[14px] top-[14px] w-8 h-8 grid place-items-center border-0 rounded-[7px] text-[#65768a] bg-[#f1f4f8] hover:bg-slate-200 transition-colors"
                >
                  <Icon name="close" />
                </button>
                <div className="w-14 h-14 grid place-items-center mx-auto mb-[13px] rounded-full text-danger bg-[#ffeaec]">
                  <Icon name="phone" size={28} />
                </div>
                <p className="text-danger text-[8px] font-extrabold tracking-[0.12em]">BANTUAN DARURAT</p>
                <h2 id="sos-title" className="mt-[7px] text-navy font-manrope font-bold text-[21px]">
                  Anda membutuhkan bantuan?
                </h2>
                <p className="mt-[7px] text-[#718197] text-[10px]">
                  Hubungi layanan darurat nasional atau gunakan simulasi ambulans terdekat.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-[18px]">
                  <a
                    href="tel:119"
                    className="min-h-[41px] flex items-center justify-center gap-[7px] rounded-[7px] text-white bg-danger no-underline text-[9px] font-bold hover:bg-red-700 transition-colors"
                  >
                    <Icon name="phone" /> Telepon 119
                  </a>
                  <a
                    href="tel:112"
                    className="min-h-[41px] flex items-center justify-center gap-[7px] rounded-[7px] text-white bg-danger no-underline text-[9px] font-bold hover:bg-red-700 transition-colors"
                  >
                    <Icon name="phone" /> Telepon 112
                  </a>
                </div>
                <button
                  onClick={() => {
                    setSos(false);
                    setNotice("Simulasi pencarian ambulans dimulai");
                  }}
                  className="w-full min-h-[43px] flex items-center justify-center gap-2 mt-2 border border-[#bad1eb] rounded-[7px] text-blue bg-[#f5f9ff] text-[9px] font-bold hover:bg-pale transition-colors"
                >
                  <Icon name="ambulance" /> Cari ambulans terdekat{" "}
                  <span className="py-[3px] px-[5px] rounded-full text-[#745718] bg-[#fff0bd] text-[6px] uppercase">
                    Simulasi
                  </span>
                </button>
                <small className="block mt-3 text-[#8997a7] text-[7.5px]">
                  Untuk kondisi gawat darurat, segera hubungi 119 atau 112.
                </small>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Fitur Lanjutan */}
        {showChatbot && <ChatbotSheet onClose={() => setShowChatbot(false)} />}
        {showPHQ9 && <PHQ9Screen onClose={() => setShowPHQ9(false)} />}
        {showHospitalMap && <HospitalMap onClose={() => setShowHospitalMap(false)} />}
        {showChatRoom && (
          <ChatRoom
            userId={user.id}
            displayName={displayName}
            channelName={`chat_${user.id}`}
            onClose={() => setShowChatRoom(false)}
          />
        )}

        {/* Toast Notifikasi */}
        <div
          role="status"
          className={`fixed z-[100] left-1/2 -translate-x-1/2 w-[calc(100%-30px)] sm:w-auto text-center py-2.5 px-4 rounded-[7px] text-white bg-[#173b63] shadow-[0_8px_25px_#0a234155] text-[9px] transition-all duration-250 ${
            notice ? "bottom-6 opacity-100" : "-bottom-[70px] opacity-0 pointer-events-none"
          }`}
        >
          {notice}
        </div>
      </motion.div>
    </TalkbackProvider>
  );
}