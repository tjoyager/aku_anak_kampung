import type { User } from "@supabase/supabase-js";
import type { ReactNode } from "react";
import { Icon } from "../ui/Icons";
import { Brand } from "../ui/Brand";

interface AppHeaderProps {
  user: User | null;
  /** Sembunyikan brand (misal karena sudah ada di sidebar) */
  hideBrand?: boolean;
  /** Slot tambahan untuk tombol kustom di kiri (misal tombol back) */
  leftAction?: ReactNode;
  /** Slot tambahan untuk tombol kustom di kanan (sebelum bell & avatar) */
  rightActions?: ReactNode;
  /** Callback saat icon lonceng diklik */
  onNotify?: (msg: string) => void;
}

export function AppHeader({ 
  user, 
  hideBrand = false, // <-- Default: tampil
  leftAction, 
  rightActions, 
  onNotify 
}: AppHeaderProps) {
  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const displayName = (meta.full_name as string) || (meta.username as string) || user?.email || "Pengguna";
  const initials = displayName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "BP";

  return (
    <header className="sticky top-0 z-[2000] h-[76px] flex items-center justify-between gap-4 px-2 sm:px-4 md:px-6 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      
      {/* --- KIRI --- */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Render Brand hanya jika hideBrand = false */}
        {!hideBrand && (
          <div className="flex-none">
            <Brand />
          </div>
        )}

        {/* Tombol Back (opsional) */}
        {leftAction && (
          <div className={`${!hideBrand ? "pl-4 border-l border-slate-200" : ""}`}>
            {leftAction}
          </div>
        )}

        {/* Search Bar (Desktop) - Tampil jika tidak ada tombol back */}
        {!leftAction && (
          <label className="hidden lg:flex w-full max-w-[380px] h-[42px] items-center gap-2.5 ml-0 px-3.5 border border-slate-200 rounded-xl text-slate-400 bg-slate-50 focus-within:border-[#0066cc] focus-within:ring-4 focus-within:ring-[#0066cc]/10 transition-all">
            <Icon name="search" size={18} />
            <input
              className="min-w-0 flex-1 border-0 outline-none bg-transparent text-[13px] text-slate-800 placeholder:text-slate-400"
              placeholder="Cari layanan atau informasi"
              aria-label="Cari layanan atau informasi"
            />
          </label>
        )}
      </div>

      {/* --- KANAN --- */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {rightActions}
        
        <button
          onClick={() => onNotify?.("Notifikasi dibuka")}
          className="w-[42px] h-[42px] grid place-items-center border border-slate-200 rounded-xl text-slate-500 bg-white hover:bg-slate-50 transition-colors"
          aria-label="Notifikasi"
        >
          <Icon name="bell" size={18} />
        </button>
        
        <div className="w-[42px] h-[42px] grid place-items-center rounded-xl text-white bg-[#365e86] text-sm font-bold shadow-sm">
          {initials}
        </div>
      </div>
    </header>
  );
}