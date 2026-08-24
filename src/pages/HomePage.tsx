import { LogOut } from 'lucide-react';
import type { Card } from '../types';
import { stats } from '../utils/stats';

export default function HomePage({ profile, cards, userCards, onLogout }: {
  profile: string; cards: Card[]; userCards: Record<string, number>; onLogout: () => void;
}) {
  const s = stats(cards, userCards);
  return <div className="space-y-5">
    <header className="flex items-center justify-between">
      <div><p className="text-sm font-bold text-gray-400">Tu colección</p><h1 className="text-3xl font-extrabold text-gray-800">Hola, {profile}</h1></div>
      <button onClick={onLogout} className="rounded-xl bg-white p-3 text-gray-500 shadow-sm ring-1 ring-gray-100" title="Cambiar Perfil"><LogOut size={20} /></button>
    </header>
    <section className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-pink-100">
      <div className="mb-5 flex items-end justify-between">
        <div><p className="text-sm font-bold text-gray-400">Colección</p><p className="text-3xl font-extrabold text-pink-600">{s.owned} <span className="text-lg text-gray-400">/ {s.total}</span></p></div>
        <span className="rounded-full bg-pink-50 px-3 py-1 text-sm font-extrabold text-pink-600">{s.progress}%</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-pink-500 transition-all duration-500" style={{ width: `${s.progress}%` }} /></div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Conseguidos" value={s.owned} />
        <Stat label="Pendientes" value={s.pending} />
        <Stat label="Cromos repetidos" value={s.duplicateCards} />
        <Stat label="Unidades repetidas" value={s.extraUnits} />
      </div>
    </section>
    <button onClick={onLogout} className="w-full rounded-2xl bg-white py-4 font-extrabold text-gray-600 shadow-sm ring-1 ring-gray-100 hover:bg-gray-50">Cambiar Perfil</button>
  </div>;
}
function Stat({label,value}:{label:string,value:number}) {
  return <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs font-bold text-gray-400">{label}</p><p className="mt-1 text-2xl font-extrabold text-gray-800">{value}</p></div>;
}