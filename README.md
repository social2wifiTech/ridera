# 🚗 Ridera — Comparador de VTC / Ride-Hailing

> Compara al instante los precios de **Uber, Cabify, Bolt y FREE NOW**.

**Compatible con Node.js 16+** · Express + React + Vite 4 + Tailwind CSS 3

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Desarrollo (Express :3001 + Vite :5173)
npm run dev

# Abrir http://localhost:5173
```

### Producción

```bash
npm run build        # Compila frontend a dist/
npm start            # Express sirve API + estáticos en :3000
```

---

## 🏗️ Stack Tecnológico (Node 16 compatible)

| Capa | Tecnología | Versión | Node 16 |
|------|-----------|---------|:-------:|
| **Backend** | Express | 4.18 | ✅ |
| **Frontend** | React | 18.2 | ✅ |
| **Build** | Vite | 4.5 | ✅ |
| **Estilos** | Tailwind CSS | 3.4 | ✅ |
| **HTTP** | Axios | 1.6 | ✅ |
| **Iconos** | Lucide React | 0.263 | ✅ |

### ¿Por qué este stack?

- **Express** en lugar de Next.js: Compatible con Node 16 y cualquier glibc.
- **Vite 4** en lugar de Vite 5+: Última versión con soporte Node 16.
- **Tailwind 3** en lugar de v4: v4 requiere Node 20.
- **CommonJS** en backend: Máxima compatibilidad sin transpilación.
- **0 binarios nativos** en producción: Sin problemas de glibc.

---

## 📁 Estructura del Proyecto

```
ridera/
├── server/                   # Backend (Express, CommonJS)
│   ├── index.js              # Entry point — Express app
│   ├── api/
│   │   ├── compare.js        # POST /api/compare
│   │   └── health.js         # GET /api/health + /api/autocomplete
│   ├── providers/
│   │   ├── base.js           # Clase base abstracta
│   │   ├── uber.js           # Conector Uber
│   │   ├── cabify.js         # Conector Cabify
│   │   ├── bolt.js           # Conector Bolt
│   │   ├── freenow.js        # Conector FREE NOW
│   │   └── index.js          # Registry
│   ├── services/
│   │   ├── comparison.js     # Orquestador
│   │   ├── pricing.js        # Motor de cálculo de precios
│   │   ├── geocoding.js      # Geocoding + autocompletado
│   │   └── cache.js          # Cache en memoria con TTL
│   ├── config/
│   │   └── tariffs.js        # Tarifas por ciudad/proveedor
│   └── utils/
│       ├── deeplinks.js      # Deep links por proveedor
│       ├── geo.js            # Haversine
│       └── logger.js         # Logger
├── src/                      # Frontend (React + JSX)
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── SearchForm.jsx
│   │   ├── ProviderCard.jsx
│   │   ├── ComparisonGrid.jsx
│   │   └── LoadingState.jsx
│   ├── hooks/
│   │   └── useComparison.js
│   └── utils/
│       └── formatting.js
├── public/providers/         # Logos SVG
├── vite.config.js
├── tailwind.config.js
├── postcss.config.cjs
├── package.json
├── index.html
└── .env.example
```

---

## 🔌 API

### POST /api/compare

```bash
curl -X POST http://localhost:3001/api/compare \
  -H "Content-Type: application/json" \
  -d '{"origin":"Sol","destination":"Aeropuerto Barajas"}'
```

### GET /api/autocomplete?q=ato

### GET /api/health

---

## 🔧 Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | `3001` (dev) / `3000` (prod) | Puerto del servidor |
| `GOOGLE_MAPS_API_KEY` | — | Geocoding real (opcional) |
| `CACHE_TTL_SECONDS` | `300` | TTL de cache |
| `PROVIDER_*_ENABLED` | `true` | Activar/desactivar proveedores |
| `LOG_LEVEL` | `info` | Nivel de logging |

---

## 🚢 Despliegue en Plesk (Node 16)

```bash
# En el servidor (SSH)
cd /var/www/vhosts/tu-dominio/httpdocs
git clone <repo> ridera && cd ridera

npm install --production=false   # Incluir devDeps para build
npm run build                    # Compila frontend a dist/
npm prune --production           # Elimina devDeps del server

# Iniciar con PM2
npm install -g pm2
PORT=3000 NODE_ENV=production pm2 start server/index.js --name ridera
pm2 save && pm2 startup
```

Configurar reverse proxy en Plesk → Domain → Apache & nginx Settings:
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

---

## 📊 Integración por Proveedor

| Proveedor | API Pública | Estrategia MVP | Deep Links |
|-----------|:-----------:|----------------|:----------:|
| Uber | ❌ Deprecada | Estimación propia | ✅ |
| Cabify | ❌ Solo B2B | Estimación propia | ✅ |
| Bolt | ❌ No existe | Estimación propia | ✅ |
| FREE NOW | ❌ Deprecada | Estimación propia | ✅ |

**No se usa scraping.** Ningún proveedor tiene estimador web público accesible.

---

## 📄 Licencia

MIT
