import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { Icon } from "../components/ui/Icons";
import { PublicHeader } from "../components/layout/PublicHeader";
import { PublicFooter } from "../components/layout/PublicFooter";
import { NewsAndAnnouncements } from "../components/landing/NewsAndAnnouncements";
import { MentalHealthAndServices } from "../components/landing/MentalHealthAndServices";
import type { View } from "../App";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};


/* -------------------------------------------------------------------------- */
type HeroSlide = { src: string; alt: string };

const HERO_SLIDES: HeroSlide[] = [
  {
    src: "/fitur-0.png",
    alt: "Dokter profesional yang siap memberikan layanan kesehatan",
  },
  {
    src: "/fitur-1.png",
    alt: "Tenaga kesehatan mendampingi pasien dengan empatik",
  },
  {
    src: "/fitur-2.png",
    alt: "Tim medis berkolaborasi dalam pelayanan kesehatan inklusif",
  },
  {
    src: "/fitur-3.png",
    alt: "Dokter tersenyum hangat melayani pasien",
  },
  {
    src: "/fitur-4.png",
    alt: "Perawat ramah membantu pasien lansia",
  },
  {
    src: "/fitur-5.png",
    alt: "Konsultasi kesehatan jarak jauh yang mudah diakses",
  },
];

const SLIDE_INTERVAL = 3000; // ms

export default function Landing({ go }: { go: (view: View) => void }) {
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [sos, setSos] = useState(false);

  /* --------------------------- Hero carousel state -------------------------- */
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    timerRef.current = window.setInterval(() => {
      setActiveSlide((i) => (i + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused]);

  const goToSlide = (idx: number) => {
    setActiveSlide(idx);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  /* ------------------------------ Toast notice ----------------------------- */
  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(""), 2800);
    return () => window.clearTimeout(t);
  }, [notice]);

  const search = (event: FormEvent) => {
    event.preventDefault();
    go("informasi_detail");
  };

  const popularTopics = useMemo(
    () => ["Kesehatan mental", "Gizi", "Pertolongan pertama"],
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <a
        href="#main-public"
        className="fixed z-[100] left-4 -top-16 focus:top-3 px-4 py-2.5 rounded-[7px] text-white bg-navy text-xs font-bold transition-all"
      >
        Lewati ke konten utama
      </a>

      {/* ------------------------------- Header ------------------------------ */}
      <header className="sticky top-0 z-30 border-b border-[#dce6f0] bg-white/95 backdrop-blur-md">
        <PublicHeader go={go} />
      </header>

      <main id="main-public">
        {/* -------------------------------- Hero ------------------------------ */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-[#f1f8ff] via-white to-white"
          id="beranda"
        >
          {/* Dekorasi latar halus */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[#eaf4ff] opacity-60 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 right-0 w-[460px] h-[460px] rounded-full bg-[#dceeff] opacity-50 blur-3xl"
          />

          {/*
            Layout responsive:
            - Mobile  : 1 kolom (copy di atas, carousel di bawah)
            - Tablet  : 1 kolom (carousel lebih besar, di tengah)
            - Laptop+ : 2 kolom (copy kiri, carousel kanan)
          */}
          <div className="relative w-full lg:h-[700px] mx-auto px-3.5 sm:px-5 md:px-12 py-10 md:py-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(420px,0.7fr)] items-center gap-10 lg:gap-0">
            {/* ------------------------- Copy (kiri) ------------------------- */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="relative z-10 py-2 md:py-[64px] lg:py-[76px] order-1"
            >
              <h1 className="max-w-[760px] mb-4 text-navy font-manrope font-extrabold text-[30px] sm:text-[38px] md:text-[46px] lg:text-[54px] leading-[1.1] tracking-[-0.025em]">
                Sehatmu adalah
                <br />
                kepedulianku
              </h1>

              <p className="max-w-[600px] text-[#587087] text-[13px] sm:text-[13.5px] md:text-[15px] leading-[1.8]">
                Aku Care mempertemukan Anda dengan informasi dan layanan kesehatan
                yang kredibel, aksesibel, dan dirancang untuk memberdayakan setiap
                individu tanpa terkecuali.
              </p>

              {/* Statistik ringkas */}
              <ul className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-3 mt-6 sm:mt-7">
                {[
                  { value: "24/7", label: "Akses layanan" },
                  { value: "100%", label: "Ramah disabilitas" },
                  { value: "Terverifikasi", label: "Sumber medis" },
                ].map((s) => (
                  <li key={s.label} className="flex flex-col">
                    <strong className="font-manrope font-extrabold text-[16px] sm:text-[18px] text-navy leading-none">
                      {s.value}
                    </strong>
                    <span className="mt-1 text-[9px] sm:text-[9.5px] text-[#71869a] tracking-wide uppercase">
                      {s.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Pencarian */}
              <form
                className="max-w-[640px] w-full h-[48px] sm:h-[52px] md:h-[56px] flex items-center gap-[8px] sm:gap-[11px] mt-6 sm:mt-8 pl-3 sm:pl-4 pr-[6px] rounded-[11px] border border-[#cbdceb] bg-white shadow-[0_12px_34px_#1b5b9d1a] focus-within:border-blue/60 focus-within:shadow-[0_14px_38px_#1b5b9d26] transition-all"
                onSubmit={search}
                role="search"
              >
                <Icon
                  name="search"
                  className="text-[#7790a7] flex-none"
                  size={18}
                />
                <input
                  className="min-w-0 flex-1 bg-transparent border-0 outline-none text-text text-[11px] sm:text-[12px] placeholder:text-[#9fb1c2]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Cari informasi kesehatan"
                  placeholder="Cari topik kesehatan, artikel, atau layanan"
                />
                <button className="h-[38px] sm:h-[42px] px-[14px] sm:px-[18px] md:px-[26px] border-0 rounded-[8px] text-white bg-blue font-bold text-[10px] sm:text-[10.5px] tracking-wide hover:bg-blue-dark transition-colors flex-none">
                  Cari
                </button>
              </form>

              <div className="flex items-start sm:items-center flex-wrap gap-2 mt-3.5 text-[#8091a2] text-[9.5px]">
                <span className="tracking-wide uppercase">Populer:</span>
                {popularTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      setQuery(topic);
                      go("informasi_detail");
                    }}
                    className="px-2.5 py-1 rounded-full border border-[#d5e3f0] text-[#3d6e9d] bg-white/70 text-[9.5px] hover:border-blue hover:text-blue hover:bg-[#eaf4ff] transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ---------------------- Carousel (kanan / bawah) ---------------------- */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative flex items-center justify-center hidden lg:flex py-6 sm:py-10 order-2 lg:self-stretch"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={() => setPaused(true)}
              onTouchEnd={() => setPaused(false)}
              aria-roledescription="carousel"
              aria-label="Galeri layanan kesehatan Aku Care"
            >
              {/* Lingkaran dekoratif — ukuran adaptif */}
              <div
                aria-hidden="true"
                className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[460px] md:h-[460px] lg:w-[540px] lg:h-[540px] rounded-full bg-gradient-to-br from-[#dceeff] to-[#a8d2f5] shadow-[0_30px_80px_#0b4a8f2e]"
              />

              {/* Frame foto — ukuran adaptif */}
              <div className="relative z-10 w-[260px] h-[320px] sm:w-[320px] sm:h-[390px] md:w-[360px] md:h-[440px] lg:w-[420px] lg:h-[490px] rounded-[120px_120px_20px_20px] sm:rounded-[150px_150px_22px_22px] lg:rounded-[180px_180px_24px_24px] overflow-hidden shadow-[0_24px_60px_#0b4a8f33] bg-[#cfe6fa]">
                <AnimatePresence mode="sync" initial={false}>
                  <motion.img
                    key={activeSlide}
                    src={HERO_SLIDES[activeSlide].src}
                    alt={HERO_SLIDES[activeSlide].alt}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 w-full h-full object-cover object-[center_18%] saturate-[0.82]"
                    draggable={false}
                  />
                </AnimatePresence>

                {/* Overlay gradient tipis agar dots kontras */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-20 sm:h-24 bg-gradient-to-t from-[#082d58]/55 to-transparent"
                />

                {/* Indikator slide (dots) */}
                <div className="absolute bottom-3 sm:bottom-4 inset-x-0 flex items-center justify-center gap-1.5 sm:gap-2 z-20 px-4">
                  {HERO_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.src}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      aria-label={`Tampilkan gambar ${idx + 1} dari ${
                        HERO_SLIDES.length
                      }`}
                      aria-current={idx === activeSlide}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeSlide
                          ? "w-6 sm:w-7 bg-white shadow-[0_0_0_2px_rgba(255,255,255,0.35)]"
                          : "w-1.5 bg-white/55 hover:bg-white/85"
                      }`}
                    />
                  ))}
                </div>

                {/* Counter slide (pojok kanan atas) */}
                <div className="absolute top-3 right-3 z-20 px-2 py-1 rounded-full bg-black/35 backdrop-blur-sm text-white text-[9px] font-bold tracking-wide">
                  {activeSlide + 1} / {HERO_SLIDES.length}
                </div>
              </div>

              {/* Kartu kepercayaan mengambang — hanya tampil di md+ agar tidak menutupi frame di HP */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="hidden md:flex absolute z-20 left-0 lg:left-0 bottom-[70px] w-[230px] items-center gap-3 p-4 border border-white rounded-[12px] bg-white/95 backdrop-blur-sm shadow-[0_18px_40px_#183c6330] text-blue"
              >
                <span className="w-9 h-9 grid place-items-center rounded-[9px] bg-[#eaf4ff] text-blue flex-none">
                  <Icon name="shield" size={20} />
                </span>
                <div>
                  <strong className="block text-[#29445f] text-[10.5px] leading-tight">
                    Informasi terkurasi
                  </strong>
                  <span className="block mt-1 text-[#71869a] text-[8.5px] leading-[1.45]">
                    Bersumber dari institusi kesehatan kredibel
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ---------------------------- Emergency Band --------------------------- */}
        <section
          className="bg-[#0a4783] text-white"
          aria-label="Akses cepat darurat"
        >
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mx-auto px-4 sm:px-6 md:px-10 lg:px-14 py-4 sm:py-5">
            
            {/* Bagian Kiri: Ikon & Teks */}
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 sm:w-11 sm:h-11 grid place-items-center rounded-full bg-white/15 flex-none">
                <Icon name="phone" size={20} />
              </span>
              <div>
                <strong className="block font-manrope font-bold text-[14px] sm:text-[15px]">
                  Butuh bantuan darurat?
                </strong>
                <small className="block mt-0.5 text-[#bcd4ec] text-[11px] sm:text-[12px]">
                  Hubungi layanan kegawatdaruratan nasional
                </small>
              </div>
            </div>

            {/* Bagian Kanan: Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
              <a
                href="tel:119"
                className="w-full sm:w-auto text-center px-5 py-2.5 rounded-lg font-bold text-[13px] bg-white text-[#a9202d] hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
              >
                Telepon 119
              </a>
              <a
                href="tel:112"
                className="w-full sm:w-auto text-center px-5 py-2.5 mr-6 rounded-lg font-bold text-[13px] border border-white/40 text-white hover:bg-white/10 active:scale-95 transition-all"
              >
                Telepon 112
              </a>
            </div>

          </div>
        </section>

        {/* --------------------------- Modular Sections -------------------------- */}
        <NewsAndAnnouncements go={go} onNotify={setNotice} />
        <MentalHealthAndServices go={go} onNotify={setNotice} setSos={setSos} />
      </main>

      <PublicFooter />

      {/* -------------------------------- Modal SOS ---------------------------- */}
      {sos && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-4 bg-black/60 backdrop-blur-xs" onMouseDown={(e) => e.target === e.currentTarget && setSos(false)}>
          <section className="relative w-full max-w-[420px] p-6 rounded-2xl bg-white shadow-2xl text-center" role="dialog" aria-modal="true" aria-labelledby="landing-sos-title">
            <button className="absolute right-3 top-3 w-8 h-8 grid place-items-center rounded-lg border-0 bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer" onClick={() => setSos(false)} aria-label="Tutup">✕</button>
            <div className="w-14 h-14 grid place-items-center mx-auto mb-3 rounded-full text-red-600 bg-red-100 font-bold text-2xl">📞</div>
            <p className="text-red-600 font-extrabold text-[10px] tracking-widest uppercase">BANTUAN DARURAT</p>
            <h2 id="landing-sos-title" className="text-xl font-bold text-slate-900 mt-1 mb-2">Anda membutuhkan bantuan?</h2>
            <p className="text-sm text-slate-600 mb-4">Hubungi layanan darurat nasional atau cari ambulans dan fasilitas kesehatan terdekat.</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <a href="tel:119" className="py-2.5 px-4 rounded-lg bg-red-600 text-white font-bold text-sm text-center no-underline hover:bg-red-700">Telepon 119</a>
              <a href="tel:112" className="py-2.5 px-4 rounded-lg bg-red-600 text-white font-bold text-sm text-center no-underline hover:bg-red-700">Telepon 112</a>
            </div>
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-lg border border-blue-300 bg-blue-50 text-blue font-bold text-sm hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                setSos(false);
                go("lokasi");
              }}
            >
              🚑 Cari faskes &amp; ambulans terdekat
            </button>
          </section>
        </div>
      )}

      {/* -------------------------------- Toast -------------------------------- */}
      <div
        className={`fixed z-[100] left-1/2 -translate-x-1/2 w-[calc(100%-30px)] sm:w-auto px-4 py-2.5 rounded-[7px] text-white bg-[#173b63] shadow-[0_8px_25px_#0a234155] text-[9px] text-center transition-all duration-300 ${
          notice ? "bottom-6 opacity-100" : "-bottom-[70px] opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        {notice}
      </div>
    </motion.div>
    
  );
}