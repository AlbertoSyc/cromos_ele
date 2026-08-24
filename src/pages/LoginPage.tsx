import { useState } from 'react';
import { Heart } from 'lucide-react';

export default function LoginPage({ onLogin, error, loading }: {
  onLogin: (profile: string) => void; error: string; loading: boolean;
}) {
  const [profile, setProfile] = useState(localStorage.getItem('hk-last-profile') || '');

  return <main className="flex min-h-screen items-center justify-center px-5 py-10">
    <section className="w-full max-w-sm rounded-[2rem] bg-white p-7 text-center shadow-soft ring-1 ring-pink-100">
      <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-pink-100 text-pink-600">
        <Heart size={40} fill="currentColor" />
      </div>
      <h1 className="text-3xl font-extrabold text-pink-600">HELLO KITTY</h1>
      <p className="mb-8 text-lg font-bold text-gray-600">& FRIENDS</p>
      <label className="mb-2 block text-left text-sm font-extrabold text-gray-700" htmlFor="profile">Introduce tu Perfil</label>
      <input
        id="profile"
        autoFocus
        value={profile}
        maxLength={40}
        onChange={e => setProfile(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onLogin(profile); }}
        placeholder="MI PERFIL"
        className="mb-3 w-full rounded-2xl border border-pink-100 bg-pink-50 px-4 py-4 text-center text-lg font-extrabold uppercase outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
      />
      {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
      <button disabled={loading || !profile.trim()} onClick={() => onLogin(profile)}
        className="w-full rounded-2xl bg-pink-500 py-4 font-extrabold text-white shadow-lg shadow-pink-200 transition hover:bg-pink-600 active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? 'Cargando...' : 'ENTRAR'}
      </button>
      <p className="mt-5 text-xs text-gray-400">El Perfil identifica tus cromos guardados.</p>
    </section>
  </main>;
}