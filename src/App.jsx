import { Zap, DollarSign, Shield } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchForm from './components/SearchForm';
import ComparisonGrid from './components/ComparisonGrid';
import LoadingState from './components/LoadingState';
import { useComparison } from './hooks/useComparison';

export default function App() {
  const { data, loading, error, compare, reset } = useComparison();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ─── Hero ─────────────────────────────────────────────── */}
        <section className="gradient-hero text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-20 sm:pt-16 sm:pb-28">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6">
                <Zap size={16} /> Compara en segundos
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Encuentra el mejor<br />
                <span className="text-blue-200">precio en VTC</span>
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
                Compara al instante los precios de Uber, Cabify, Bolt y FREE NOW.
                Una búsqueda, todas las opciones.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <SearchForm onSearch={compare} loading={loading} />
            </div>
          </div>
        </section>

        {/* ─── Results ──────────────────────────────────────────── */}
        {(loading || data || error) && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 -mt-8">
            {error && !loading && (
              <div className="max-w-2xl mx-auto animate-fade-in">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <p className="text-red-700 font-medium mb-2">No se pudo completar la búsqueda</p>
                  <p className="text-sm text-red-600">{error}</p>
                  <button onClick={reset} className="btn-secondary mt-4 text-sm">Intentar de nuevo</button>
                </div>
              </div>
            )}

            {loading && <LoadingState />}

            {data && !loading && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Resultados</h2>
                  <p className="text-sm text-gray-500">{data.origin.address} → {data.destination.address}</p>
                </div>
                <ComparisonGrid data={data} />
              </div>
            )}
          </section>
        )}

        {/* ─── Features (cuando no hay resultados) ──────────────── */}
        {!loading && !data && !error && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">¿Por qué usar Ridera?</h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                Ahorra tiempo y dinero comparando todas las opciones de VTC en un solo lugar.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <Feature icon={DollarSign} title="Ahorra hasta un 40%"
                desc="Los precios varían enormemente entre proveedores. Ridera te muestra la opción más económica al instante." />
              <Feature icon={Zap} title="Comparación instantánea"
                desc="Sin instalar 4 apps diferentes. Una sola búsqueda te da todas las estimaciones de precio y ETA." />
              <Feature icon={Shield} title="Transparente e independiente"
                desc="Mostramos estimaciones basadas en tarifas públicas. Sin sesgos, sin favoritos, sin comisiones ocultas." />
            </div>

            {/* Providers */}
            <div className="mt-16 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-6">Comparamos para ti</p>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                {[
                  { name: 'Uber', color: 'bg-black' },
                  { name: 'Cabify', color: 'bg-[#7B61FF]' },
                  { name: 'Bolt', color: 'bg-[#34D186]' },
                  { name: 'FREE NOW', color: 'bg-[#E21E4D]' },
                ].map((p) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${p.color}`} />
                    <span className="text-sm font-medium text-gray-600">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cities */}
            <div className="mt-12 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Ciudades disponibles</p>
              <div className="flex items-center justify-center gap-3">
                <span className="px-3 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700">🏙️ Madrid</span>
                <span className="px-3 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700">🏖️ Barcelona</span>
                <span className="px-3 py-1.5 rounded-full bg-gray-50 text-sm text-gray-400 border border-dashed border-gray-200">+ Próximamente más</span>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="text-center p-6 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
        <Icon size={24} className="text-brand-600" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

