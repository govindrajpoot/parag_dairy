import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { sendErrorResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS_CODES, USER_ROLES } from '../utils/constants.js';

/**
 * Middleware to authenticate JWT token.
 * This should be used as the first step in the auth process.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return sendErrorResponse(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'Access token is required');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // Get user from database
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return sendErrorResponse(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'Invalid or inactive user');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendErrorResponse(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'Token has expired');
    }
    return sendErrorResponse(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'Invalid token');
  }
};

/**
 * Middleware to check user roles.
 * This should be used after authenticateToken.
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Function} Middleware function
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      // This case should ideally be caught by authenticateToken first
      return sendErrorResponse(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'User not authenticated');
    }

    // If allowedRoles is empty, it means any authenticated user is allowed.
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return sendErrorResponse(res, HTTP_STATUS_CODES.FORBIDDEN, 'Access denied. Insufficient permissions');
    }

    next();
  };
};

/**
 * A factory function to create authentication and authorization middleware chain.
 * This provides a declarative way to protect routes, similar to NestJS decorators.
 *
 * @example
 * import { auth } from '../middlewares/auth.js';
 * import { USER_ROLES } from '../utils/constants.js';
 *
 * // Only Admin can access
 * router.get('/admin-stuff', ...auth(USER_ROLES.ADMIN), adminController.getStuff);
 *
 * // Admin and Distributor can access
 * router.get('/shared-stuff', ...auth(USER_ROLES.ADMIN, USER_ROLES.DISTRIBUTOR), sharedController.getSharedStuff);
 *
 * // Any authenticated user can access
 * router.get('/profile', ...auth(), userController.getProfile);
 *
 * @param  {...string} allowedRoles - A list of roles allowed to access the route from USER_ROLES.
 * If no roles are provided, it only checks for authentication.
 * @returns {Array<Function>} An array of middleware functions to be used with the spread operator in routes.
 */
export const auth = (...allowedRoles) => {
  return [authenticateToken, authorizeRoles(...allowedRoles)];
};


/**
 * Middleware to check if a user can create other users with specific roles.
 * This should be used in the user creation route.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const canCreateUser = (req, res, next) => {
  const { role: roleToCreate } = req.body;
  const { role: creatorRole } = req.user;

  if (creatorRole === USER_ROLES.ADMIN && [USER_ROLES.DISTRIBUTOR, USER_ROLES.SUB_ADMIN].includes(roleToCreate)) {
    return next();
  }

  if (creatorRole === USER_ROLES.DISTRIBUTOR && roleToCreate === USER_ROLES.SUB_ADMIN) {
    return next();
  }

  return sendErrorResponse(res, HTTP_STATUS_CODES.FORBIDDEN, `Access denied. ${creatorRole} cannot create ${roleToCreate} users.`);
};
