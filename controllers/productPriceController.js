import * as productPriceService from '../services/productPriceService.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS_CODES } from '../utils/constants.js';

/**
 * @desc    Create a new product price for distributor
 * @route   POST /api/product-prices
 * @access  Private (Admin only)
 */
export const createProductPrice = async (req, res) => {
  try {
    const productPrice = await productPriceService.createProductPrice(req.body);
    sendSuccessResponse(res, HTTP_STATUS_CODES.CREATED, 'Product price set successfully', productPrice);
  } catch (error) {
    console.error('Create product price error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message || 'Internal server error while setting product price');
  }
};

/**
 * @desc    Get all product prices with comprehensive product list per distributor
 * @route   GET /api/product-prices
 * @access  Private (Admin only)
 */
export const getProductPrices = async (req, res) => {
  try {
    const result = await productPriceService.getProductPrices();
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Product prices with comprehensive product list retrieved successfully', {
      distributors: result,
      totalDistributors: result.length,
      totalProducts: result.length > 0 ? result[0].totalProducts : 0 // Assuming all distributors have the same total products
    });
  } catch (error) {
    console.error('Get product prices error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message || 'Internal server error while retrieving product prices');
  }
};

/**
 * @desc    Get product price by ID
 * @route   GET /api/product-prices/:id
 * @access  Private (Admin only)
 */
export const getProductPriceById = async (req, res) => {
  try {
    const productPrice = await productPriceService.getProductPriceById(req.params.id);
    if (!productPrice) {
      return sendErrorResponse(res, HTTP_STATUS_CODES.NOT_FOUND, 'Product price not found');
    }
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Product price retrieved successfully', productPrice);
  } catch (error) {
    console.error('Get product price by ID error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message || 'Internal server error while retrieving product price');
  }
};

/**
 * @desc    Update product price by ID
 * @route   PUT /api/product-prices/:id
 * @access  Private (Admin only)
 */
export const updateProductPrice = async (req, res) => {
  try {
    const { price } = req.body;
    const updatedProductPrice = await productPriceService.updateProductPrice(req.params.id, price);
    if (!updatedProductPrice) {
      return sendErrorResponse(res, HTTP_STATUS_CODES.NOT_FOUND, 'Product price not found');
    }
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Product price updated successfully', updatedProductPrice);
  } catch (error) {
    console.error('Update product price error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message || 'Internal server error while updating product price');
  }
};

/**
 * @desc    Delete product price by ID
 * @route   DELETE /api/product-prices/:id
 * @access  Private (Admin only)
 */
export const deleteProductPrice = async (req, res) => {
  try {
    const deletedProductPrice = await productPriceService.deleteProductPrice(req.params.id);
    if (!deletedProductPrice) {
      return sendErrorResponse(res, HTTP_STATUS_CODES.NOT_FOUND, 'Product price not found');
    }
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Product price deleted successfully', null);
  } catch (error) {
    console.error('Delete product price error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message || 'Internal server error while deleting product price');
  }
};
