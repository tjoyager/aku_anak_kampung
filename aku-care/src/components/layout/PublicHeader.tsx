import { Icon } from "../ui/Icons";
import { Brand } from "../ui/Brand";
import type { View } from "../../App";

interface PublicHeaderProps {
  go: (view: View) => void;
}

export function PublicHeader({ go }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#dce6f0] bg-white/95 backdrop-blur-md">
      <div className="w-full min-h-[66px] md:min-h-[76px] flex items-center gap-4 mx-auto px-3.5 sm:px-5 md:px-12">
        <Brand />

        <nav
          className="hidden lg:flex items-center gap-6 ml-auto"
          aria-label="Navigasi publik"
        >
          <a
            className="text-[#425c74] font-semibold text-[10.5px] hover:text-blue transition-colors"
            href="#beranda"
          >
            Beranda
          </a>
          <a
            className="text-[#425c74] font-semibold text-[10.5px] hover:text-blue transition-colors"
            href="#informasi"
          >
            Informasi Kesehatan
          </a>
          <a
            className="text-[#425c74] font-semibold text-[10.5px] hover:text-blue transition-colors"
            href="#layanan"
          >
            Layanan
          </a>
          <a
            className="text-[#425c74] font-semibold text-[10.5px] hover:text-blue transition-colors"
            href="#tentang"
          >
            Tentang Aku Care
          </a>
          <a
            className="inline-flex items-center gap-1.5 min-h-[34px] px-3 rounded-[7px] text-white bg-[#ed2f7a] shadow-[0_6px_16px_#ed2f7a35] font-bold text-[10.5px] hover:bg-[#d91f68] hover:-translate-y-px transition-all"
            href="#kesehatan-mental"
          >
            <Icon name="brain" size={15} /> Kesehatan Mental
          </a>
        </nav>

        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          <button
            className="min-h-[36px] px-4 rounded-[7px] text-[10px] font-bold border border-[#b9cee3] text-blue bg-white hover:bg-slate-50 transition-colors hidden sm:block"
            onClick={() => go("login")}
          >
            Masuk
          </button>
          <button
            className="min-h-[36px] px-4 rounded-[7px] text-[10px] font-bold border border-blue text-white bg-blue hover:bg-blue-dark transition-colors"
            onClick={() => go("register")}
          >
            Daftar
          </button>
        </div>
      </div>
    </header>
  );
}