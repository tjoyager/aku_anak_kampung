import { useEffect } from "react";

interface TalkbackProviderProps {
  voiceModeActive: boolean;
  children: React.ReactNode;
}

export function TalkbackProvider({ voiceModeActive, children }: TalkbackProviderProps) {
  
  const readEntirePage = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const mainContent = document.getElementById("dashboard-main") || document.body;
    const textElements = mainContent.querySelectorAll("h1, h2, h3, p, span, strong, a, button");
    let fullText = "Membaca halaman. ";

    textElements.forEach((el) => {
      const text = (el as HTMLElement).innerText?.trim();
      if (text && text.length > 1 && !text.includes("Mode suara")) {
        fullText += text + ". ";
      }
    });

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = "id-ID";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!voiceModeActive) {
      window.speechSynthesis.cancel();
      return;
    }

    readEntirePage();

    let activeElement: HTMLElement | null = null;
    let timeoutId: NodeJS.Timeout;

    const handleGlobalClick = (e: MouseEvent) => {
      // Memastikan target selalu mendeteksi elemen interaktif terluar (button, a, dll)
      const target = (e.target as HTMLElement).closest("button, a, input, select, [role='button']") as HTMLElement;
      
      if (!target) return;

      const speakText = 
        target.getAttribute("aria-label") || 
        target.innerText || 
        target.getAttribute("placeholder") || 
        "Elemen interaktif";

      if (activeElement !== target) {
        e.preventDefault();
        e.stopPropagation();

        // Bersihkan border elemen sebelumnya
        if (activeElement) {
          activeElement.style.outline = "";
          activeElement.style.boxShadow = "";
        }

        activeElement = target;
        
        // Menerapkan border kuning tebal dengan style inline yang kuat
        activeElement.style.outline = "4px solid #facc15"; 
        activeElement.style.outlineOffset = "2px"; // Memberikan jarak agar border tidak menempel terlalu rapat
        activeElement.style.boxShadow = "0 0 0 4px rgba(250, 204, 21, 0.4)";

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(speakText);
        utterance.lang = "id-ID";
        window.speechSynthesis.speak(utterance);

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (activeElement) {
            activeElement.style.outline = "";
            activeElement.style.outlineOffset = "";
            activeElement.style.boxShadow = "";
            activeElement = null;
          }
        }, 5000);

        return;
      }

      // Ketukan kedua (Eksekusi aksi)
      if (activeElement === target) {
        clearTimeout(timeoutId);
        activeElement.style.outline = "";
        activeElement.style.outlineOffset = "";
        activeElement.style.boxShadow = "";
        activeElement = null;
        window.speechSynthesis.cancel();
      }
    };

    document.addEventListener("click", handleGlobalClick, true);

    return () => {
      document.removeEventListener("click", handleGlobalClick, true);
      window.speechSynthesis.cancel();
    };
  }, [voiceModeActive]);

  return <>{children}</>;
}