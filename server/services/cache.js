// =============================================================================
// Ridera — Cache en memoria con TTL
// =============================================================================

class MemoryCache {
  constructor(ttlSeconds) {
    this.store = new Map();
    this.ttl = (ttlSeconds || 300) * 1000;
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key, data, ttlMs) {
    this.store.set(key, { data, expiresAt: Date.now() + (ttlMs || this.ttl) });
  }

  clear() {
    this.store.clear();
  }

  static routeKey(origin, destination) {
    const r = (n) => n.toFixed(4);
    return `${r(origin.lat)},${r(origin.lng)}-${r(destination.lat)},${r(destination.lng)}`;
  }
}

const cache = new MemoryCache(parseInt(process.env.CACHE_TTL_SECONDS || '300', 10));

module.exports = { cache, MemoryCache };

