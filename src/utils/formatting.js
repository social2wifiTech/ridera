/**
 * Formatea un rango de precio: "4,50 € – 6,20 €"
 */
export function formatPriceRange(price) {
  if (!price) return '—';
  const fmt = (n) =>
    n.toLocaleString('es-ES', { style: 'currency', currency: price.currency || 'EUR', minimumFractionDigits: 2 });
  if (price.min === price.max) return fmt(price.min);
  return `${fmt(price.min)} – ${fmt(price.max)}`;
}

/**
 * Formatea minutos: "5 min" o "1 h 23 min"
 */
export function formatDuration(minutes) {
  if (minutes == null) return '—';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h} h ${m} min` : `${h} h`;
}

/**
 * Formatea distancia: "3,2 km"
 */
export function formatDistance(km) {
  if (km == null) return '—';
  return `${km.toFixed(1).replace('.', ',')} km`;
}

/**
 * Formatea ETA: "3–5 min"
 */
export function formatETA(minutes) {
  if (minutes == null) return '—';
  const lo = Math.max(1, Math.round(minutes) - 1);
  const hi = Math.round(minutes) + 1;
  return `${lo}–${hi} min`;
}

