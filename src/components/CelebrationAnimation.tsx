import { useEffect } from 'react';

export default function CelebrationAnimation({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 1500);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  const sparks = Array.from({ length: 18 }, (_, i) => ({
    i,
    x: `${Math.round(Math.cos((i / 18) * Math.PI * 2) * (90 + (i % 3) * 35))}px`,
    y: `${Math.round(Math.sin((i / 18) * Math.PI * 2) * (90 + (i % 4) * 30))}px`,
  }));

  return <div className="celebration" aria-hidden="true">
    {sparks.map(s => <span key={s.i} className="spark" style={{
      '--x': s.x, '--y': s.y,
      background: s.i % 3 === 0 ? '#f472b6' : s.i % 3 === 1 ? '#fbbf24' : '#a78bfa',
    } as React.CSSProperties} />)}
  </div>;
}