import express from 'express';
import {
  getDistributors,
  getDistributorById,
  updateDistributor,
  deleteDistributor
} from '../controllers/distributorController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/distributors:
 *   get:
 *     summary: Get all distributors
 *     tags: [Distributors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Distributors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     distributors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           role:
 *                             type: string
 *                           isActive:
 *                             type: boolean
 *                     count:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Server error
 */

/**
 * @route   GET /api/distributors
 * @desc    Get all distributors
 * @access  Private (Admin only)
 */
router.get('/', authenticateToken, (req, res, next) => {
  if (req.user.role === 'Admin') {
    return next();
  }
  return res.status(403).json({
    status: 403,
    success: false,
    message: 'Access denied. Insufficient permissions',
    data: null
  });
}, getDistributors);

/**
 * @swagger
 * /api/distributors/{id}:
 *   get:
 *     summary: Get distributor by ID
 *     tags: [Distributors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Distributor ID
 *     responses:
 *       200:
 *         description: Distributor retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Distributor not found
 *       500:
 *         description: Server error
 */

/**
 * @route   GET /api/distributors/:id
 * @desc    Get distributor by ID
 * @access  Private (Admin only)
 */
router.get('/:id', authenticateToken, (req, res, next) => {
  if (req.user.role === 'Admin') {
    return next();
  }
  return res.status(403).json({
    status: 403,
    success: false,
    message: 'Access denied. Insufficient permissions',
    data: null
  });
}, getDistributorById);

/**
 * @swagger
 * /api/distributors/{id}:
 *   put:
 *     summary: Update distributor by ID
 *     tags: [Distributors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Distributor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Distributor's full name
 *               mobile:
 *                 type: string
 *                 description: Mobile number
 *               route:
 *                 type: string
 *                 description: Route information
 *               openingBalance:
 *                 type: number
 *                 description: Opening balance
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address
 *               isActive:
 *                 type: boolean
 *                 description: Active status
 *     responses:
 *       200:
 *         description: Distributor updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Distributor not found
 *       500:
 *         description: Server error
 */

/**
 * @route   PUT /api/distributors/:id
 * @desc    Update distributor by ID
 * @access  Private (Admin or Distributor themselves)
 */
router.put('/:id', authenticateToken, (req, res, next) => {
  if (req.user.role === 'Admin' || req.user.id.toString() === req.params.id) {
    return next();
  }
  return res.status(403).json({
    status: 403,
    success: false,
    message: 'Access denied. Insufficient permissions',
    data: null
  });
}, updateDistributor);

/**
 * @swagger
 * /api/distributors/{id}:
 *   delete:
 *     summary: Delete distributor by ID
 *     tags: [Distributors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Distributor ID
 *     responses:
 *       200:
 *         description: Distributor deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedDistributor:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Distributor not found
 *       500:
 *         description: Server error
 */

/**
 * @route   DELETE /api/distributors/:id
 * @desc    Delete distributor by ID
 * @access  Private (Admin or Distributor themselves)
 */
router.delete('/:id', authenticateToken, (req, res, next) => {
  if (req.user.role === 'Admin' || req.user.id.toString() === req.params.id) {
    return next();
  }
  return res.status(403).json({
    status: 403,
    success: false,
    message: 'Access denied. Only Admin or owner can delete',
    data: null
  });
}, deleteDistributor);

export default router;
