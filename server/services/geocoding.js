// =============================================================================
// Ridera — Servicio de Geocoding (con fallback local sin API key)
// =============================================================================

const axios = require('axios');
const logger = require('../utils/logger');
const { estimateDrivingDistance, estimateDrivingDuration } = require('../utils/geo');

// ─── Ubicaciones conocidas (desarrollo sin Google API key) ──────────────────

const KNOWN = {
  // Madrid
  'sol':                 { lat: 40.4169, lng: -3.7035 },
  'puerta del sol':      { lat: 40.4169, lng: -3.7035 },
  'atocha':              { lat: 40.4065, lng: -3.6883 },
  'estacion de atocha':  { lat: 40.4065, lng: -3.6883 },
  'aeropuerto barajas':  { lat: 40.4722, lng: -3.5609 },
  'aeropuerto madrid':   { lat: 40.4722, lng: -3.5609 },
  'barajas':             { lat: 40.4722, lng: -3.5609 },
  'mad':                 { lat: 40.4722, lng: -3.5609 },
  'gran via':            { lat: 40.4200, lng: -3.7025 },
  'chamartin':           { lat: 40.4726, lng: -3.6823 },
  'bernabeu':            { lat: 40.4531, lng: -3.6883 },
  'santiago bernabeu':   { lat: 40.4531, lng: -3.6883 },
  'retiro':              { lat: 40.4153, lng: -3.6844 },
  'cibeles':             { lat: 40.4196, lng: -3.6934 },
  'malasana':            { lat: 40.4266, lng: -3.7037 },
  'chueca':              { lat: 40.4225, lng: -3.6972 },
  'lavapies':            { lat: 40.4097, lng: -3.7010 },
  'callao':              { lat: 40.4200, lng: -3.7060 },
  'moncloa':             { lat: 40.4348, lng: -3.7193 },
  'ifema':               { lat: 40.4653, lng: -3.6155 },
  'nuevos ministerios':  { lat: 40.4461, lng: -3.6923 },
  'plaza espana':        { lat: 40.4233, lng: -3.7122 },
  'opera':               { lat: 40.4179, lng: -3.7100 },
  'la latina':           { lat: 40.4115, lng: -3.7117 },
  // Barcelona
  'plaza cataluna':      { lat: 41.3870, lng: 2.1700 },
  'placa catalunya':     { lat: 41.3870, lng: 2.1700 },
  'sagrada familia':     { lat: 41.4036, lng: 2.1744 },
  'aeropuerto el prat':  { lat: 41.2974, lng: 2.0833 },
  'aeropuerto barcelona':{ lat: 41.2974, lng: 2.0833 },
  'el prat':             { lat: 41.2974, lng: 2.0833 },
  'bcn':                 { lat: 41.2974, lng: 2.0833 },
  'camp nou':            { lat: 41.3809, lng: 2.1228 },
  'las ramblas':         { lat: 41.3797, lng: 2.1746 },
  'la rambla':           { lat: 41.3797, lng: 2.1746 },
  'barceloneta':         { lat: 41.3807, lng: 2.1891 },
  'sants':               { lat: 41.3793, lng: 2.1408 },
  'paseo de gracia':     { lat: 41.3916, lng: 2.1650 },
  'diagonal':            { lat: 41.3936, lng: 2.1574 },
  'park guell':          { lat: 41.4145, lng: 2.1527 },
  'montjuic':            { lat: 41.3639, lng: 2.1586 },
  'barrio gotico':       { lat: 41.3833, lng: 2.1761 },
};

// ─── Geocodificación ─────────────────────────────────────────────────────────

async function geocode(address) {
  if (!address) return null;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (apiKey) return geocodeGoogle(address, apiKey);
  return geocodeLocal(address);
}

async function geocodeGoogle(address, apiKey) {
  try {
    const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: { address, key: apiKey, language: 'es', region: 'es' },
      timeout: 5000,
    });
    if (data.status !== 'OK' || !data.results.length) return geocodeLocal(address);
    const loc = data.results[0].geometry.location;
    return { address: data.results[0].formatted_address, lat: loc.lat, lng: loc.lng };
  } catch (e) {
    logger.warn('Google geocoding error, using fallback', e.message);
    return geocodeLocal(address);
  }
}

function geocodeLocal(address) {
  const norm = address.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (KNOWN[norm]) return { address, ...KNOWN[norm] };
  const match = Object.entries(KNOWN).find(([k]) => norm.includes(k) || k.includes(norm));
  if (match) return { address: match[0], ...match[1] };
  return null;
}

// ─── Ruta ────────────────────────────────────────────────────────────────────

async function getRoute(origin, destination) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (apiKey) {
    try {
      const { data } = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          key: apiKey, mode: 'driving', language: 'es',
        },
        timeout: 5000,
      });
      if (data.status === 'OK' && data.routes.length) {
        const leg = data.routes[0].legs[0];
        return {
          distanceKm: Math.round(leg.distance.value / 100) / 10,
          durationMin: Math.round(leg.duration.value / 60),
        };
      }
    } catch (e) {
      logger.warn('Google directions error, using estimate', e.message);
    }
  }
  const distanceKm = estimateDrivingDistance(origin, destination);
  const durationMin = estimateDrivingDuration(distanceKm);
  return { distanceKm, durationMin };
}

// ─── Autocompletado ──────────────────────────────────────────────────────────

function autocomplete(query) {
  if (!query || query.length < 2) return [];
  const norm = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  return Object.entries(KNOWN)
    .filter(([k]) => k.includes(norm))
    .slice(0, 6)
    .map(([k, v]) => ({ address: k.charAt(0).toUpperCase() + k.slice(1), ...v }));
}

module.exports = { geocode, getRoute, autocomplete };

