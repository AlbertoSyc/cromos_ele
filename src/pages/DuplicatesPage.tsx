import type { Card } from '../types';
import QuantitySelector from '../components/QuantitySelector';
import { Repeat2, Share2 } from 'lucide-react';

export default function DuplicatesPage({
  cards,
  userCards,
  savingId,
  onChange,
}: {
  cards: Card[];
  userCards: Record<string, number>;
  savingId: string | null;
  onChange: (id: string, next: number) => void;
}) {
  const duplicates = cards.filter(
    (card) => (userCards[card.id] ?? 0) > 1
  );

  const handleShare = async () => {
    const text = [
      'Cromos repetidos:',
      '',
      ...duplicates.map((card) => `Cromo ${card.id}`),
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          text,
        });
      } catch (error) {
        // El usuario puede cancelar el menú de compartir.
        // No mostramos ningún error en ese caso.
        if ((error as DOMException)?.name !== 'AbortError') {
          console.error('Error al compartir:', error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('Listado de cromos repetidos copiado al portapapeles.');
      } catch (error) {
        console.error('No se ha podido copiar el listado:', error);
      }
    }
  };

  return (
    <div>
      {/* CABECERA */}
      <header className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-400">
            Más de una unidad
          </p>

          <h1 className="text-3xl font-extrabold text-gray-800">
            Repetidos
          </h1>
        </div>

        {/* BOTÓN COMPARTIR */}
        {duplicates.length > 0 && (
          <button
            onClick={handleShare}
            className="rounded-xl bg-white p-3 text-gray-500 shadow-sm ring-1 ring-gray-100 transition hover:bg-pink-50 hover:text-pink-500 active:scale-95"
            title="Compartir cromos repetidos"
            aria-label="Compartir cromos repetidos"
          >
            <Share2 size={20} />
          </button>
        )}
      </header>

      {/* SIN REPETIDOS */}
      {duplicates.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft ring-1 ring-pink-100">
          <Repeat2
            className="mx-auto mb-3 text-pink-300"
            size={44}
          />

          <h2 className="text-xl font-extrabold">
            No tienes repetidos
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Cuando tengas 2 o más unidades de un cromo aparecerá aquí.
          </p>
        </div>
      ) : (
        /* LISTADO DE REPETIDOS */
        <div className="space-y-3">
          {duplicates.map((card) => {
            const storedQuantity = userCards[card.id] ?? 0;

            // El usuario tiene una unidad para su colección.
            // El resto son unidades repetidas.
            const repeatedQuantity = Math.max(
              0,
              storedQuantity - 1
            );

            return (
              <article
                key={card.id}
                className="flex items-center gap-4 rounded-3xl bg-white p-3 shadow-soft ring-1 ring-pink-100"
              >
                {/* IMAGEN */}
                <img
                  src={card.image}
                  alt={`Cromo ${card.id}`}
                  className="h-32 w-28 shrink-0 rounded-2xl bg-pink-50 object-contain p-1"
                />

                {/* INFORMACIÓN */}
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-gray-800">
                    Cromo {card.id}
                  </p>

                  <p className="truncate text-sm font-bold text-gray-400">
                    {card.name}
                  </p>
                </div>

                {/* SELECTOR DE REPETIDOS */}
                <div className="shrink-0">
                  <QuantitySelector
                    quantity={repeatedQuantity}
                    saving={savingId === card.id}
                    onChange={(nextRepeatedQuantity) => {
                      /*
                       * QuantitySelector trabaja con el número
                       * de repetidos que ve el usuario.
                       *
                       * Ejemplo:
                       *
                       * almacenado = 2
                       * repetidos = 1
                       *
                       * Pulsar +:
                       * repetidos = 2
                       * almacenado = 3
                       *
                       * Pulsar -:
                       * repetidos = 0
                       * almacenado = 1
                       */

                      const nextStoredQuantity =
                        nextRepeatedQuantity + 1;

                      onChange(
                        card.id,
                        Math.max(1, nextStoredQuantity)
                      );
                    }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}