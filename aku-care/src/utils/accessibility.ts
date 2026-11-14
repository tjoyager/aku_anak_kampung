/**
 * Utility: Hardware Accessibility APIs
 * Semua fungsi dilindungi untuk lingkungan tanpa dukungan API terkait.
 */

/** Aktifkan getaran di perangkat yang mendukung. */
export function activateVibration(pattern: number | number[] = [200, 100, 200]): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

type ColorBlindMode = "normal" | "protanopia" | "deuteranopia" | "tritanopia";

/**
 * Pasang atribut `data-cb-mode` pada elemen <html> untuk CSS filter buta warna.
 * Supported: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia'
 */
export function setColorBlindMode(mode: ColorBlindMode): void {
  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.setAttribute("data-cb-mode", mode);
  }
}
