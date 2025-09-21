import express from 'express';
import { signup, signin, getAllUsers, resetPassword } from '../controllers/authController.js';
import { authenticateToken, authorizeRoles, canCreateUser } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Private (Admin/Distributor can create users)
 */
router.post('/signup', authenticateToken, canCreateUser, signup);

/**
 * @route   POST /api/auth/signin
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/signin', signin);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users (Admin only)
 * @access  Private (Admin)
 */
router.get('/users', authenticateToken, authorizeRoles('Admin'), getAllUsers);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset user password
 * @access  Public
 */
router.post('/reset-password', resetPassword);

export default router;
