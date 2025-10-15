import * as distributorService from '../services/distributorService.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS_CODES } from '../utils/constants.js';

/**
 * @desc    Get all distributors
 * @route   GET /api/distributors
 * @access  Private (Admin only)
 */
export const getDistributors = async (req, res) => {
  try {
    const distributors = await distributorService.getDistributors();
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Distributors retrieved successfully', {
      distributors,
      count: distributors.length
    });
  } catch (error) {
    console.error('Get distributors error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message || 'Internal server error while retrieving distributors');
  }
};

/**
 * @desc    Get distributor by ID
 * @route   GET /api/distributors/:id
 * @access  Private (Admin only)
 */
export const getDistributorById = async (req, res) => {
  try {
    const distributor = await distributorService.getDistributorById(req.params.id);
    if (!distributor) {
      return sendErrorResponse(res, HTTP_STATUS_CODES.NOT_FOUND, 'Distributor not found');
    }
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Distributor retrieved successfully', distributor);
  } catch (error) {
    console.error('Get distributor by ID error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message || 'Internal server error while retrieving distributor');
  }
};

/**
 * @desc    Update distributor by ID
 * @route   PUT /api/distributors/:id
 * @access  Private (Admin only)
 */
export const updateDistributor = async (req, res) => {
  try {
    const updatedDistributor = await distributorService.updateDistributor(req.params.id, req.body);
    if (!updatedDistributor) {
      return sendErrorResponse(res, HTTP_STATUS_CODES.NOT_FOUND, 'Distributor not found');
    }
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Distributor updated successfully', updatedDistributor);
  } catch (error) {
    console.error('Update distributor error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message || 'Internal server error while updating distributor');
  }
};

/**
 * @desc    Delete distributor by ID
 * @route   DELETE /api/distributors/:id
 * @access  Private (Admin only)
 */
export const deleteDistributor = async (req, res) => {
  try {
    const deletedDistributor = await distributorService.deleteDistributor(req.params.id);
    if (!deletedDistributor) {
      return sendErrorResponse(res, HTTP_STATUS_CODES.NOT_FOUND, 'Distributor not found');
    }
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Distributor deleted successfully', null);
  } catch (error) {
    console.error('Delete distributor error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message || 'Internal server error while deleting distributor');
  }
};
