import User from '../models/userModel.js';
import { UnauthorizedError } from '../utils/errors.js';

/**
 * Register a new user.
 * @param {object} userData - The user data for registration.
 * @returns {Promise<object>} The registered user and a JWT token.
 */
export const signup = async (userData) => {
  const userId = await User.create(userData);
  const user = await User.findById(userId);
  const token = user.generateAuthToken();
  return { user: user.toSafeObject(), token };
};

/**
 * Authenticate a user and generate a token.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The authenticated user and a JWT token.
 */
export const signin = async (email, password) => {
  const user = await User.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }
  const token = user.generateAuthToken();
  return { user: user.toSafeObject(), token };
};

/**
 * Get all users.
 * @returns {Promise<Array<object>>} A list of all users.
 */
export const getAllUsers = async () => {
  const users = await User.findAll();
  return users.map(user => user.toSafeObject());
};

/**
 * Placeholder for reset password logic.
 * @param {string} email - The user's email.
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  // Implement actual reset password logic here (e.g., send email with reset token)
  console.log(`Reset password requested for: ${email}`);
  // For now, just simulate success
  return Promise.resolve();
};
