import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import { A11yWidget } from "./components/A11yWidget";
import Landing from "./pages/Landing";
import AuthScreen from "./pages/AuthScreen";
import Dashboard from "./pages/Dashboard";
import InformasiDetail from "./pages/InformasiDetail";
import { TesMental } from "./TesMental";
import { Konsultasi } from "./Konsultasi";
import { Profil } from "./Profil";
import { Pengaturan } from "./Pengaturan";
import { Chatbot } from "./Chatbot";
import { RumahSakit } from "./RumahSakit";

export type View =
  | "landing"
  | "login"
  | "register"
  | "forgot"
  | "update_password"
  | "dashboard"
  | "tes_mental"
  | "chat"
  | "informasi_detail"
  | "profil"
  | "pengaturan"
  | "chatbot"
  | "lokasi";

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setSessionLoading(false);
      // Hanya arahkan ke dashboard jika pengguna sedang berada di halaman luar
      setView((prevView) => {
        if (session?.user && (prevView === "landing" || prevView === "login" || prevView === "register")) {
          return "dashboard";
        }
        return prevView; // Biarkan view lain (seperti "lokasi" atau "chatbot") tetap jalan
      });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "PASSWORD_RECOVERY") {
        setView("update_password");
      } else if (session?.user) {
        setView((prevView) => (prevView === "landing" || prevView === "login" || prevView === "register" ? "dashboard" : prevView));
      } else if (!session?.user) {
        setView("landing");
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []); // <-- KUNCI PERBAIKAN: Array dependensi harus KOSONG agar tidak looping!

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  if (sessionLoading) {
    return (
      <div className="grid place-items-center min-h-screen font-sans text-slate-700 bg-canvas">
        <div className="animate-pulse">Memuat Aku Care...</div>
      </div>
    );
  }

  if (view === "chatbot") return <Chatbot go={setView} />;
  if (view === "lokasi") return <RumahSakit go={setView} />;

  let content;
  if (
    view === "login" ||
    view === "register" ||
    view === "forgot" ||
    view === "update_password"
  ) {
    content = (
      <AuthScreen
        mode={view}
        go={setView}
        onAuthSuccess={() => setView("dashboard")}
      />
    );
  } else if (view === "dashboard") {
    if (!user) {
      content = (
        <AuthScreen
          mode="login"
          go={setView}
          onAuthSuccess={() => setView("dashboard")}
        />
      );
    } else {
      content = <Dashboard go={setView} user={user} />;
    }
  } else if (view === "tes_mental") {
    content = <TesMental go={setView} />;
  } else if (view === "chat") {
    content = <Konsultasi go={setView} />;
  } else if (view === "informasi_detail") {
    content = <InformasiDetail go={setView} />;
  } else if (view === "profil") {
    content = <Profil go={setView} />;
  } else if (view === "pengaturan") {
    content = <Pengaturan go={setView} />;
  } else {
    content = <Landing go={setView} />;
  }

  return (
    <>
      <A11yWidget />
      {content}
    </>
  );
}
