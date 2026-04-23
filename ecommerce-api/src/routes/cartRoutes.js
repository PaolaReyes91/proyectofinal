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
import isAdmin from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

// Obtener todos los carritos (admin)
router.get('/', authMiddleware, isAdmin, getCarts);

// Obtener carrito por ID
router.get('/:id', authMiddleware, isAdmin, getCartById);

// Obtener carrito por usuario
router.get('/user/:id', authMiddleware, getCartByUser);

// Crear nuevo carrito
router.post('/', authMiddleware, createCart);

// Agregar producto al carrito (función especial)
router.post('/add-product', authMiddleware, addProductToCart);

// Eliminar producto del carrito
router.delete('/remove-item/:productId', authMiddleware, removeProductFromCart);

// Actualizar carrito completo
router.put('/:id', authMiddleware, updateCart);

// Eliminar carrito
router.delete('/:id', authMiddleware, deleteCart);

export default router;
