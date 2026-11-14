import { useEffect, useRef } from "react";

interface ShakeOptions {
  threshold?: number;
  debounceMs?: number;
  enabled?: boolean;
}

/**
 * Custom hook untuk mendeteksi guncangan perangkat (Shake-to-SOS) via DeviceMotion API
 * Digunakan untuk aksesibilitas darurat saat pengguna disabilitas/darurat mengguncang HP.
 */
export function useShakeDetection(
  onShake: () => void,
  { threshold = 15, debounceMs = 2000, enabled = true }: ShakeOptions = {}
) {
  const lastTriggerRef = useRef<number>(0);
  const lastPosRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const onShakeRef = useRef(onShake);

  useEffect(() => {
    onShakeRef.current = onShake;
  }, [onShake]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !("DeviceMotionEvent" in window)) {
      return;
    }

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const currentX = acc.x;
      const currentY = acc.y;
      const currentZ = acc.z;

      if (lastPosRef.current) {
        const deltaX = Math.abs(currentX - lastPosRef.current.x);
        const deltaY = Math.abs(currentY - lastPosRef.current.y);
        const deltaZ = Math.abs(currentZ - lastPosRef.current.z);
        const totalDelta = deltaX + deltaY + deltaZ;

        const now = Date.now();
        if (totalDelta > threshold && now - lastTriggerRef.current > debounceMs) {
          lastTriggerRef.current = now;
          onShakeRef.current();
        }
      }

      lastPosRef.current = { x: currentX, y: currentY, z: currentZ };
    };

    window.addEventListener("devicemotion", handleMotion, true);

    return () => {
      window.removeEventListener("devicemotion", handleMotion, true);
    };
  }, [threshold, debounceMs, enabled]);
}

export default useShakeDetection;
