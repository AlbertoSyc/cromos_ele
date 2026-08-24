import type { Card } from '../types';
import QuantitySelector from '../components/QuantitySelector';
import { Repeat2 } from 'lucide-react';

export default function DuplicatesPage({ cards, userCards, savingId, onChange }: {
  cards: Card[]; userCards: Record<string, number>; savingId: string | null; onChange: (id: string, next: number) => void;
}) {
  const duplicates = cards.filter(c => (userCards[c.id] ?? 0) > 1);
  return <div>
    <header className="mb-5"><p className="text-sm font-bold text-gray-400">Más de una unidad</p><h1 className="text-3xl font-extrabold text-gray-800">Repetidos</h1></header>
    {duplicates.length === 0
      ? <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft ring-1 ring-pink-100">
          <Repeat2 className="mx-auto mb-3 text-pink-300" size={44} />
          <h2 className="text-xl font-extrabold">No tienes repetidos</h2>
          <p className="mt-1 text-sm text-gray-400">Cuando tengas 2 o más unidades de un cromo aparecerá aquí.</p>
        </div>
      : <div className="space-y-3">{duplicates.map(card =>
          <article key={card.id} className="flex items-center gap-4 rounded-3xl bg-white p-3 shadow-soft ring-1 ring-pink-100">
            <img src={card.image} alt={`Cromo ${card.id}`} className="h-24 w-20 rounded-2xl bg-pink-50 object-contain p-1" />
            <div className="min-w-0 flex-1"><p className="font-extrabold text-gray-800">Cromo {card.id}</p><p className="truncate text-sm font-bold text-gray-400">{card.name}</p></div>
            <div className="shrink-0"><QuantitySelector quantity={userCards[card.id] ?? 0} saving={savingId === card.id} onChange={next => onChange(card.id, next)} /></div>
          </article>
        )}</div>}
  </div>;
}