// =============================================================================
// Ridera — Deep Links por proveedor
// =============================================================================

function uberDeepLink(origin, destination) {
  const p = new URLSearchParams({
    action: 'setPickup',
    'pickup[latitude]': String(origin.lat),
    'pickup[longitude]': String(origin.lng),
    'dropoff[latitude]': String(destination.lat),
    'dropoff[longitude]': String(destination.lng),
  });
  return `https://m.uber.com/ul/?${p.toString()}`;
}

function cabifyDeepLink(origin, destination) {
  const p = new URLSearchParams({
    'pick-up': `${origin.lat},${origin.lng}`,
    'drop-off': `${destination.lat},${destination.lng}`,
  });
  return `https://cabify.com/r?${p.toString()}`;
}

function boltDeepLink(origin, destination) {
  const p = new URLSearchParams({
    pickup_lat: String(origin.lat),
    pickup_lng: String(origin.lng),
    dropoff_lat: String(destination.lat),
    dropoff_lng: String(destination.lng),
  });
  return `https://bolt.eu/es/ride/?${p.toString()}`;
}

function freenowDeepLink(origin, destination) {
  const p = new URLSearchParams({
    pickup_latitude: String(origin.lat),
    pickup_longitude: String(origin.lng),
    destination_latitude: String(destination.lat),
    destination_longitude: String(destination.lng),
  });
  return `https://free-now.com/ride/?${p.toString()}`;
}

const generators = { uber: uberDeepLink, cabify: cabifyDeepLink, bolt: boltDeepLink, freenow: freenowDeepLink };

function generateDeepLink(provider, origin, destination) {
  const fn = generators[provider];
  return fn ? fn(origin, destination) : '#';
}

module.exports = { generateDeepLink };

