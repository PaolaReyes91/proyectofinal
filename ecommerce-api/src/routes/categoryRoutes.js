import express from "express";
import { query } from "express-validator";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategories,
} from '../controllers/categoryController.js';
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";

const router = express.Router();

router.get('/search', [
  query("parentCategory")
    .optional()
    .isMongoId()
    .withMessage("formato invalido para el id de categoria"),
], searchCategories);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);

export default router;