import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Admin only)
 */
router.post('/', authenticateToken, authorizeRoles('Admin'), createProduct);

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Private (Admin only)
 */
router.get('/', authenticateToken, authorizeRoles('Admin'), getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Private (Admin only)
 */
router.get('/:id', authenticateToken, authorizeRoles('Admin'), getProductById);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product by ID
 * @access  Private (Admin only)
 */
router.put('/:id', authenticateToken, authorizeRoles('Admin'), updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product by ID
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), deleteProduct);

export default router;
