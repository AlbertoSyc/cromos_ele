import type { Card } from '../types';
import { stats } from '../utils/stats';

export default function HomePage({
  profile,
  cards,
  userCards,
}: {
  profile: string;
  cards: Card[];
  userCards: Record<string, number>;
}) {
  const s = stats(cards, userCards);

  // Cromos que el usuario todavía no tiene
  const pendingCards = cards.filter((card) => (userCards[card.id] ?? 0) === 0);

  // Agrupar los cromos pendientes por "name"
  const pendingByName = pendingCards.reduce<Record<string, Card[]>>(
    (groups, card) => {
      if (!groups[card.name]) {
        groups[card.name] = [];
      }

      groups[card.name].push(card);

      return groups;
    },
    {}
  );

  return (
    <div className="space-y-5">
      {/* CABECERA */}
      <header>
        <p className="text-sm font-bold text-gray-400">Tu colección</p>

        <h1 className="text-3xl font-extrabold text-gray-800">
          Hola, {profile}
        </h1>
      </header>

      {/* RESUMEN DE LA COLECCIÓN */}
      <section className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-pink-100">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-gray-400">
              Colección
            </p>

            <p className="text-3xl font-extrabold text-pink-600">
              {s.owned}{' '}
              <span className="text-lg text-gray-400">
                / {s.total}
              </span>
            </p>
          </div>

          <span className="rounded-full bg-pink-50 px-3 py-1 text-sm font-extrabold text-pink-600">
            {s.progress}%
          </span>
        </div>

        {/* BARRA DE PROGRESO */}
        <div className="h-4 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-pink-500 transition-all duration-500"
            style={{ width: `${s.progress}%` }}
          />
        </div>

        {/* ESTADÍSTICAS */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat
            label="Conseguidos"
            value={s.owned}
          />

          <Stat
            label="Pendientes"
            value={s.pending}
          />

          <Stat
            label="Cromos repetidos"
            value={s.duplicateCards}
          />
        </div>
      </section>

      {/* CROMOS PENDIENTES */}
      <section className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-pink-100">
        <div className="mb-5">
          <p className="text-sm font-bold text-gray-400">
            Colección
          </p>

          <h2 className="text-2xl font-extrabold text-gray-800">
            Cromos pendientes
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Estos son los cromos que todavía te faltan.
          </p>
        </div>

        {pendingCards.length === 0 ? (
          <div className="rounded-2xl bg-pink-50 p-5 text-center">
            <p className="text-lg font-extrabold text-pink-600">
              ¡Colección completada! 🎉
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Tienes al menos una unidad de todos los cromos.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(pendingByName).map(
              ([name, groupCards]) => (
                <div key={name}>
                  {/* NOMBRE DEL GRUPO */}
                  <h3 className="mb-3 text-lg font-extrabold text-gray-700">
                    {name}
                  </h3>

                  {/* LISTADO DE CROMOS */}
                  <div className="flex flex-wrap gap-2">
                    {groupCards.map((card) => (
                      <div
                        key={card.id}
                        className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-extrabold text-gray-700 ring-1 ring-gray-100"
                      >
                        Nº {card.id}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-bold text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-extrabold text-gray-800">
        {value}
      </p>
    </div>
  );
}