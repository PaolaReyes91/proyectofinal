import express from 'express';
import {
  getCarts,
  getCartById,
  getCartByUser,
  createCart,
  updateCart,
  deleteCart,
  addProductToCart,
  removeProductFromCart,
} from '../controllers/cartController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from "../middlewares/isAdminMiddleware.js";

const router = express.Router();

// Obtener todos los carritos (admin)
router.get('/', authMiddleware, isAdmin, getCarts);

// Obtener carrito por usuario - ANTES de /:id
router.get('/user/:id', authMiddleware, getCartByUser);

// Agregar producto al carrito - ANTES de /:id
router.post('/add-product', authMiddleware, addProductToCart);

// Eliminar producto del carrito - ANTES de /:id
router.delete('/remove-item/:productId', authMiddleware, removeProductFromCart);

// Obtener carrito por ID - DESPUÉS de las rutas específicas
router.get('/:id', authMiddleware, isAdmin, getCartById);

// Crear nuevo carrito
router.post('/', authMiddleware, createCart);

// Actualizar carrito completo
router.put('/:id', authMiddleware, updateCart);

// Eliminar carrito
router.delete('/:id', authMiddleware, deleteCart);

export default router;