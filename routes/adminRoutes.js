import express from 'express';
import { auth } from '../middlewares/auth.js';
import { getAdmins, deleteAdmin } from '../controllers/adminController.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

/**
 * @route   GET /api/admins
 * @desc    Get all admins
 * @access  Private (Admin only)
 */
router.get('/', ...auth(USER_ROLES.ADMIN), getAdmins);

/**
 * @route   DELETE /api/admins/:id
 * @desc    Delete admin by ID
 * @access  Private (Admin only)
 */
router.delete('/:id', ...auth(USER_ROLES.ADMIN), deleteAdmin);

export default router;
