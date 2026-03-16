import { useState, useEffect, useRef } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';

export default function SearchForm({ onSearch, loading }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showOrigin, setShowOrigin] = useState(false);
  const [showDest, setShowDest] = useState(false);
  const originRef = useRef(null);
  const destRef = useRef(null);

  // Autocomplete fetcher
  useEffect(() => {
    if (origin.length < 2) { setOriginSuggestions([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(origin)}`);
        const json = await res.json();
        if (json.success) { setOriginSuggestions(json.results); setShowOrigin(true); }
      } catch { /* ignore */ }
    }, 250);
    return () => clearTimeout(t);
  }, [origin]);

  useEffect(() => {
    if (destination.length < 2) { setDestSuggestions([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(destination)}`);
        const json = await res.json();
        if (json.success) { setDestSuggestions(json.results); setShowDest(true); }
      } catch { /* ignore */ }
    }, 250);
    return () => clearTimeout(t);
  }, [destination]);

  // Click outside
  useEffect(() => {
    const handler = (e) => {
      if (originRef.current && !originRef.current.contains(e.target)) setShowOrigin(false);
      if (destRef.current && !destRef.current.contains(e.target)) setShowDest(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (origin.trim().length >= 2 && destination.trim().length >= 2 && !loading) {
      onSearch(origin.trim(), destination.trim());
    }
  };

  const canSearch = origin.trim().length >= 2 && destination.trim().length >= 2 && !loading;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4">
        {/* Origin */}
        <div ref={originRef} className="relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Origen</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <input
              type="text" value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              onFocus={() => { if (originSuggestions.length) setShowOrigin(true); }}
              placeholder="Ej: Puerta del Sol, Atocha, Aeropuerto Barajas..."
              className="input-field pl-10" autoComplete="off"
            />
          </div>
          {showOrigin && originSuggestions.length > 0 && (
            <SuggestionList items={originSuggestions} onSelect={(addr) => { setOrigin(addr); setShowOrigin(false); }} />
          )}
        </div>

        {/* Swap */}
        <div className="flex justify-center -my-1">
          <button type="button"
            onClick={() => { setOrigin(destination); setDestination(origin); }}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all hover:scale-110 active:scale-95"
          >
            <ArrowUpDown size={16} />
          </button>
        </div>

        {/* Destination */}
        <div ref={destRef} className="relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Destino</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-500" />
            <input
              type="text" value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => { if (destSuggestions.length) setShowDest(true); }}
              placeholder="Ej: Gran Vía, Sagrada Familia, Aeropuerto El Prat..."
              className="input-field pl-10" autoComplete="off"
            />
          </div>
          {showDest && destSuggestions.length > 0 && (
            <SuggestionList items={destSuggestions} onSelect={(addr) => { setDestination(addr); setShowDest(false); }} />
          )}
        </div>

        {/* Submit */}
        <button type="submit" disabled={!canSearch} className="btn-primary w-full mt-2 py-4 text-base gap-2">
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Comparando precios…
            </>
          ) : (
            <><Search size={20} /> Comparar precios</>
          )}
        </button>

        {/* Quick examples */}
        <div className="flex flex-wrap gap-2 justify-center pt-1">
          <span className="text-xs text-gray-400">Prueba:</span>
          {[
            { o: 'Sol', d: 'Aeropuerto Barajas' },
            { o: 'Atocha', d: 'Chamartin' },
            { o: 'Plaza Cataluna', d: 'Aeropuerto El Prat' },
          ].map((ex) => (
            <button key={ex.o + ex.d} type="button"
              onClick={() => { setOrigin(ex.o); setDestination(ex.d); }}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium hover:underline"
            >
              {ex.o} → {ex.d}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}

function SuggestionList({ items, onSelect }) {
  return (
    <div className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-fade-in">
      {items.map((item, i) => (
        <button key={i} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-brand-50 transition-colors text-left"
          onMouseDown={(e) => { e.preventDefault(); onSelect(item.address); }}
        >
          <span className="truncate">{item.address}</span>
        </button>
      ))}
    </div>
  );
}

