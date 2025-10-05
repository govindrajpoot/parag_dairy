import express from 'express';
import {
  createProductPrice,
  getProductPrices,
  getProductPriceById,
  updateProductPrice,
  deleteProductPrice
} from '../controllers/productPriceController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/product-prices:
 *   post:
 *     summary: Create a new product price for distributor
 *     tags: [Product Prices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - distributorId
 *               - productId
 *               - price
 *             properties:
 *               distributorId:
 *                 type: string
 *                 description: Distributor ID
 *               productId:
 *                 type: string
 *                 description: Product ID
 *               price:
 *                 type: number
 *                 description: Custom price for the distributor
 *     responses:
 *       201:
 *         description: Product price created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Distributor or product not found
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, authorizeRoles('Admin'), createProductPrice);

/**
 * @swagger
 * /api/product-prices:
 *   get:
 *     summary: Get all product prices with comprehensive product list per distributor
 *     tags: [Product Prices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product prices retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, authorizeRoles('Admin'), getProductPrices);

/**
 * @swagger
 * /api/product-prices/{id}:
 *   get:
 *     summary: Get product price by ID
 *     tags: [Product Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product price ID
 *     responses:
 *       200:
 *         description: Product price retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product price not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticateToken, authorizeRoles('Admin'), getProductPriceById);

/**
 * @swagger
 * /api/product-prices/{id}:
 *   put:
 *     summary: Update product price by ID
 *     tags: [Product Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product price ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - price
 *             properties:
 *               price:
 *                 type: number
 *                 description: New price for the distributor
 *     responses:
 *       200:
 *         description: Product price updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product price not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, authorizeRoles('Admin'), updateProductPrice);

/**
 * @swagger
 * /api/product-prices/{id}:
 *   delete:
 *     summary: Delete product price by ID
 *     tags: [Product Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product price ID
 *     responses:
 *       200:
 *         description: Product price deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product price not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), deleteProductPrice);

export default router;
