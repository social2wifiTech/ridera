// =============================================================================
// Ridera — Registry de proveedores
// =============================================================================

const uber = require('./uber');
const cabify = require('./cabify');
const bolt = require('./bolt');
const freenow = require('./freenow');

const all = [uber, cabify, bolt, freenow];

function getEnabledProviders() {
  return all.filter((p) => {
    const envKey = `PROVIDER_${p.name.toUpperCase()}_ENABLED`;
    return process.env[envKey] !== 'false';
  });
}

module.exports = { all, getEnabledProviders };

