import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../ui/Icons";
import { Brand } from "../ui/Brand";
import type { View } from "../../App";

interface PublicHeaderProps {
  go: (view: View) => void;
}

const NAV_LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#informasi", label: "Informasi Kesehatan" },
  { href: "#layanan", label: "Layanan" },
  { href: "#tentang", label: "Tentang Aku Care" },
] as const;

export function PublicHeader({ go }: PublicHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#dce6f0] bg-white/95 backdrop-blur-md">
      <div className="w-full min-h-[64px] md:min-h-[76px] flex items-center justify-between gap-3 sm:gap-4 mx-auto px-4 sm:px-6 md:px-10 lg:px-14">
        {/* ---------------- Kiri: Brand ---------------- */}
        <div className="shrink-0">
          <Brand />
        </div>

        {/* ---------------- Tengah: Nav (desktop) ---------------- */}
        <nav
          className="hidden lg:flex items-center gap-7"
          aria-label="Navigasi publik"
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[#425c74] font-semibold text-[12px] hover:text-blue transition-colors"
            >
              {l.label}
            </a>
          ))}
          
        </nav>

        {/* ---------------- Kanan: Auth (desktop) ---------------- */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <a
            href="#kesehatan-mental"
            className="inline-flex items-center gap-1.5 min-h-[36px] px-3.5 rounded-lg text-white bg-[#ed2f7a] shadow-[0_6px_16px_#ed2f7a35] font-bold text-[12px] hover:bg-[#d91f68] hover:-translate-y-px transition-all"
          >
            <Icon name="brain" size={15} />
            Kesehatan Mental
          </a>
          <button
            className="min-h-[38px] px-4 rounded-lg text-[11.5px] font-bold border border-[#b9cee3] text-blue bg-white hover:bg-[#eaf4ff] hover:-translate-y-px hover:border-blue/40 transition-colors"
            onClick={() => go("login")}
          >
            Masuk
          </button>
          <button
            className="min-h-[38px] px-4 rounded-lg text-[11.5px] font-bold bg-[#0a4783] text-white hover:-translate-y-px transition-all shadow-[0_6px_16px_#0066cc2e]"
            onClick={() => go("register")}
          >
            Daftar
          </button>
        </div>

        {/* ---------------- Mobile: Auth ringkas + Hamburger ---------------- */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <button
            className="min-h-[34px] px-3 rounded-lg text-[11px] font-bold text-white bg-blue hover:bg-blue-dark transition-colors"
            onClick={() => go("register")}
          >
            Daftar
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
            aria-controls="public-mobile-menu"
            className="w-9 h-9 grid place-items-center rounded-lg border border-[#dce6f0] text-navy bg-white hover:bg-[#eaf4ff] transition-colors"
          >
            {mobileOpen ? (
              <Icon name="close" size={18} />
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ---------------- Mobile menu panel ---------------- */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="public-mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-t border-[#dce6f0] bg-white"
          >
            <nav
              className="px-4 sm:px-6 py-4 flex flex-col gap-1"
              aria-label="Navigasi publik mobile"
            >
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-[13px] font-semibold text-[#425c74] hover:bg-[#eaf4ff] hover:text-blue transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#kesehatan-mental"
                onClick={() => setMobileOpen(false)}
                className="mt-1 inline-flex items-center gap-2 px-3 py-2.5 rounded-lg text-white bg-[#ed2f7a] text-[13px] font-bold hover:bg-[#d91f68] transition-colors"
              >
                <Icon name="brain" size={15} />
                Kesehatan Mental
              </a>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#edf1f5]">
                <button
                  className="min-h-[40px] rounded-lg text-[12px] font-bold border border-[#b9cee3] text-blue bg-white hover:bg-[#eaf4ff] transition-colors"
                  onClick={() => {
                    setMobileOpen(false);
                    go("login");
                  }}
                >
                  Masuk
                </button>
                <button
                  className="min-h-[40px] rounded-lg text-[12px] font-bold text-white bg-[#0a4783] hover:bg-blue-dark transition-colors"
                  onClick={() => {
                    setMobileOpen(false);
                    go("register");
                  }}
                >
                  Daftar
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}