import express from 'express';
import {
  getOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrder,
  updatePaymentStatus,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
} from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

// --- RUTAS PÚBLICAS / PROTEGIDAS (USUARIOS) ---

// Obtener órdenes del usuario autenticado (se quita el prefijo /orders)
// URL final: GET /api/orders/my-orders
router.get('/my-orders', authMiddleware, getOrdersByUser);

// Obtener orden específica por ID (solo dueño o admin)
// URL final: GET /api/orders/:id
router.get('/:id', authMiddleware, getOrderById);

// Crear nueva orden
// URL final: POST /api/orders
router.post('/', authMiddleware, createOrder);


// --- RUTAS DE ADMINISTRACIÓN (Solo con token y rol admin) ---

// Obtener todas las órdenes de la plataforma
// URL final: GET /api/orders
router.get('/', authMiddleware, isAdmin, getOrders);

// Actualizar solo el estado de pago
// URL final: PATCH /api/orders/:id/payment-status
router.patch('/:id/payment-status', authMiddleware, isAdmin, updatePaymentStatus);

// Actualizar orden completa
// URL final: PUT /api/orders/:id
router.put('/:id', authMiddleware, isAdmin, updateOrder);

// Actualizar estado de orden
// URL final: PATCH /api/orders/:id/status
router.patch('/:id/status', authMiddleware, isAdmin, updateOrderStatus);

// Cancelar orden
// URL final: POST /api/orders/:id/cancel
router.post('/:id/cancel', authMiddleware, cancelOrder);

// Eliminar orden
// URL final: DELETE /api/orders/:id
router.delete('/:id', authMiddleware, isAdmin, deleteOrder);

export default router;