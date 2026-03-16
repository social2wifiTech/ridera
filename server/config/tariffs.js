// =============================================================================
// Ridera — Configuración de tarifas por proveedor y ciudad
// =============================================================================
// Fuentes: tarifas públicas aproximadas de cada plataforma en España.
// Formato: { baseFare, perKm, perMinute, minimumFare, bookingFee, surgeRange }
// =============================================================================

const tariffs = {
  uber: {
    madrid: {
      etaRange: [3, 10],
      categories: [
        { id: 'economy', label: 'UberX', baseFare: 1.15, perKm: 0.73, perMinute: 0.14, minimumFare: 3.50, bookingFee: 0.85, surgeRange: [1.0, 1.8] },
        { id: 'comfort', label: 'Uber Comfort', baseFare: 2.50, perKm: 1.05, perMinute: 0.20, minimumFare: 5.00, bookingFee: 0.85, surgeRange: [1.0, 1.6] },
        { id: 'xl', label: 'UberXL', baseFare: 2.00, perKm: 1.20, perMinute: 0.22, minimumFare: 6.00, bookingFee: 0.85, surgeRange: [1.0, 1.5] },
      ],
    },
    barcelona: {
      etaRange: [3, 12],
      categories: [
        { id: 'economy', label: 'UberX', baseFare: 1.15, perKm: 0.75, perMinute: 0.15, minimumFare: 3.50, bookingFee: 0.85, surgeRange: [1.0, 1.8] },
        { id: 'comfort', label: 'Uber Comfort', baseFare: 2.50, perKm: 1.10, perMinute: 0.21, minimumFare: 5.50, bookingFee: 0.85, surgeRange: [1.0, 1.6] },
      ],
    },
  },
  cabify: {
    madrid: {
      etaRange: [2, 8],
      categories: [
        { id: 'economy', label: 'Cabify Lite', baseFare: 1.40, perKm: 0.81, perMinute: 0.12, minimumFare: 4.00, bookingFee: 0.50, surgeRange: [1.0, 1.5] },
        { id: 'comfort', label: 'Cabify', baseFare: 2.30, perKm: 1.00, perMinute: 0.18, minimumFare: 5.00, bookingFee: 0.50, surgeRange: [1.0, 1.4] },
        { id: 'xl', label: 'Cabify Group', baseFare: 3.00, perKm: 1.30, perMinute: 0.24, minimumFare: 7.00, bookingFee: 0.50, surgeRange: [1.0, 1.3] },
        { id: 'eco', label: 'Cabify Eco', baseFare: 1.20, perKm: 0.70, perMinute: 0.10, minimumFare: 3.50, bookingFee: 0.50, surgeRange: [1.0, 1.3] },
      ],
    },
    barcelona: {
      etaRange: [2, 9],
      categories: [
        { id: 'economy', label: 'Cabify Lite', baseFare: 1.45, perKm: 0.84, perMinute: 0.13, minimumFare: 4.00, bookingFee: 0.50, surgeRange: [1.0, 1.5] },
        { id: 'comfort', label: 'Cabify', baseFare: 2.40, perKm: 1.05, perMinute: 0.19, minimumFare: 5.50, bookingFee: 0.50, surgeRange: [1.0, 1.4] },
      ],
    },
  },
  bolt: {
    madrid: {
      etaRange: [2, 7],
      categories: [
        { id: 'economy', label: 'Bolt', baseFare: 0.85, perKm: 0.63, perMinute: 0.10, minimumFare: 3.00, bookingFee: 0.49, surgeRange: [1.0, 2.0] },
        { id: 'comfort', label: 'Bolt Comfort', baseFare: 1.50, perKm: 0.85, perMinute: 0.15, minimumFare: 4.50, bookingFee: 0.49, surgeRange: [1.0, 1.7] },
        { id: 'xl', label: 'Bolt XL', baseFare: 1.80, perKm: 1.05, perMinute: 0.18, minimumFare: 5.50, bookingFee: 0.49, surgeRange: [1.0, 1.5] },
      ],
    },
    barcelona: {
      etaRange: [3, 9],
      categories: [
        { id: 'economy', label: 'Bolt', baseFare: 0.90, perKm: 0.65, perMinute: 0.11, minimumFare: 3.00, bookingFee: 0.49, surgeRange: [1.0, 2.0] },
        { id: 'comfort', label: 'Bolt Comfort', baseFare: 1.55, perKm: 0.88, perMinute: 0.16, minimumFare: 4.50, bookingFee: 0.49, surgeRange: [1.0, 1.7] },
      ],
    },
  },
  freenow: {
    madrid: {
      etaRange: [3, 12],
      categories: [
        { id: 'economy', label: 'FREE NOW Taxi', baseFare: 2.50, perKm: 1.05, perMinute: 0.30, minimumFare: 4.50, bookingFee: 0.00, surgeRange: [1.0, 1.3] },
        { id: 'comfort', label: 'FREE NOW Lite', baseFare: 1.50, perKm: 0.80, perMinute: 0.14, minimumFare: 4.00, bookingFee: 0.60, surgeRange: [1.0, 1.6] },
      ],
    },
    barcelona: {
      etaRange: [4, 14],
      categories: [
        { id: 'economy', label: 'FREE NOW Taxi', baseFare: 2.10, perKm: 1.10, perMinute: 0.32, minimumFare: 4.00, bookingFee: 0.00, surgeRange: [1.0, 1.3] },
        { id: 'comfort', label: 'FREE NOW Lite', baseFare: 1.55, perKm: 0.82, perMinute: 0.15, minimumFare: 4.00, bookingFee: 0.60, surgeRange: [1.0, 1.6] },
      ],
    },
  },
};

const providerMeta = {
  uber:    { displayName: 'Uber',     color: '#000000' },
  cabify:  { displayName: 'Cabify',   color: '#7B61FF' },
  bolt:    { displayName: 'Bolt',     color: '#34D186' },
  freenow: { displayName: 'FREE NOW', color: '#E21E4D' },
};

const SUPPORTED_CITIES = {
  madrid:    { name: 'Madrid',    center: { lat: 40.4168, lng: -3.7038 } },
  barcelona: { name: 'Barcelona', center: { lat: 41.3874, lng: 2.1686 } },
};

function detectCity(coords) {
  let closest = 'madrid';
  let minDist = Infinity;
  for (const [id, city] of Object.entries(SUPPORTED_CITIES)) {
    const d = Math.sqrt(Math.pow(coords.lat - city.center.lat, 2) + Math.pow(coords.lng - city.center.lng, 2));
    if (d < minDist) { minDist = d; closest = id; }
  }
  return closest;
}

module.exports = { tariffs, providerMeta, SUPPORTED_CITIES, detectCity };

