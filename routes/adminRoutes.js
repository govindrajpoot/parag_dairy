import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import { getAdmins, deleteAdmin } from '../controllers/adminController.js';

const router = express.Router();

/**
 * @route   GET /api/admins
 * @desc    Get all admins
 * @access  Private (Admin only)
 */
router.get('/', authenticateToken, authorizeRoles('Admin'), getAdmins);

/**
 * @route   DELETE /api/admins/:id
 * @desc    Delete admin by ID
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), deleteAdmin);

export default router;
