import { ExternalLink, Clock, MapPin, TrendingDown, Zap } from 'lucide-react';
import { formatPriceRange, formatETA, formatDuration, formatDistance } from '../utils/formatting';

const CATEGORY_EMOJI = { economy: '🚗', comfort: '✨', premium: '💎', xl: '🚐', van: '🚐', eco: '🌿' };

const PROVIDER_BTN = {
  uber: 'bg-black hover:bg-gray-800',
  cabify: 'bg-[#7B61FF] hover:bg-[#6B51EF]',
  bolt: 'bg-[#34D186] hover:bg-[#2AC176]',
  freenow: 'bg-[#E21E4D] hover:bg-[#C91A42]',
};

const PROVIDER_BADGE = {
  uber: 'bg-black text-white',
  cabify: 'bg-[#7B61FF] text-white',
  bolt: 'bg-[#34D186] text-white',
  freenow: 'bg-[#E21E4D] text-white',
};

export default function ProviderCard({ estimate, isCheapest, isFastest }) {
  const highlights = [];
  if (isCheapest) highlights.push({ label: 'Más barato', cls: 'bg-emerald-100 text-emerald-700', Icon: TrendingDown });
  if (isFastest) highlights.push({ label: 'Más rápido', cls: 'bg-blue-100 text-blue-700', Icon: Zap });

  let ring = 'border-gray-150 hover:border-gray-300';
  if (isCheapest) ring = 'ring-2 ring-emerald-400 bg-emerald-50/50';
  else if (isFastest) ring = 'ring-2 ring-blue-400 bg-blue-50/50';

  return (
    <div className={`relative rounded-2xl border bg-white p-5 transition-all duration-300 hover:shadow-lg animate-slide-up ${ring}`}>
      {/* Highlight badges */}
      {highlights.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {highlights.map((h) => (
            <span key={h.label} className={`badge ${h.cls}`}>
              <h.Icon size={12} /> {h.label}
            </span>
          ))}
        </div>
      )}

      {/* Provider + Category */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className={`badge ${PROVIDER_BADGE[estimate.provider]}`}>{estimate.providerDisplayName}</span>
          <span className="text-sm text-gray-500">{CATEGORY_EMOJI[estimate.category] || '🚗'} {estimate.categoryLabel}</span>
        </div>
        {estimate.surge > 1.1 && (
          <span className="text-xs text-orange-500 font-medium">⚡ ×{estimate.surge.toFixed(1)}</span>
        )}
      </div>

      {/* Price */}
      <p className="text-2xl font-bold text-gray-900 tracking-tight mb-4">
        {formatPriceRange(estimate.price)}
      </p>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Metric icon={Clock} label="Llegada" value={formatETA(estimate.eta)} />
        <Metric icon={MapPin} label="Trayecto" value={formatDuration(estimate.duration)} />
        <Metric icon={MapPin} label="Distancia" value={formatDistance(estimate.distance)} />
      </div>

      {/* CTA */}
      <a href={estimate.deepLink} target="_blank" rel="noopener noreferrer"
        className={`inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-lg text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${PROVIDER_BTN[estimate.provider]}`}
      >
        Reservar en {estimate.providerDisplayName} <ExternalLink size={14} />
      </a>

      <p className="text-[10px] text-gray-300 text-center mt-2">Precio estimado • Tarifas públicas</p>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="text-center p-2 rounded-lg bg-gray-50">
      <Icon size={14} className="text-gray-400 mx-auto mb-1" />
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}

