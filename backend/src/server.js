import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origin (Postman, apps móviles, health checks)
    if (!origin) return callback(null, true);

    // Permitir dominios listados, subdominios de Vercel o en desarrollo
    const isAllowed =
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production';

    if (isAllowed) {
      return callback(null, true);
    }
    return callback(new Error(`Bloqueado por política CORS: ${origin}`));
  },
  credentials: true
}));

app.use(express.json());

// Ruta raíz con información del servicio
app.get('/', (req, res) => {
  res.json({
    name: 'ShopSimple API',
    version: '1.0.0',
    status: 'online',
    message: 'Bienvenido a la API REST de ShopSimple E-commerce',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/products/categories',
      auth: '/api/auth',
      orders: '/api/orders'
    }
  });
});

// Verificación de estado del servidor (Health check)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Error no capturado:', err);
  res.status(500).json({ error: 'Ocurrió un error inesperado en el servidor.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});
