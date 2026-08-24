import type { Card } from '../types';
import CardItem from '../components/CardItem';

export default function CardsPage({ cards, userCards, savingId, onChange }: {
  cards: Card[]; userCards: Record<string, number>; savingId: string | null; onChange: (id: string, next: number) => void;
}) {
  return <div>
    <header className="mb-5"><p className="text-sm font-bold text-gray-400">Colección</p><h1 className="text-3xl font-extrabold text-gray-800">Cromos</h1></header>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {cards.map(card => <CardItem key={card.id} card={card} quantity={userCards[card.id] ?? 0}
        saving={savingId === card.id} onChange={next => onChange(card.id, next)} />)}
    </div>
  </div>;
}