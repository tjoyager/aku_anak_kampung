import { useState } from 'react';
import { supabase } from './lib/supabase';
import { Brand } from './components/ui/Brand';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pesan, setPesan] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Laki-laki');

  const handleGoogleLogin = async () => {
    setPesan('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) setPesan(`Gagal login Google: ${error.message}`);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPesan('');

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

    if (error) {
      setPesan(`Gagal mendaftar: ${error.message}`);
    } else {
      setPesan('Pendaftaran berhasil! Silakan masukkan kata sandi Anda untuk login.');
      
      // KOSONGKAN PASSWORD DISINI
      setPassword(''); 
      
      setIsLogin(true); // Otomatis pindah ke mode login, username tetap terisi karena state username tidak di-reset
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPesan('');

    try {
      const { data: userEmail, error: rpcError } = await supabase.rpc('get_email_by_username', {
        p_username: username.trim(),
      });

      if (rpcError || !userEmail) {
        throw new Error('Username tidak ditemukan.');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password,
      });

      if (signInError) throw signInError;
      setPesan('Berhasil login!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat login.';
      setPesan(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
        <Brand />
      </div>

      <h2>{isLogin ? 'Login ke Akun' : 'Daftar Akun Baru'}</h2>

      <button type="button" onClick={handleGoogleLogin} style={{ width: '100%', marginBottom: '20px', padding: '10px' }}>
        Lanjutkan dengan Google
      </button>

      <hr style={{ marginBottom: '20px' }} />

      <form onSubmit={isLogin ? handleSignIn : handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {!isLogin && (
          <>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="text" placeholder="Nama Lengkap" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <input type="tel" placeholder="Nomor Telepon" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </>
        )}

        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <div className="password-field" style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password (minimal 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            style={{ width: '100%', boxSizing: 'border-box', paddingRight: '42px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#0066cc',
              padding: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
          {loading ? 'Memproses...' : isLogin ? 'Login' : 'Daftar'}
        </button>
      </form>

      {pesan && <p style={{ color: '#2563eb', marginTop: '15px' }}>{pesan}</p>}

      <button
        style={{ marginTop: '20px', cursor: 'pointer', color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', font: 'inherit', padding: 0 }}
        onClick={() => { setIsLogin(!isLogin); setPesan(''); }}
      >
        {isLogin ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Login di sini'}
      </button>
    </div>
  );
}