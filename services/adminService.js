import User from '../models/userModel.js';
import { USER_ROLES } from '../utils/constants.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

/**
 * Get all admins.
 * @returns {Promise<Array<object>>} A list of all admin users.
 */
export const getAdmins = async () => {
  return User.find({ role: USER_ROLES.ADMIN });
};

/**
 * Delete an admin by ID.
 * @param {string} id - The ID of the admin to delete.
 * @returns {Promise<object|null>} The deleted admin user, or null if not found or not an admin.
 */
export const deleteAdmin = async (id) => {
  const admin = await User.findById(id);

  if (!admin) {
    throw new NotFoundError('Admin not found');
  }

  if (admin.role !== USER_ROLES.ADMIN) {
    throw new BadRequestError('User is not an admin');
  }

  await User.findByIdAndDelete(id);
  return admin; // Return the deleted admin for confirmation
};
