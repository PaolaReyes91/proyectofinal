import express from 'express';
import { body, param } from 'express-validator';
import validate from '../middlewares/validation.js';
import {
  getUserWishList,
  addToWishList,
  removeFromWishList,
  clearWishList,
  checkProductInWishList,
  moveToCart
} from '../controllers/wishListController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from "../middlewares/isAdminMiddleware.js";

const router = express.Router();

router.get('/', authMiddleware, getUserWishList);

router.post('/add', authMiddleware, [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId')
], validate, addToWishList);

router.get('/check/:productId', authMiddleware, [
  param('productId')
    .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId')
], validate, checkProductInWishList);

router.delete('/remove/:productId', authMiddleware, [
  param('productId')
    .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId')
], validate, removeFromWishList);

router.post('/move-to-cart', authMiddleware, [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId')
], validate, moveToCart);

router.delete('/clear', authMiddleware, clearWishList);

export default router;
