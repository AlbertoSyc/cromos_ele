import type { Card } from '../types';
import QuantitySelector from './QuantitySelector';

export default function CardItem({
  card, quantity, saving, onChange
}: { card: Card; quantity: number; saving: boolean; onChange: (next: number) => void }) {
  return <article className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-pink-100">
    <div className="relative bg-pink-50 p-3">
      <img className="card-image mx-auto w-full" src={card.image} alt={`Cromo ${card.id}`} />
      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-pink-700 shadow-sm">
        Nº {card.id}
      </span>
      {quantity > 1 && <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
        Repetido
      </span>}
    </div>
    <div className="space-y-3 p-4 text-center">
      <div className="min-h-10 text-sm font-extrabold text-gray-700">{card.name}</div>
      <QuantitySelector quantity={quantity} saving={saving} onChange={onChange} />
      {saving && <div className="text-xs font-bold text-gray-400">Guardando...</div>}
    </div>
  </article>;
}