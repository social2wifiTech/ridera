// =============================================================================
// Ridera — Motor de pricing
// =============================================================================

/**
 * Calcula rango de precio: base + km×€/km + min×€/min + fee, con surge.
 */
function calculatePrice(cat, distanceKm, durationMin) {
  const baseCost = cat.baseFare + distanceKm * cat.perKm + durationMin * cat.perMinute + cat.bookingFee;
  const effective = Math.max(baseCost, cat.minimumFare);
  const [surgeLow, surgeHigh] = cat.surgeRange;
  const surgeMid = surgeLow + (surgeHigh - surgeLow) * 0.5;
  const min = Math.round(effective * surgeLow * 100) / 100;
  const max = Math.round(effective * surgeMid * 100) / 100;
  return { min, max: Math.max(max, min + 0.50), currency: 'EUR' };
}

/**
 * Genera ETA aleatorio dentro del rango (sesgado hacia el mínimo).
 */
function generateETA(etaRange) {
  const [lo, hi] = etaRange;
  const skewed = Math.pow(Math.random(), 1.5);
  return Math.round(lo + skewed * (hi - lo));
}

/**
 * Estima multiplicador de surge según hora del día.
 */
function estimateSurge(surgeRange) {
  const hour = new Date().getHours();
  const [low, high] = surgeRange;
  let factor = 0.1;
  if ((hour >= 8 && hour <= 9) || (hour >= 18 && hour <= 20)) factor = 0.6;
  else if ((hour >= 14 && hour <= 15) || hour >= 23 || hour <= 2) factor = 0.4;
  return Math.round((low + (high - low) * factor) * 100) / 100;
}

module.exports = { calculatePrice, generateETA, estimateSurge };

