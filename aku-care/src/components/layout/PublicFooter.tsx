import { Brand } from "../ui/Brand";

export function PublicFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#052847] text-[#b8cee2]">
      {/* Garis gradient tipis sebagai pemisah dari section putih */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#1680e8]/60 to-transparent"
      />

      <div className="w-full px-3.5 sm:px-6 md:px-10 lg:px-14 py-3 md:py-5">
        {/* Baris utama */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <Brand light />

          <nav
            aria-label="Navigasi footer"
            className="hidden md:flex flex-wrap gap-x-6 gap-y-2"
          >
            {[
              { href: "#informasi", label: "Informasi" },
              { href: "#layanan", label: "Layanan" },
              { href: "#tentang", label: "Aksesibilitas" },
              { href: "#kesehatan-mental", label: "Kesehatan Mental" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[12px] text-[#bfd0df] hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Baris bawah */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[11px] text-[#849db4]">
            © {new Date().getFullYear()} AkuCare. All rights reserved.
          </p>
          <p className="text-[10.5px] text-[#6d8aa8] leading-[1.6] max-w-[520px]">
            Informasi layanan kesehatan inklusif
          </p>
        </div>
      </div>
    </footer>
  );
}