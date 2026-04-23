import express from 'express';
import { query } from 'express-validator'
import {
  getProducts,
  getProductById,
  getProductByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
  
} from '../controllers/productController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';
import validate  from '../middlewares/validation.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/search',[
  query('minPrice').optional().isNumeric({min: 0}).withMessage('este campo debbe ser un numero positivo'),
  query('maxPrice').optional().isNumeric({min: 1}).withMessage('este campo debe ser un numero '),
  query('page').optional().isInt({min: 1}).withMessage('este campo debe ser un numero positivo'),
  query('limit').optional().isInt({min: 1}).withMessage('este campo debe ser un numero positivo'),
 ],validate, searchProducts);

router.get('/category/:idCategory', getProductByCategory);
router.get('/:id', getProductById);
router.post('/', authMiddleware, isAdmin, createProduct);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);


export default router;
