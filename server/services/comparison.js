// =============================================================================
// Ridera — Servicio de comparación (orquestador)
// =============================================================================

const { getEnabledProviders } = require('../providers');
const { geocode, getRoute } = require('../services/geocoding');
const { cache, MemoryCache } = require('../services/cache');
const { detectCity } = require('../config/tariffs');
const logger = require('../utils/logger');

const TIMEOUT_MS = 5000;

async function compare(originAddr, destinationAddr) {
  const reqId = `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  logger.info(`[${reqId}] Comparando: "${originAddr}" → "${destinationAddr}"`);

  // 1. Geocodificar
  const [origin, destination] = await Promise.all([geocode(originAddr), geocode(destinationAddr)]);

  if (!origin) {
    throw Object.assign(new Error(
      'No se pudo localizar el origen. Prueba: "Sol", "Atocha", "Aeropuerto Barajas"…'
    ), { code: 'ORIGIN_NOT_FOUND' });
  }
  if (!destination) {
    throw Object.assign(new Error(
      'No se pudo localizar el destino. Prueba: "Gran Via", "Chamartin", "Sagrada Familia"…'
    ), { code: 'DESTINATION_NOT_FOUND' });
  }

  // 2. Detectar ciudad
  const city = detectCity(origin);
  logger.info(`[${reqId}] Ciudad detectada: ${city}`);

  // 3. Cache
  const cacheKey = MemoryCache.routeKey(origin, destination);
  const cached = cache.get(cacheKey);
  if (cached) { logger.info(`[${reqId}] Cache HIT`); return cached; }

  // 4. Ruta
  const route = await getRoute(origin, destination);
  logger.info(`[${reqId}] Ruta: ${route.distanceKm} km, ${route.durationMin} min`);

  // 5. Consultar proveedores en paralelo
  const providers = getEnabledProviders();
  const providerResults = await Promise.all(
    providers.map((p) => p.fetchEstimates(origin, destination, route, city, TIMEOUT_MS))
  );

  // 6. Agregar estimaciones
  const allEstimates = providerResults
    .filter((r) => r.status === 'success')
    .flatMap((r) => r.estimates)
    .filter((e) => e.available);

  // 7. Highlights
  const cheapest = allEstimates.length
    ? allEstimates.reduce((a, b) => (a.price.min < b.price.min ? a : b))
    : null;
  const fastest = allEstimates.length
    ? allEstimates.reduce((a, b) => (a.eta < b.eta ? a : b))
    : null;

  const result = {
    id: reqId,
    origin: { address: origin.address, lat: origin.lat, lng: origin.lng },
    destination: { address: destination.address, lat: destination.lat, lng: destination.lng },
    city,
    route,
    providers: providerResults,
    allEstimates: allEstimates.sort((a, b) => a.price.min - b.price.min),
    cheapestId: cheapest ? `${cheapest.provider}-${cheapest.category}` : null,
    fastestId: fastest ? `${fastest.provider}-${fastest.category}` : null,
    timestamp: new Date().toISOString(),
  };

  cache.set(cacheKey, result);
  logger.info(`[${reqId}] Completado: ${allEstimates.length} estimaciones`);
  return result;
}

module.exports = { compare };

