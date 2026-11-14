import { motion, type Variants } from "framer-motion";
import { publicArticles } from "../../data/healthData";
import type { View } from "../../App";

interface Props {
  go: (view: View) => void;
  onNotify: (msg: string) => void;
}

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

/* Fallback warna jika `image` kosong */
const thumbFallback = {
  mental: "bg-[#eeeaff]",
  firstaid: "bg-[#ffe8ea]",
  nutrition: "bg-[#e5f5eb]",
};

const FEATURED_IMG =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80";

export function NewsAndAnnouncements({ go, onNotify }: Props) {
  return (
    <>
      {/* ====================== BERITA & EDUKASI ====================== */}
      <motion.section
        id="informasi"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionReveal}
        className="w-full px-3.5 sm:px-6 md:px-10 lg:px-14 py-[56px] md:py-[72px]"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
          <div className="max-w-[680px]">
            <h2 className="mt-2.5 text-navy font-manrope font-extrabold text-[26px] sm:text-[30px] md:text-[34px] leading-[1.15] tracking-[-0.03em]">
              Berita & edukasi kesehatan
            </h2>
            <p className="mt-2.5 text-[#738598] text-[12px] sm:text-[13px] leading-[1.7]">
              Ringkasan informasi kesehatan untuk masyarakat dari sumber
              tepercaya dan terkurasi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-5 md:gap-6">
          {/* ---------- Featured Article ---------- */}
          <motion.article
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="group overflow-hidden rounded-2xl border border-[#dce6f0] bg-white shadow-[0_2px_10px_#0b3a6b0d] hover:shadow-[0_16px_40px_#0b3a6b1f] hover:border-[#b9d3ec] transition-all"
          >
            <div className="relative aspect-[16/9] sm:aspect-[16/8] overflow-hidden bg-[#e3f2fc]">
              <img
                src={FEATURED_IMG}
                alt="Tenaga kesehatan memberikan edukasi kepada masyarakat"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#082d58]/55 to-transparent"
              />
              <span className="absolute left-4 top-4 inline-flex items-center px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[9px] font-extrabold text-blue tracking-wide uppercase shadow-sm">
                Berita Utama
              </span>
              <span className="absolute left-4 bottom-4 inline-flex items-center px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-sm text-[10px] font-bold text-[#235981] shadow-sm">
                <time dateTime="2026-11-08">8 November 2026</time>
              </span>
            </div>

            <div className="p-6 sm:p-7">
              <h3 className="text-[#0f2a44] font-manrope font-bold text-[18px] sm:text-[20px] md:text-[22px] leading-[1.35] tracking-[-0.01em] group-hover:text-blue transition-colors">
                Akses kesehatan yang inklusif dimulai dari informasi yang mudah
                dipahami
              </h3>
              <p className="mt-3 text-[#728497] text-[12.5px] sm:text-[13px] leading-[1.7]">
                Pelajari prinsip layanan kesehatan yang setara bagi penyandang
                disabilitas dan masyarakat umum, serta bagaimana informasi yang
                jelas dapat menyelamatkan nyawa.
              </p>

              <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
                <small className="text-[#8b99a8] text-[10.5px]">
                  Sumber: Kementerian Kesehatan RI
                </small>
                <button
                  onClick={() => onNotify("Artikel utama dibuka")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-0 bg-blue text-white text-[11px] font-bold hover:bg-blue-dark hover:gap-2.5 transition-all"
                >
                  Baca selengkapnya
                  <span aria-hidden="true" className="text-[13px] leading-none">→</span>
                </button>
              </div>
            </div>
          </motion.article>

          {/* ---------- Article List ---------- */}
          <div className="flex flex-col rounded-2xl border border-[#dce6f0] bg-white overflow-hidden shadow-[0_2px_10px_#0b3a6b0d]">
            {publicArticles.map((article, idx) => (
              <article
                key={article.title}
                className={`group flex gap-4 p-4 sm:p-5 hover:bg-[#f8fbff] transition-colors ${
                  idx > 0 ? "border-t border-[#edf1f5]" : ""
                }`}
              >
                {/* Thumb gambar dari data */}
                <div
                  className={`flex-none w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden ${
                    thumbFallback[article.theme]
                  }`}
                >
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.imageAlt || article.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                    />
                  ) : null}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-blue text-[9px] font-extrabold tracking-wide uppercase">
                    <span>{article.type}</span>
                    <span aria-hidden="true" className="text-[#c8d5e2]">·</span>
                    <time
                      dateTime={article.date}
                      className="text-[#8b99a8] font-semibold normal-case"
                    >
                      {article.date}
                    </time>
                  </div>
                  <h3 className="mt-1.5 text-[#294159] font-manrope font-bold text-[13px] sm:text-[14px] leading-[1.45] group-hover:text-blue transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-1 text-[#7b8b9c] text-[11px] leading-[1.55] line-clamp-2">
                    {article.summary}
                  </p>
                  <small className="block mt-1.5 text-[#8b99a8] text-[10px]">
                    {article.source}
                  </small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ====================== PENGUMUMAN & SIARAN PERS ====================== */}
      <motion.section
        id="pengumuman"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionReveal}
        className="w-full px-3.5 sm:px-6 md:px-10 lg:px-14 pb-[56px] md:pb-[72px]"
      >
        <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
          <div className="max-w-[680px]">
            <h2 className="mt-2.5 text-navy font-manrope font-extrabold text-[22px] sm:text-[26px] md:text-[30px] leading-[1.15] tracking-[-0.03em]">
              Pengumuman & siaran pers
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Pengumuman */}
          <article className="group flex flex-col p-5 sm:p-6 rounded-2xl border border-[#dce6f0] bg-white shadow-[0_2px_10px_#0b3a6b0d] hover:shadow-[0_12px_30px_#0b3a6b1a] hover:border-[#b9d3ec] hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-block px-2.5 py-1 rounded-md bg-[#e3f5ed] text-[#176c4c] text-[9px] font-extrabold tracking-wide uppercase">
                Pengumuman
              </span>
              <time
                dateTime="2026-11-07"
                className="text-[#8a99a7] text-[10px] font-medium"
              >
                7 Nov 2026
              </time>
            </div>
            <h3 className="mt-3.5 text-[#0f2a44] font-manrope font-bold text-[15px] sm:text-[16px] leading-[1.45] group-hover:text-blue transition-colors">
              Informasi simulasi layanan ambulans pada versi demonstrasi
            </h3>
            <p className="mt-2 text-[#7a8a9a] text-[12px] leading-[1.65]">
              Permintaan dan pergerakan ambulans di Aku Care bersifat simulasi.
              Untuk kondisi darurat nyata, hubungi 119 atau 112.
            </p>
            <button
              onClick={() => onNotify("Pengumuman dibuka")}
              className="mt-auto pt-4 inline-flex items-center gap-1.5 self-start border-0 bg-transparent text-blue text-[11px] font-bold hover:gap-2.5 transition-all"
            >
              Lihat pengumuman
              <span aria-hidden="true" className="text-[13px] leading-none">→</span>
            </button>
          </article>

          {/* Siaran Pers */}
          <article className="group flex flex-col p-5 sm:p-6 rounded-2xl border border-[#dce6f0] bg-white shadow-[0_2px_10px_#0b3a6b0d] hover:shadow-[0_12px_30px_#0b3a6b1a] hover:border-[#b9d3ec] hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-block px-2.5 py-1 rounded-md bg-[#eee9fb] text-[#7157a9] text-[9px] font-extrabold tracking-wide uppercase">
                Siaran Pers
              </span>
              <time
                dateTime="2026-11-05"
                className="text-[#8a99a7] text-[10px] font-medium"
              >
                5 Nov 2026
              </time>
            </div>
            <h3 className="mt-3.5 text-[#0f2a44] font-manrope font-bold text-[15px] sm:text-[16px] leading-[1.45] group-hover:text-blue transition-colors">
              Penguatan akses informasi kesehatan bagi penyandang disabilitas
            </h3>
            <p className="mt-2 text-[#7a8a9a] text-[12px] leading-[1.65]">
              Komitmen menghadirkan informasi dalam bentuk teks, suara, visual,
              dan navigasi yang aksesibel untuk semua.
            </p>
            <button
              onClick={() => onNotify("Siaran pers dibuka")}
              className="mt-auto pt-4 inline-flex items-center gap-1.5 self-start border-0 bg-transparent text-blue text-[11px] font-bold hover:gap-2.5 transition-all"
            >
              Baca siaran pers
              <span aria-hidden="true" className="text-[13px] leading-none">→</span>
            </button>
          </article>

          {/* CTA Card */}
          <aside className="relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white bg-gradient-to-br from-[#0758a8] to-[#063968] shadow-[0_12px_30px_#08356b33] md:col-span-2 lg:col-span-1">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.06]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white/[0.04]"
            />

            <div className="relative flex flex-col h-full">
              <span className="text-[#9bc7f0] text-[9px] font-extrabold tracking-[0.16em] uppercase">
                Tetap terhubung
              </span>
              <strong className="mt-2.5 font-manrope font-bold text-[16px] sm:text-[18px] leading-[1.35]">
                Jangan lewatkan informasi kesehatan terbaru
              </strong>
              <p className="mt-2.5 text-[#c5d9eb] text-[12px] leading-[1.65]">
                Dapatkan pembaruan artikel, pengumuman, dan tips kesehatan
                langsung di akun Anda.
              </p>
              <button
                onClick={() => go("register")}
                className="mt-5 self-start px-4 py-2.5 rounded-lg border-0 bg-white text-[#08477f] text-[11px] font-bold hover:bg-slate-100 hover:-translate-y-px transition-all shadow-sm"
              >
                Buat akun Aku Care
              </button>
            </div>
          </aside>
        </div>
      </motion.section>
    </>
  );
}