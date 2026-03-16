// =============================================================================
// Ridera — Logger sencillo (Node 16 compatible)
// =============================================================================

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = LEVELS[process.env.LOG_LEVEL || 'info'] || 1;

function fmt(level, msg, data) {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level.toUpperCase()}] ${msg}`;
  return data !== undefined ? `${base} ${JSON.stringify(data)}` : base;
}

module.exports = {
  debug: (msg, data) => { if (currentLevel <= 0) console.debug(fmt('debug', msg, data)); },
  info:  (msg, data) => { if (currentLevel <= 1) console.info(fmt('info', msg, data)); },
  warn:  (msg, data) => { if (currentLevel <= 2) console.warn(fmt('warn', msg, data)); },
  error: (msg, data) => { if (currentLevel <= 3) console.error(fmt('error', msg, data)); },
};

