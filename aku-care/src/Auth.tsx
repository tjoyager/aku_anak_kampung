import { useState } from 'react';
import { supabase } from './lib/supabase';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
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
        <input type="password" placeholder="Password (minimal 6 karakter)" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
          {loading ? 'Memproses...' : isLogin ? 'Login' : 'Daftar'}
        </button>
      </form>

      {pesan && <p style={{ color: '#2563eb', marginTop: '15px' }}>{pesan}</p>}

      <p style={{ marginTop: '20px', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={() => { setIsLogin(!isLogin); setPesan(''); }}>
        {isLogin ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Login di sini'}
      </p>
    </div>
  );
}