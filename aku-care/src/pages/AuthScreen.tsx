import { type FormEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brand } from "../components/ui/Brand";
import { GoogleIcon } from "../components/ui/GoogleIcon";
import { supabase } from "../lib/supabase";
import type { View } from "../App";

type AuthMode = "login" | "register" | "forgot" | "update_password";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AuthScreen({
  mode,
  go,
  onAuthSuccess,
}: {
  mode: AuthMode;
  go: (view: View) => void;
  onAuthSuccess: () => void;
}) {
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isUpdate = mode === "update_password";
  const needsConfirm = isRegister || isUpdate;

  /* ------------------------------ State ------------------------------ */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Laki-laki");
  const [consent, setConsent] = useState(false);

  /* --------------------- Saat mode berubah: reset UX --------------------- */
  useEffect(() => {
    setErrorMsg("");
    setSuccessMsg("");
    setShowPassword(false);
    setShowConfirm(false);
    setConfirmPassword("");
    window.scrollTo({ top: 0, behavior: "auto" });
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [mode]);

  /* ------------------------------ Helpers ------------------------------ */
  const resetMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const validateConfirm = (): boolean => {
    if (!needsConfirm) return true;
    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return false;
    }
    return true;
  };

  /* ------------------------------ Handlers ----------------------------- */
  const handleGoogle = async () => {
    resetMessages();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setErrorMsg(`Gagal login Google: ${error.message}`);
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    if (!consent) {
      setErrorMsg("Anda harus menyetujui pemrosesan data pribadi.");
      return;
    }
    if (!validateConfirm()) return;

    setLoading(true);
    resetMessages();

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: username.trim(),
          full_name: fullName.trim(),
          phone: phone.trim(),
          dob,
          gender,
        },
      },
    });

    setLoading(false);
    if (error) {
      setErrorMsg(`Gagal mendaftar: ${error.message}`);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setIdentifier(username.trim());
    setSuccessMsg("Pendaftaran berhasil! Silakan masuk dengan kata sandi Anda.");
    go("login");
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    resetMessages();

    try {
      let loginEmail = identifier.trim();
      if (!loginEmail.includes("@")) {
        const { data: resolvedEmail, error: rpcError } = await supabase.rpc(
          "get_email_by_username",
          { p_username: loginEmail }
        );
        if (rpcError || !resolvedEmail)
          throw new Error("Username tidak ditemukan.");
        loginEmail = resolvedEmail as string;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });
      if (error) throw error;
      onAuthSuccess();
    } catch (err) {
      let message =
        err instanceof Error ? err.message : "Terjadi kesalahan saat login.";
      if (message.includes("Invalid login credentials")) {
        message = "Email/Username atau kata sandi yang Anda masukkan salah.";
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    resetMessages();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/`,
    });
    setLoading(false);
    if (error) setErrorMsg(`Gagal mengirim email reset: ${error.message}`);
    else {
      setSuccessMsg("Tautan reset kata sandi telah dikirim ke email Anda.");
      setEmail("");
    }
  };

  const handleUpdatePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (!validateConfirm()) return;

    setLoading(true);
    resetMessages();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setErrorMsg(`Gagal memperbarui kata sandi: ${error.message}`);
    else {
      setSuccessMsg(
        "Kata sandi berhasil diperbarui. Mengalihkan ke dashboard..."
      );
      setTimeout(() => go("dashboard"), 2000);
    }
  };

  /* ------------------------------- Labels ------------------------------ */
  const stepLabel = isRegister
    ? "BUAT AKUN BARU"
    : isForgot
    ? "PEMULIHAN AKUN"
    : isUpdate
    ? "KATA SANDI BARU"
    : "SELAMAT DATANG KEMBALI";

  const title = isRegister
    ? "Daftar ke Aku Care"
    : isForgot
    ? "Lupa kata sandi"
    : isUpdate
    ? "Atur kata sandi baru"
    : "Masuk ke akun Anda";

  const subtitle = isRegister
    ? "Isi data diri Anda untuk memulai"
    : isForgot
    ? "Masukkan email Anda untuk menerima tautan reset"
    : isUpdate
    ? "Masukkan dan konfirmasi kata sandi baru Anda"
    : "Gunakan email atau username yang telah terdaftar";

  const submitLabel = loading
    ? "Memproses..."
    : isRegister
    ? "Daftar sekarang"
    : isForgot
    ? "Kirim tautan reset"
    : isUpdate
    ? "Simpan kata sandi baru"
    : "Masuk";

  /* ----------------------------- CSS helper ---------------------------- */
  const inputBase =
    "w-full h-[46px] px-3.5 border rounded-lg text-text bg-[#fbfcfe] text-[13px] outline-none focus:bg-white focus:ring-4 transition-all placeholder:text-[#9fb1c2]";
  const inputOk =
    "border-[#ccd9e5] focus:border-blue focus:ring-[#0066cc]/10";
  const inputErr =
    "border-[#fca5a5] focus:border-[#dc2626] focus:ring-[#dc2626]/10";
  const labelClass = "grid gap-1.5 text-[#344d64] text-[12px] font-semibold";

  const pwMismatch =
    needsConfirm && confirmPassword.length > 0 && password !== confirmPassword;
  const showPwInputError = pwMismatch;

  /* ------------------------------ Variants ----------------------------- */
  const pageVariants = {
    initial: { opacity: 0, y: 12 },
    in: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
    out: { opacity: 0, y: -8, transition: { duration: 0.25 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-[100dvh] lg:h-[100dvh] w-full bg-white overflow-hidden [scrollbar-gutter:stable]"
    >
      <motion.main
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className="w-full h-full grid grid-cols-1 lg:grid-cols-[44%_56%]"
      >
        {/* ================================================================ */}
        {/*  PANEL KIRI — Branding (desktop only)                            */}
        {/* ================================================================ */}
        <section className="relative hidden lg:flex flex-col overflow-hidden text-white bg-gradient-to-br from-[#062f5c] via-[#0a3f7a] to-[#0066cc]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -bottom-40 w-[520px] h-[520px] rounded-full border border-white/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 w-[320px] h-[320px] rounded-full bg-[#1680e8]/20 blur-3xl"
          />

          <div className="relative z-10 flex flex-col h-full px-10 xl:px-16 py-10 overflow-y-auto">

            <div className="my-auto py-10">
              <div className="mb-5 flex shrink-0">
                <Brand />
              </div>
              <h1 className="max-w-[440px] mt-4 font-manrope font-extrabold text-[34px] xl:text-[38px] leading-[1.2] tracking-[-0.03em]">
                Sehatmu adalah
                <br />
                Kepedulianku
              </h1>
              <p className="max-w-[440px] mt-4 text-[#c6dbee] text-[13px] leading-[1.75]">
                Akses layanan kesehatan, skrining mental, konsultasi dokter, dan
                bantuan darurat dalam satu platform yang aksesibel untuk semua.
              </p>

              <ul className="mt-8 space-y-3 max-w-[440px]">
                {[
                  {
                    title: "Data terenkripsi",
                    desc: "Standar medis untuk setiap konsultasi",
                  },
                  {
                    title: "Aksesibel penuh",
                    desc: "Mode suara, kontras, dan navigasi keyboard",
                  },
                  {
                    title: "Tenaga profesional",
                    desc: "Dokter & psikolog terverifikasi",
                  },
                ].map((p, idx) => (
                  <li
                    key={p.title}
                    className="flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.06]"
                  >
                    <span
                      aria-hidden="true"
                      className="flex-none w-7 h-7 grid place-items-center rounded-full bg-white/15 text-[10px] font-extrabold text-white"
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <strong className="block text-[12px] font-bold leading-tight">
                        {p.title}
                      </strong>
                      <small className="block mt-0.5 text-[#b8cee2] text-[11px] leading-[1.5]">
                        {p.desc}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="w-fit flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-lg text-[11px] border-0 bg-transparent text-[#c2d9ee] hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => go("landing")}
            >
              Kembali ke beranda
            </button>
          </div>
        </section>

        {/* ================================================================ */}
        {/*  PANEL KANAN — Form                                              */}
        {/* ================================================================ */}
        <section className="flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-8 sm:py-10 lg:min-h-0 lg:h-full overflow-y-auto">
          <div className="lg:hidden mt-10 mb-15 flex justify-center shrink-0">
            <Brand />
          </div>

          <div className="w-full max-w-[460px] mx-auto my-auto">
            {/* Header beranimasi */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`header-${mode}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: EASE }}
              >
                <span className="text-blue text-[10px] font-extrabold tracking-[0.16em] uppercase">
                  {stepLabel}
                </span>
                <h2 className="mt-2 text-navy font-manrope font-extrabold text-[26px] sm:text-[30px] tracking-[-0.02em] leading-tight">
                  {title}
                </h2>
                <p className="mt-2 text-[#7b8c9e] text-[13px] leading-[1.6] mb-8">
                  {subtitle}
                </p>
              </motion.div>
            </AnimatePresence>



            {/* Form */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.form
                  key={mode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.26, ease: EASE }}
                  className={`grid ${isRegister ? "gap-3" : "gap-4"}`}
                  onSubmit={
                    isRegister
                      ? handleRegister
                      : isForgot
                      ? handleResetRequest
                      : isUpdate
                      ? handleUpdatePassword
                      : handleLogin
                  }
                  noValidate
                >
                  {/* FORGOT: email */}
                  {isForgot && (
                    <label className={labelClass}>
                      Alamat email
                      <input
                        className={`${inputBase} ${inputOk}`}
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        autoComplete="email"
                      />
                    </label>
                  )}

                  {/* REGISTER: 2 kolom */}
                  {isRegister && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={labelClass}>
                          Nama lengkap
                          <input
                            className={`${inputBase} ${inputOk}`}
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Masukkan Nama lengkap"
                            autoComplete="name"
                          />
                        </label>
                        <label className={labelClass}>
                          Username
                          <input
                            className={`${inputBase} ${inputOk}`}
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Masukkan Username"
                            autoComplete="username"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={labelClass}>
                          Nomor telepon
                          <input
                            className={`${inputBase} ${inputOk}`}
                            required
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="08xxxxxxxxxx"
                            autoComplete="tel"
                          />
                        </label>
                        <label className={labelClass}>
                          Tanggal lahir
                          <input
                            className={`${inputBase} ${inputOk}`}
                            required
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={labelClass}>
                          Jenis kelamin
                          <select
                            className={`${inputBase} ${inputOk}`}
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                          >
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                          </select>
                        </label>
                        <label className={labelClass}>
                          Alamat email
                          <input
                            className={`${inputBase} ${inputOk}`}
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nama@email.com"
                            autoComplete="email"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={labelClass}>
                          Kata sandi
                          <div className="relative">
                            <input
                              className={`${inputBase} ${inputOk} pr-20`}
                              required
                              minLength={6}
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Min. 6 karakter"
                              autoComplete="new-password"
                            />
                            <button
                              type="button"
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-blue bg-transparent border-0 text-[10.5px] font-bold hover:bg-[#eaf4ff] transition-colors"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={
                                showPassword
                                  ? "Sembunyikan kata sandi"
                                  : "Tampilkan kata sandi"
                              }
                            >
                              {showPassword ? "Sembunyi" : "Lihat"}
                            </button>
                          </div>
                        </label>
                        <label className={labelClass}>
                          Konfirmasi
                          <div className="relative">
                            <input
                              className={`${inputBase} ${
                                showPwInputError ? inputErr : inputOk
                              } pr-20`}
                              required
                              minLength={6}
                              type={showConfirm ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              placeholder="Ulangi sandi"
                              autoComplete="new-password"
                              aria-invalid={showPwInputError}
                              aria-describedby={
                                showPwInputError
                                  ? "pw-mismatch-msg"
                                  : undefined
                              }
                            />
                            <button
                              type="button"
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-blue bg-transparent border-0 text-[10.5px] font-bold hover:bg-[#eaf4ff] transition-colors"
                              onClick={() => setShowConfirm(!showConfirm)}
                              aria-label={
                                showConfirm
                                  ? "Sembunyikan konfirmasi kata sandi"
                                  : "Tampilkan konfirmasi kata sandi"
                              }
                            >
                              {showConfirm ? "Sembunyi" : "Lihat"}
                            </button>
                          </div>
                          {showPwInputError && (
                            <span
                              id="pw-mismatch-msg"
                              className="text-[#dc2626] text-[11px] font-semibold"
                            >
                              Konfirmasi tidak cocok.
                            </span>
                          )}
                        </label>
                      </div>
                    </>
                  )}

                  {/* LOGIN: identifier */}
                  {!isRegister && !isForgot && !isUpdate && (
                    <label className={labelClass}>
                      Email atau username
                      <input
                        className={`${inputBase} ${inputOk}`}
                        required
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="nama@email.com atau username"
                        autoComplete="username"
                      />
                    </label>
                  )}

                  {/* PASSWORD (login & update) */}
                  {!isForgot && !isRegister && (
                    <label className={labelClass}>
                      Kata sandi
                      <div className="relative">
                        <input
                          className={`${inputBase} ${inputOk} pr-24`}
                          required
                          minLength={6}
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={
                            isUpdate
                              ? "Minimal 6 karakter"
                              : "Masukkan kata sandi"
                          }
                          autoComplete={
                            isUpdate ? "new-password" : "current-password"
                          }
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md text-blue bg-transparent border-0 text-[11px] font-bold hover:bg-[#eaf4ff] transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword
                              ? "Sembunyikan kata sandi"
                              : "Tampilkan kata sandi"
                          }
                        >
                          {showPassword ? "Sembunyikan" : "Lihat"}
                        </button>
                      </div>
                    </label>
                  )}

                  {/* UPDATE: konfirmasi */}
                  {isUpdate && (
                    <label className={labelClass}>
                      Konfirmasi kata sandi
                      <div className="relative">
                        <input
                          className={`${inputBase} ${
                            showPwInputError ? inputErr : inputOk
                          } pr-24`}
                          required
                          minLength={6}
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi baru"
                          autoComplete="new-password"
                          aria-invalid={showPwInputError}
                          aria-describedby={
                            showPwInputError ? "pw-mismatch-msg" : undefined
                          }
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md text-blue bg-transparent border-0 text-[11px] font-bold hover:bg-[#eaf4ff] transition-colors"
                          onClick={() => setShowConfirm(!showConfirm)}
                          aria-label={
                            showConfirm
                              ? "Sembunyikan konfirmasi kata sandi"
                              : "Tampilkan konfirmasi kata sandi"
                          }
                        >
                          {showConfirm ? "Sembunyikan" : "Lihat"}
                        </button>
                      </div>
                      {showPwInputError && (
                        <span
                          id="pw-mismatch-msg"
                          className="text-[#dc2626] text-[11.5px] font-semibold mt-0.5"
                        >
                          Konfirmasi tidak cocok dengan kata sandi.
                        </span>
                      )}
                    </label>
                  )}

                  {/* LOGIN: remember + forgot */}
                  {!isRegister && !isForgot && !isUpdate && (
                    <div className="flex items-center justify-between gap-2">
                      <label className="flex items-center gap-2 text-[#61758a] text-[12px]">
                        <input
                          type="checkbox"
                          className="accent-blue w-3.5 h-3.5"
                        />
                        Ingat saya
                      </label>
                      <button
                        type="button"
                        className="p-0 border-0 bg-transparent text-blue text-[12px] font-bold hover:underline"
                        onClick={() => {
                          resetMessages();
                          go("forgot");
                        }}
                      >
                        Lupa kata sandi?
                      </button>
                    </div>
                  )}

                  {/* REGISTER: consent */}
                  {isRegister && (
                    <label className="grid grid-cols-[auto_1fr] items-start gap-2.5 text-[#6f8194] text-[11.5px] leading-[1.5]">
                      <input
                        required
                        type="checkbox"
                        className="mt-0.5 accent-blue w-3.5 h-3.5"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                      />
                      <span>
                        Saya menyetujui pemrosesan data pribadi dan telah membaca
                        Kebijakan Privasi Aku Care.
                      </span>
                    </label>
                  )}

                  {/* Submit — tegas terlihat */}
                  <button
                    className="w-full min-h-[48px] flex items-center justify-center gap-2 mt-1 border-0 rounded-lg text-white bg-blue text-[13.5px] font-bold tracking-[0.01em] shadow-[0_8px_22px_#0066cc38] hover:bg-blue-dark hover:shadow-[0_10px_26px_#0054ae4d] hover:-translate-y-px active:translate-y-0 active:bg-[#0054ae] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0066cc]/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-blue"
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: "#0066cc", color: "#ffffff" }}
                  >
                    {loading && (
                      <span
                        aria-hidden="true"
                        className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"
                      />
                    )}
                    {submitLabel}
                    {!loading && (
                      <span
                        aria-hidden="true"
                        className="text-[14px] leading-none"
                      >
                        
                      </span>
                    )}
                  </button>

                  {/* Feedback */}
                  {errorMsg && (
                    <p
                      className="text-[#b91c1c] text-[12.5px] p-3 bg-red-50 rounded-lg border border-red-100 leading-[1.5]"
                      role="alert"
                    >
                      {errorMsg}
                    </p>
                  )}
                  {successMsg && (
                    <p
                      className="text-[#15803d] text-[12.5px] p-3 bg-green-50 rounded-lg border border-green-100 leading-[1.5]"
                      role="status"
                    >
                      {successMsg}
                    </p>
                  )}
                </motion.form>
              </AnimatePresence>
            </div>

            {/* Google + divider — HANYA untuk login */}
            <AnimatePresence initial={false}>
              {mode === "login" && (
                <motion.div
                  key="google-block"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 my-3 text-[#9aa7b4] text-[11px]">
                    <span className="flex-1 h-px bg-[#e5ebf0]" />
                    <span>atau</span>
                    <span className="flex-1 h-px bg-[#e5ebf0]" />
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogle}
                    className="w-full min-h-[48px] mt-2 flex items-center justify-center gap-3 px-4 rounded-lg border border-[#dadce0] bg-white text-[#3c4043] text-[13.5px] font-semibold shadow-[0_1px_2px_rgba(60,64,67,0.1)] hover:bg-[#f8f9fa] hover:border-[#c6c9cc] hover:shadow-[0_2px_6px_rgba(60,64,67,0.15)] active:bg-[#f1f3f4] transition-all"
                  >
                    <GoogleIcon size={18} />
                    Lanjutkan dengan Google
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Switch login/register */}
            {!isUpdate && (
              <p className="text-center text-[12.5px] mt-6 text-[#6f8194]">
                {isRegister || isForgot
                  ? "Sudah ingat akun Anda?"
                  : "Belum punya akun?"}{" "}
                <button
                  className="p-0 border-0 bg-transparent text-blue font-bold hover:underline"
                  onClick={() => {
                    resetMessages();
                    go(isRegister || isForgot ? "login" : "register");
                  }}
                >
                  {isRegister || isForgot ? "Masuk" : "Daftar sekarang"}
                </button>
              </p>
            )}
          </div>
        </section>
      </motion.main>
    </motion.div>
  );
}