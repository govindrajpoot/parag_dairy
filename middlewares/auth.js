import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

/**
 * Middleware to authenticate JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Access token is required',
        data: null
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Invalid or inactive user',
        data: null
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Token has expired',
        data: null
      });
    }

    return res.status(401).json({
      status: 401,
      success: false,
      message: 'Invalid token',
      data: null
    });
  }
};

/**
 * Middleware to check user roles
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Function} Middleware function
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'User not authenticated',
        data: null
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: 'Access denied. Insufficient permissions',
        data: null
      });
    }

    next();
  };
};

/**
 * Middleware to check if user can create specific roles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const canCreateUser = (req, res, next) => {
  const { role } = req.body;
  const userRole = req.user.role;

  // Admin can create Distributor and Sub-Admin
  if (userRole === 'Admin' && ['Distributor', 'Sub-Admin'].includes(role)) {
    return next();
  }

  // Distributor can only create Sub-Admin
  if (userRole === 'Distributor' && role === 'Sub-Admin') {
    return next();
  }

  return res.status(403).json({
    status: 403,
    success: false,
    message: `Access denied. ${userRole} cannot create ${role} users`,
    data: null
  });
};
