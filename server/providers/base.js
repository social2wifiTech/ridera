// =============================================================================
// Ridera — Clase base de proveedor
// =============================================================================
// Cada proveedor hereda de esta clase e implementa getEstimates().
// La clase base gestiona timeouts, errores y formato uniforme de respuesta.
// =============================================================================

const { tariffs, providerMeta } = require('../config/tariffs');
const { calculatePrice, generateETA, estimateSurge } = require('../services/pricing');
const { generateDeepLink } = require('../utils/deeplinks');
const logger = require('../utils/logger');

class BaseProvider {
  constructor(name) {
    this.name = name;
    this.displayName = providerMeta[name].displayName;
    this.color = providerMeta[name].color;
    this.integrationLevel = 'estimation'; // 'api' | 'partner' | 'estimation' | 'mock'
  }

  /** @returns {object[]} Array de estimaciones */
  getEstimates(origin, destination, route, city) {
    const config = tariffs[this.name] && tariffs[this.name][city];
    if (!config) {
      logger.warn(`No tariff config for ${this.name} in ${city}`);
      return [];
    }

    const deepLink = generateDeepLink(this.name, origin, destination);

    return config.categories.map((cat) => {
      const price = calculatePrice(cat, route.distanceKm, route.durationMin);
      return {
        provider: this.name,
        providerDisplayName: this.displayName,
        color: this.color,
        category: cat.id,
        categoryLabel: cat.label,
        price,
        eta: generateETA(config.etaRange),
        duration: route.durationMin,
        distance: route.distanceKm,
        surge: estimateSurge(cat.surgeRange),
        deepLink,
        integrationLevel: this.integrationLevel,
        available: true,
      };
    });
  }

  /**
   * Wrapper con timeout y manejo de errores.
   */
  async fetchEstimates(origin, destination, route, city, timeoutMs) {
    const start = Date.now();
    try {
      const estimates = await Promise.race([
        Promise.resolve(this.getEstimates(origin, destination, route, city)),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutMs || 5000)),
      ]);
      return {
        provider: this.name,
        displayName: this.displayName,
        color: this.color,
        estimates,
        status: estimates.length > 0 ? 'success' : 'empty',
        responseTimeMs: Date.now() - start,
      };
    } catch (err) {
      logger.error(`Provider ${this.name} error: ${err.message}`);
      return {
        provider: this.name,
        displayName: this.displayName,
        color: this.color,
        estimates: [],
        status: 'error',
        error: err.message,
        responseTimeMs: Date.now() - start,
      };
    }
  }
}

module.exports = BaseProvider;

