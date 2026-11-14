import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import { AnimatePresence } from "framer-motion";

// Import halaman modular yang akan kita buat
import Landing from "./pages/Landing";
import AuthScreen from "./pages/AuthScreen";
import Dashboard from "./pages/Dashboard"; 

export type View = "landing" | "login" | "register" | "forgot" | "update_password" | "dashboard";

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setSessionLoading(false);
      if (session?.user) setView("dashboard");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        setView("update_password");
      } else if (session?.user && view !== "update_password") {
        setView("dashboard");
      } else if (!session?.user) {
        setView((v) => (v === "dashboard" ? "landing" : v));
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [view]);

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

  return (
    <AnimatePresence mode="wait">
      {view === "landing" && <Landing key="landing" go={setView} />}
      {(view === "login" || view === "register" || view === "forgot" || view === "update_password") && (
        <AuthScreen key="auth" mode={view} go={setView} onAuthSuccess={() => setView("dashboard")} />
      )}
      {view === "dashboard" && user && (
        <Dashboard key="dashboard" go={setView} user={user} />
      )}
    </AnimatePresence>
  );
}