import User from '../models/userModel.js';
import { USER_ROLES } from '../utils/constants.js';

/**
 * Get all distributors.
 * @returns {Promise<Array<object>>} A list of all distributor users.
 */
export const getDistributors = async () => {
  const distributors = await User.findDistributors();
  return distributors.map(distributor => distributor.toSafeObject());
};

/**
 * Get a single distributor by ID.
 * @param {string} id - The ID of the distributor.
 * @returns {Promise<object|null>} The distributor user, or null if not found.
 */
export const getDistributorById = async (id) => {
  const distributor = await User.findOne({ _id: id, role: USER_ROLES.DISTRIBUTOR });
  if (!distributor) {
    return null;
  }
  return distributor.toSafeObject();
};

/**
 * Update a distributor by ID.
 * @param {string} id - The ID of the distributor to update.
 * @param {object} updateData - The data to update.
 * @returns {Promise<object|null>} The updated distributor user, or null if not found.
 */
export const updateDistributor = async (id, updateData) => {
  // Prevent role change or password update here (password update via reset-password)
  delete updateData.role;
  delete updateData.password;

  const distributor = await User.findOneAndUpdate(
    { _id: id, role: USER_ROLES.DISTRIBUTOR },
    updateData,
    { new: true }
  );

  if (!distributor) {
    return null;
  }
  return distributor.toSafeObject();
};

/**
 * Delete a distributor by ID.
 * @param {string} id - The ID of the distributor to delete.
 * @returns {Promise<object|null>} The deleted distributor user, or null if not found.
 */
export const deleteDistributor = async (id) => {
  const distributor = await User.findOneAndDelete({ _id: id, role: USER_ROLES.DISTRIBUTOR });
  if (!distributor) {
    return null;
  }
  return distributor.toSafeObject();
};
