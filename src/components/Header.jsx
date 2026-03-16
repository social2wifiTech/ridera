import { Car } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <Car size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Ridera</span>
        </a>
        <span className="hidden sm:inline-flex badge bg-amber-50 text-amber-700 border border-amber-200">
          MVP Beta
        </span>
      </div>
    </header>
  );
}

