import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import { getAdmins, deleteAdmin } from '../controllers/adminController.js';

const router = express.Router();

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admins retrieved successfully
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
 *                     admins:
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
 * @route   GET /api/admins
 * @desc    Get all admins
 * @access  Private (Admin only)
 */
router.get('/', authenticateToken, authorizeRoles('Admin'), getAdmins);

/**
 * @swagger
 * /api/admins/{id}:
 *   delete:
 *     summary: Delete admin by ID
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: Admin ID
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */

/**
 * @route   DELETE /api/admins/:id
 * @desc    Delete admin by ID
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), deleteAdmin);

export default router;
