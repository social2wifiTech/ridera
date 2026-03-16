export default function LoadingState() {
  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-center text-gray-500 animate-pulse">⏳ Consultando proveedores…</p>
      <div className="flex items-center justify-center gap-4">
        <div className="shimmer h-5 w-24 rounded-md" />
        <div className="shimmer h-5 w-20 rounded-md" />
        <div className="shimmer h-5 w-28 rounded-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="shimmer h-6 w-16 rounded-full" />
              <div className="shimmer h-4 w-24 rounded" />
            </div>
            <div className="shimmer h-8 w-36 rounded" />
            <div className="grid grid-cols-3 gap-2">
              <div className="shimmer h-14 rounded-lg" />
              <div className="shimmer h-14 rounded-lg" />
              <div className="shimmer h-14 rounded-lg" />
            </div>
            <div className="shimmer h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

