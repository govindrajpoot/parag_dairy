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
 * @route   PUT /api/distributors/:id
 * @desc    Update distributor by ID
 * @access  Private (Admin or Distributor themselves)
 */
router.put('/:id', authenticateToken, (req, res, next) => {
  if (req.user.role === 'Admin' || req.user._id.toString() === req.params.id) {
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
 * @route   DELETE /api/distributors/:id
 * @desc    Delete distributor by ID
 * @access  Private (Admin or Distributor themselves)
 */
router.delete('/:id', authenticateToken, (req, res, next) => {
  if (req.user.role === 'Admin' || req.user._id.toString() === req.params.id) {
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
