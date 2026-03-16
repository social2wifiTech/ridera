import { useState } from 'react';
import { Clock, MapPin, Info } from 'lucide-react';
import ProviderCard from './ProviderCard';
import { formatDistance, formatDuration } from '../utils/formatting';

export default function ComparisonGrid({ data }) {
  const [sortMode, setSortMode] = useState('price');

  const sorted = [...data.allEstimates].sort((a, b) => {
    if (sortMode === 'price') return a.price.min - b.price.min;
    if (sortMode === 'eta') return a.eta - b.eta;
    return a.providerDisplayName.localeCompare(b.providerDisplayName);
  });

  const errorProviders = data.providers.filter((p) => p.status === 'error' || p.status === 'empty');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Route summary */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        <span className="badge bg-gray-100 text-gray-700"><MapPin size={14} /> {formatDistance(data.route.distanceKm)}</span>
        <span className="badge bg-gray-100 text-gray-700"><Clock size={14} /> {formatDuration(data.route.durationMin)}</span>
        <span className="badge bg-brand-50 text-brand-700">{data.allEstimates.length} opciones</span>
      </div>

      {/* Sort controls */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Ordenar:</span>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {[{ key: 'price', label: 'Precio' }, { key: 'eta', label: 'Tiempo' }, { key: 'provider', label: 'Proveedor' }].map((m) => (
              <button key={m.key} onClick={() => setSortMode(m.key)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${sortMode === m.key ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
        <Info size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          Los precios son estimaciones basadas en tarifas públicas. El precio final puede variar.
          Usa los botones de reserva para ver el precio actualizado en cada app.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((est, i) => {
          const estId = `${est.provider}-${est.category}`;
          return (
            <ProviderCard
              key={estId + i}
              estimate={est}
              isCheapest={data.cheapestId === estId}
              isFastest={data.fastestId === estId}
            />
          );
        })}
      </div>

      {/* Errores parciales */}
      {errorProviders.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Proveedores no disponibles:</p>
          {errorProviders.map((p) => (
            <div key={p.provider} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
              <span className="font-medium">{p.displayName}</span>: {p.error || 'Sin resultados'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

