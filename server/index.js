// =============================================================================
// Ridera — Servidor Express (Node 16 compatible)
// =============================================================================
// En desarrollo: solo sirve la API en :3001 (Vite proxea /api)
// En producción: sirve los estáticos de dist/ + API en :3000
// =============================================================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const compareRouter = require('./api/compare');
const healthRouter = require('./api/health');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 3000 : 3001);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan('short'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '60', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Demasiadas peticiones. Espera un momento.' },
});
app.use('/api', limiter);

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api', compareRouter);
app.use('/api', healthRouter);

// ─── Servir Frontend en Producción ───────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));

  // SPA fallback: cualquier ruta no-API devuelve index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ─── Error Handler Global ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, error: 'Error interno del servidor.' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`Ridera API corriendo en http://localhost:${PORT}`);
  logger.info(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});

