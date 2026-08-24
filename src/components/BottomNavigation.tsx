import { Home, Images, Repeat2 } from 'lucide-react';
import type { Page } from '../types';

const items = [
  { id: 'home' as const, label: 'Inicio', Icon: Home },
  { id: 'cards' as const, label: 'Cromos', Icon: Images },
  { id: 'duplicates' as const, label: 'Repetidos', Icon: Repeat2 },
];

export default function BottomNavigation({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  return <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-pink-100 bg-white/95 backdrop-blur bottom-safe">
    <div className="mx-auto grid max-w-3xl grid-cols-3">
      {items.map(({ id, label, Icon }) => {
        const active = page === id;
        return <button key={id} onClick={() => onNavigate(id)}
          className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-extrabold transition ${active ? 'text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <Icon size={23} strokeWidth={active ? 2.7 : 2} />
          {label}
        </button>;
      })}
    </div>
  </nav>;
}