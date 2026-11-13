import { Icon } from "./Icons";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <button className={`flex items-center gap-2.5 bg-transparent border-0 text-left cursor-pointer hover:opacity-90 transition-opacity ${light ? "text-white" : "text-navy"}`} aria-label="Aku Care, kembali ke beranda">
      <span>
        <img src="/favicon.png" alt="AkuCare" width={40} height={40}  />    
      </span>
      <span className="block">
        <strong className="block font-manrope font-extrabold text-[18px]">AkuCare</strong>
        <small className={`block mt-0 text-[8px] tracking-wide ${light ? "text-[#bcd5ed]" : "text-[#74879b]"}`}>Layanan Kesehatan Inklusif</small>
      </span>
    </button>
  );
}