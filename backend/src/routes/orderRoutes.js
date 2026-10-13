import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Todas las rutas de pedidos requieren estar autenticado
router.use(authenticateToken);

// Rutas de cliente
router.post('/', createOrder);
router.get('/my-orders', getUserOrders);

// Rutas de administrador
router.get('/admin/all', requireAdmin, getAllOrders);
router.patch('/:id/status', requireAdmin, updateOrderStatus);

export default router;
