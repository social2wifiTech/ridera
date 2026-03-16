// =============================================================================
// Ridera — API: GET /api/health + GET /api/autocomplete
// =============================================================================

const { Router } = require('express');
const { getEnabledProviders } = require('../providers');
const { autocomplete } = require('../services/geocoding');

const router = Router();

router.get('/health', (req, res) => {
  const providers = getEnabledProviders();
  res.json({
    status: 'ok',
    version: '0.2.0',
    node: process.version,
    timestamp: new Date().toISOString(),
    providers: providers.map((p) => ({ name: p.name, displayName: p.displayName, integrationLevel: p.integrationLevel })),
    googleMapsConfigured: !!process.env.GOOGLE_MAPS_API_KEY,
  });
});

router.get('/autocomplete', (req, res) => {
  const q = req.query.q;
  const results = autocomplete(q || '');
  res.json({ success: true, results });
});

module.exports = router;

