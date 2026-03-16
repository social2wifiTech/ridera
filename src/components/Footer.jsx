export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <p className="text-sm font-semibold text-gray-900">Ridera</p>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Ridera. Precios orientativos.</p>
        </div>
        <p className="text-[11px] text-gray-400 text-center leading-relaxed max-w-3xl mx-auto">
          Ridera no es un proveedor de transporte. Los precios son estimaciones calculadas a partir de tarifas
          públicas y pueden diferir del precio final. Ridera no está afiliada con Uber, Cabify, Bolt ni FREE NOW.
        </p>
      </div>
    </footer>
  );
}

