import * as adminService from '../services/adminService.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS_CODES } from '../utils/constants.js';

/**
 * @desc    Get all admins
 * @route   GET /api/admins
 * @access  Private (Admin only)
 */
export const getAdmins = async (req, res) => {
  try {
    const admins = await adminService.getAdmins();
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Admins retrieved successfully', {
      admins,
      count: admins.length
    });
  } catch (error) {
    console.error('Get admins error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message || 'Internal server error while retrieving admins');
  }
};

/**
 * @desc    Delete admin by ID
 * @route   DELETE /api/admins/:id
 * @access  Private (Admin only)
 */
export const deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await adminService.deleteAdmin(req.params.id);
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Admin deleted successfully', deletedAdmin);
  } catch (error) {
    console.error('Delete admin error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message || 'Internal server error while deleting admin');
  }
};
