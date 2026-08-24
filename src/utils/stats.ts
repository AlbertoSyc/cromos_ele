import type { Card } from '../types';

export function stats(cards: Card[], userCards: Record<string, number>) {
  const total = cards.length;
  const owned = cards.filter(c => (userCards[c.id] ?? 0) > 0).length;
  const pending = total - owned;
  const duplicateCards = cards.filter(c => (userCards[c.id] ?? 0) > 1).length;
  const extraUnits = cards.reduce((sum, c) => sum + Math.max(0, (userCards[c.id] ?? 0) - 1), 0);
  const progress = total ? Math.round((owned / total) * 100) : 0;
  return { total, owned, pending, duplicateCards, extraUnits, progress };
}