// =============================================================================
// Ridera — API: POST /api/compare
// =============================================================================

const { Router } = require('express');
const { compare } = require('../services/comparison');
const logger = require('../utils/logger');

const router = Router();

router.post('/compare', async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || typeof origin !== 'string' || origin.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Se requiere una dirección de origen válida.' });
    }
    if (!destination || typeof destination !== 'string' || destination.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Se requiere una dirección de destino válida.' });
    }

    const result = await compare(origin.trim(), destination.trim());
    res.json({ success: true, data: result });
  } catch (err) {
    const status = err.code === 'ORIGIN_NOT_FOUND' || err.code === 'DESTINATION_NOT_FOUND' ? 422 : 500;
    logger.error('Compare error:', err.message);
    res.status(status).json({ success: false, error: err.message });
  }
});

module.exports = router;

