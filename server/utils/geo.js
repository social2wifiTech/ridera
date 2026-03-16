// =============================================================================
// Ridera — Utilidades geográficas (Haversine)
// =============================================================================

const EARTH_RADIUS_KM = 6371;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Distancia en línea recta entre dos coordenadas (km).
 */
function haversineDistance(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLon * sinLon;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * Estima distancia de conducción (factor urbano ×1.35).
 */
function estimateDrivingDistance(a, b) {
  return Math.round(haversineDistance(a, b) * 1.35 * 10) / 10;
}

/**
 * Estima duración en minutos (velocidad media urbana 25 km/h).
 */
function estimateDrivingDuration(distanceKm) {
  return Math.round((distanceKm / 25) * 60);
}

module.exports = { haversineDistance, estimateDrivingDistance, estimateDrivingDuration };

