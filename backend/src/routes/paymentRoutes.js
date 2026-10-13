import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Endpoint de pago simulado (para pruebas rápidas de flujo de checkout)
router.post('/simulate', authenticateToken, async (req, res) => {
  const { amount, cardNumber } = req.body;

  // Simulación con retardo de 1 segundo
  setTimeout(() => {
    // Si la tarjeta termina en "0000", simulamos rechazo para probar flujos de error
    if (cardNumber && cardNumber.endsWith('0000')) {
      return res.status(400).json({
        success: false,
        status: 'REJECTED',
        message: 'Pago rechazado por el emisor de la tarjeta de prueba.'
      });
    }

    return res.json({
      success: true,
      status: 'APPROVED',
      transactionId: 'TX-' + Math.floor(100000 + Math.random() * 900000),
      message: '¡Pago simulado aprobado exitosamente!'
    });
  }, 1000);
});

// Endpoint preparado para Checkout Pro de Mercado Pago (cuando se configure el Access Token)
router.post('/mercadopago/create-preference', authenticateToken, async (req, res) => {
  const { items } = req.body;
  const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!mpAccessToken) {
    // Si no está configurada la llave, devolvemos simulación transparente
    return res.json({
      sandbox: true,
      initPoint: null,
      message: 'Modo sandbox simulado. Agrega MERCADOPAGO_ACCESS_TOKEN en tu .env para conectar con la API real.'
    });
  }

  try {
    // Aquí iría el llamado a Mercado Pago SDK
    // const preference = await client.create({ body: { items, back_urls: ... } });
    return res.json({
      sandbox: true,
      message: 'Mercado Pago preference endpoint preparado.'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
