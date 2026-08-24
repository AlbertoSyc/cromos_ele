import { useCallback, useEffect, useMemo, useState } from 'react';
import cardsCatalog from './data/cards.json';
import type { Card, Page } from './types';
import { ApiError, getProfile, updateCard } from './services/api';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CardsPage from './pages/CardsPage';
import DuplicatesPage from './pages/DuplicatesPage';
import BottomNavigation from './components/BottomNavigation';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import CelebrationAnimation from './components/CelebrationAnimation';

const cards = cardsCatalog as Card[];

export default function App() {
  const [profile, setProfile] = useState<string | null>(null);
  const [userCards, setUserCards] = useState<Record<string, number>>({});
  const [page, setPage] = useState<Page>('home');
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hk-session-profile');
    if (saved) {
      setProfile(saved);
      setLoading(true);
      getProfile(saved).then(data => setUserCards(data.cards)).catch(() => {
        localStorage.removeItem('hk-session-profile');
        setProfile(null);
      }).finally(() => setLoading(false));
    }
  }, []);

  const login = async (raw: string) => {
    const normalized = raw.trim().toUpperCase();
    setError('');
    setLoading(true);
    try {
      const data = await getProfile(normalized);
      setProfile(data.profile);
      setUserCards(data.cards || {});
      localStorage.setItem('hk-session-profile', data.profile);
      localStorage.setItem('hk-last-profile', data.profile);
      setPage('home');
    } catch (e) {
      setError(e instanceof ApiError && e.status === 404 ? 'El Perfil introducido no existe.' : 'No se ha podido cargar tu colección. Comprueba tu conexión e inténtalo de nuevo.');
    } finally { setLoading(false); }
  };

  const changeCard = useCallback(async (id: string, next: number) => {
    if (!profile || next < 0 || savingId) return;
    const previous = userCards[id] ?? 0;
    setError('');
    setUserCards(current => ({ ...current, [id]: next }));
    setSavingId(id);
    try {
      const data = await updateCard(profile, id, next);
      setUserCards(data.cards || {});
      if (previous === 0 && next === 1) setCelebrate(true);
    } catch {
      setUserCards(current => ({ ...current, [id]: previous }));
      setError('No se han podido guardar los cambios. Inténtalo de nuevo.');
    } finally { setSavingId(null); }
  }, [profile, savingId, userCards]);

  const logout = () => {
    localStorage.removeItem('hk-session-profile');
    setProfile(null); setUserCards({}); setPage('home'); setError('');
  };

  const content = useMemo(() => {
    if (!profile) return null;
    if (page === 'cards') return <CardsPage cards={cards} userCards={userCards} savingId={savingId} onChange={changeCard} />;
    if (page === 'duplicates') return <DuplicatesPage cards={cards} userCards={userCards} savingId={savingId} onChange={changeCard} />;
    return <HomePage profile={profile} cards={cards} userCards={userCards} onLogout={logout} />;
  }, [page, profile, userCards, savingId, changeCard]);

  if (!profile) return <LoginPage onLogin={login} error={error} loading={loading} />;
  if (loading) return <Loading text="Cargando colección..." />;

  return <div className="safe-bottom min-h-screen">
    {celebrate && <CelebrationAnimation onDone={() => setCelebrate(false)} />}
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
      {error && <div className="mb-5"><ErrorMessage message={error} /></div>}
      {content}
    </main>
    <BottomNavigation page={page} onNavigate={setPage} />
  </div>;
}