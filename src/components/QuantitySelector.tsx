import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({
  quantity, saving, onChange
}: { quantity: number; saving: boolean; onChange: (next: number) => void }) {
  return <div className="flex items-center justify-center gap-2">
    <button
      aria-label="Disminuir cantidad"
      disabled={saving || quantity <= 0}
      onClick={() => onChange(Math.max(0, quantity - 1))}
      className="grid h-11 w-11 place-items-center rounded-full bg-white text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
    ><Minus size={20} strokeWidth={3} /></button>
    <span aria-live="polite" className="min-w-8 text-center text-xl font-extrabold">{quantity}</span>
    <button
      aria-label="Aumentar cantidad"
      disabled={saving}
      onClick={() => onChange(quantity + 1)}
      className="grid h-11 w-11 place-items-center rounded-full bg-pink-500 text-white shadow-sm transition hover:bg-pink-600 active:scale-95 disabled:opacity-50"
    ><Plus size={20} strokeWidth={3} /></button>
  </div>;
}