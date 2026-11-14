import { motion, type Variants } from "framer-motion";
import { guestServices } from "../../data/healthData";
import type { View } from "../../App";

interface Props {
  go: (view: View) => void;
  onNotify: (msg: string) => void;
  setSos?: (sos: boolean) => void;
}

/* ---------------------------------------------------------------- */
/*  Animasi                                                         */
/* ---------------------------------------------------------------- */
const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardHover = { y: -4, transition: { duration: 0.22, ease: "easeOut" } } as const;

/* Label singkat pengganti ikon di kartu layanan mental */
const mentalFeatureLabel = {
  screening: "Skrining",
  history: "Riwayat",
  consult: "Konsultasi",
} as const;

/* Label singkat pengganti ikon aksesibilitas */
const a11yLabel = {
  voice: "Suara",
  display: "Tampilan",
  multi: "Multikanal",
} as const;

export function MentalHealthAndServices({ go, onNotify, setSos }: Props) {
  return (
    <>
      {/* ================================================================ */}
      {/*  KESEHATAN MENTAL                                                */}
      {/* ================================================================ */}
      <section
        id="kesehatan-mental"
        className="relative overflow-hidden text-white bg-[radial-gradient(circle_at_12%_20%,#ffffff18_0_90px,transparent_91px),linear-gradient(115deg,#7c174f_0%,#b82169_48%,#ed2f7a_100%)]"
      >
        {/* Dekorasi halus */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 w-[360px] h-[360px] rounded-full bg-white/[0.06] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -right-24 w-[420px] h-[420px] rounded-full bg-[#ed2f7a]/30 blur-3xl"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionReveal}
          className="relative w-full px-3.5 sm:px-6 md:px-10 lg:px-14 py-[64px] md:py-[88px] grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(400px,0.95fr)] items-center gap-10 lg:gap-16"
        >
          {/* ---------------- Copy kiri ---------------- */}
          <div>
            <span className="inline-block text-[#ffd2e5] text-[9px] font-extrabold tracking-[0.18em] uppercase">
              Layanan kesehatan mental
            </span>

            <h2 className="max-w-[680px] mt-4 font-manrope font-extrabold text-[30px] sm:text-[36px] md:text-[44px] leading-[1.12] tracking-[-0.035em]">
              Ruang aman untuk
              <br className="hidden sm:block" />
              memahami kondisi mental Anda.
            </h2>

            <p className="max-w-[560px] mt-5 text-[#ffe4ef] text-[13px] sm:text-[14px] leading-[1.8]">
              Skrining awal dengan bahasa yang netral dan tidak menghakimi,
              pantau perkembangan, lalu konsultasikan hasilnya kepada dokter
              atau psikolog pilihan Anda.
            </p>

            {/* Satu-satunya CTA */}
            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => go("tes_mental")}
                className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 border-0 rounded-xl text-[#a31959] bg-white text-[12px] font-bold shadow-[0_12px_28px_#5d093b45] hover:bg-pink-50 hover:-translate-y-px transition-all"
              >
                Mulai Tes Mental (PHQ-9)
              </button>
              <button
                onClick={() => go("register")}
                className="min-h-[48px] inline-flex items-center justify-center px-6 border border-white/40 rounded-xl text-white bg-white/5 text-[12px] font-bold hover:bg-white/15 transition-colors"
              >
                Daftar akun baru
              </button>
            </div>

            <small className="block mt-4 text-[#f6bfd7] text-[10.5px] leading-[1.6]">
              Hasil tes merupakan skrining awal, bukan diagnosis atau pengganti
              penilaian profesional.
            </small>
          </div>

          {/* ---------------- Panel kanan ---------------- */}
          <div className="relative p-5 sm:p-6 rounded-2xl text-text bg-white shadow-[0_24px_55px_#5e0b3a52]">
            {/* Header panel */}
            <div className="flex items-center justify-between pb-4 border-b border-[#f0dce5]">
              <span className="text-[#a5205e] text-[10.5px] font-extrabold tracking-wide uppercase">
                Privat &amp; terkendali
              </span>
            </div>

            {/* Daftar fitur bernomor — lebih elegan tanpa ikon */}
            <motion.ol
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-4 space-y-1"
            >
              {[
                {
                  title: "Skrining terstandar",
                  desc: "PHQ-9, GAD-7, DASS-21, dan kepribadian Big Five.",
                },
                {
                  title: "Riwayat & perkembangan",
                  desc: "Simpan hasil dan bagikan kepada dokter hanya dengan izin Anda.",
                },
                {
                  title: "Konsultasi profesional",
                  desc: "Terhubung melalui pesan teks dengan dokter atau psikolog.",
                },
              ].map((item, idx) => (
                <motion.li
                  key={item.title}
                  variants={staggerItem}
                  className="group flex gap-4 p-3 rounded-xl hover:bg-[#fff2f7] transition-colors"
                >
                  <span
                    aria-hidden="true"
                    className="flex-none w-9 h-9 grid place-items-center rounded-full bg-[#ffe5f0] text-[#d52870] text-[11px] font-extrabold group-hover:bg-[#d52870] group-hover:text-white transition-colors"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <strong className="block text-[#3d3040] text-[12.5px] leading-tight">
                      {item.title}
                    </strong>
                    <p className="mt-1 text-[#7d6e78] text-[11.5px] leading-[1.55]">
                      {item.desc}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>

            {/* Kotak darurat */}
            <div className="mt-4 flex items-center gap-3 p-3.5 rounded-xl border border-[#f3c4d7] bg-[#fff2f7]">
              <div className="flex-1 min-w-0">
                <strong className="block text-[#623047] text-[11.5px]">
                  Butuh bantuan segera?
                </strong>
                <span className="block mt-0.5 text-[#876878] text-[10.5px] leading-[1.5]">
                  Hubungi layanan darurat 119 atau 112.
                </span>
              </div>
              <div className="flex gap-1.5 flex-none">
                <a
                  href="tel:119"
                  className="px-2.5 py-1.5 rounded-md text-white bg-[#d52870] text-[10.5px] font-extrabold hover:opacity-90 transition-opacity"
                >
                  119
                </a>
                <a
                  href="tel:112"
                  className="px-2.5 py-1.5 rounded-md text-white bg-[#d52870] text-[10.5px] font-extrabold hover:opacity-90 transition-opacity"
                >
                  112
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================================================================ */}
      {/*  PREVIEW LAYANAN                                                 */}
      {/* ================================================================ */}
      <section id="layanan" className="relative overflow-hidden bg-[#edf6ff]">
        {/* Dekorasi halus */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[#dceeff] opacity-50 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -right-32 w-[460px] h-[460px] rounded-full bg-[#eaf4ff] opacity-60 blur-3xl"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={sectionReveal}
          className="relative w-full px-3.5 sm:px-6 md:px-10 lg:px-14 py-[64px] md:py-[88px]"
        >
          {/* Header section */}
          <div className="max-w-[760px] mx-auto text-center mb-12 md:mb-14">
            <h2 className="mt-3 text-navy font-manrope font-extrabold text-[28px] sm:text-[32px] md:text-[38px] leading-[1.12] tracking-[-0.035em]">
              Layanan AkuCare
            </h2>
            <p className="mt-3.5 text-[#738598] text-[12.5px] sm:text-[13.5px] leading-[1.75]">
              Nikmati berbagai layanan yang kami sediakan untuk kebutuhan Anda
            </p>
          </div>

          {/* Grid layanan */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          >
            {guestServices.map((service, idx) => (
              <motion.article
                key={service.title}
                variants={staggerItem}
                whileHover={cardHover}
                className="group relative flex flex-col p-5 sm:p-6 rounded-2xl border border-[#d2e1ef] bg-white shadow-[0_2px_10px_#0b3a6b0d] hover:border-[#b9d3ec] hover:shadow-[0_18px_40px_#0b3a6b1a] transition-all"
              >
                {/* Header: nomor + badge */}
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden="true"
                    className="w-10 h-10 grid place-items-center rounded-full bg-[#eaf4ff] text-blue text-[11px] font-extrabold group-hover:bg-blue transition-colors"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Body */}
                <h3 className="mt-5 text-[#223e58] font-manrope font-bold text-[15px] leading-[1.35] group-hover:text-blue transition-colors">
                  {service.title}
                </h3>
                <p className="mt-2 text-[#758698] text-[12px] leading-[1.65] flex-1">
                  {service.text}
                </p>

                {/* CTA */}
                <button
                  onClick={() => {
                    if (service.title === "Lokasi Layanan Kesehatan") go("lokasi");
                    else if (service.title === "Tes Kesehatan Mental") go("tes_mental");
                    else if (service.title === "Konsultasi Dokter") go("chat");
                    else if (service.title === "Layanan Darurat") {
                      if (setSos) setSos(true);
                      else window.location.href = "tel:119";
                    }
                    else if (service.title === "Chatbot Pendamping") go("chatbot");
                    else go("profil");
                  }}
                  className="mt-5 self-start inline-flex items-center gap-1.5 text-blue text-[11.5px] font-bold hover:gap-2.5 transition-all"
                >
                  {service.title === "Tes Kesehatan Mental" ? "Mulai Skrining (PHQ-9)" : service.title === "Konsultasi Dokter" ? "Mulai Konsultasi" : service.title === "Layanan Darurat" ? "Hubungi 119" : service.title === "Lokasi Layanan Kesehatan" ? "Cari Faskes Terdekat" : service.title === "Chatbot Pendamping" ? "Buka Chatbot" : "Akses Layanan"}
                  <span aria-hidden="true" className="text-[13px] leading-none">→</span>
                </button>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ================================================================ */}
      {/*  AKSESIBILITAS                                                   */}
      {/* ================================================================ */}
      <section
        id="tentang"
        className="relative overflow-hidden bg-white"
      >
        {/* Dekorasi halus di atas putih */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-[#eaf4ff] opacity-60 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-24 w-[460px] h-[460px] rounded-full bg-[#eaf4ff] opacity-50 blur-3xl"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionReveal}
          className="relative w-full px-3.5 sm:px-6 md:px-10 lg:px-14 py-[64px] md:py-[88px] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center"
        >
          {/* ---------------- Copy kiri ---------------- */}
          <div>

            <h2 className="mt-3.5 font-manrope font-extrabold text-[30px] sm:text-[36px] md:text-[42px] leading-[1.15] tracking-[-0.035em] text-navy">
              Dirancang untuk digunakan
              <br className="hidden sm:block" />
              secara mandiri.
            </h2>

            <p className="mt-4 max-w-[540px] text-[#587087] text-[13px] sm:text-[14px] leading-[1.8]">
              Aku Care mendukung mode suara, getaran dengan indikator visual,
              pilihan mode buta warna, kontras tinggi, ukuran teks, dan navigasi
              keyboard — agar setiap orang dapat mengakses layanan dengan percaya
              diri.
            </p>
          </div>

          {/* ---------------- Daftar fitur bernomor ---------------- */}
          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-3.5"
          >
            {[
              {
                key: "voice" as const,
                title: "Mode Suara",
                desc: "Panduan berbahasa Indonesia dengan navigasi audio.",
              },
              {
                key: "display" as const,
                title: "Tampilan Adaptif",
                desc: "Warna, kontras, dan ukuran teks yang dapat disesuaikan.",
              },
              {
                key: "multi" as const,
                title: "Informasi Multikanal",
                desc: "Teks, visual, suara, dan getaran untuk semua kebutuhan.",
              },
            ].map((f, idx) => (
              <motion.li
                key={f.key}
                variants={staggerItem}
                className="group flex items-start gap-4 p-4 sm:p-5 rounded-2xl border border-[#dce6f0] bg-white shadow-[0_2px_10px_#0b3a6b0d] hover:border-[#b9d3ec] hover:shadow-[0_14px_34px_#0b3a6b1a] hover:-translate-y-0.5 transition-all"
              >
                <span
                  aria-hidden="true"
                  className="flex-none w-10 h-10 grid place-items-center rounded-full bg-[#eaf4ff] text-blue text-[11px] font-extrabold group-hover:bg-blue transition-colors"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <strong className="block text-[13.5px] font-bold leading-tight text-navy">
                    {f.title}
                  </strong>
                  <small className="block mt-1.5 text-[#587087] text-[12px] leading-[1.6]">
                    {f.desc}
                  </small>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </motion.div>
      </section>
    </>
  );
}