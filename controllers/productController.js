import * as productService from '../services/productService.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS_CODES } from '../utils/constants.js';

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Admin only)
 */
export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    sendSuccessResponse(res, HTTP_STATUS_CODES.CREATED, 'Product created successfully', product);
  } catch (error) {
    console.error('Create product error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message || 'Internal server error while creating product');
  }
};

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Private (Admin only)
 */
export const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Products retrieved successfully', {
      products,
      count: products.length
    });
  } catch (error) {
    console.error('Get products error:', error);
    sendErrorResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, 'Internal server error while retrieving products');
  }
};

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Private (Admin only)
 */
export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return sendErrorResponse(res, HTTP_STATUS_CODES.NOT_FOUND, 'Product not found');
    }
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Product retrieved successfully', product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    sendErrorResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, 'Internal server error while retrieving product');
  }
};

/**
 * @desc    Update product by ID
 * @route   PUT /api/products/:id
 * @access  Private (Admin only)
 */
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return sendErrorResponse(res, HTTP_STATUS_CODES.NOT_FOUND, 'Product not found');
    }
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Product updated successfully', updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    sendErrorResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, 'Internal server error while updating product');
  }
};

/**
 * @desc    Delete product by ID
 * @route   DELETE /api/products/:id
 * @access  Private (Admin only)
 */
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      return sendErrorResponse(res, HTTP_STATUS_CODES.NOT_FOUND, 'Product not found');
    }
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Product deleted successfully', null);
  } catch (error) {
    console.error('Delete product error:', error);
    sendErrorResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, 'Internal server error while deleting product');
  }
};

/**
 * @desc    Get all products with prices for distributor
 * @route   GET /api/products/distributor
 * @access  Private (Distributor or Admin)
 */
export const getProductsForDistributor = async (req, res) => {
  try {
    const distributorId = req.user.id;
    const productsWithPrices = await productService.getProductsForDistributor(distributorId);
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Products with prices retrieved successfully', {
      products: productsWithPrices,
      count: productsWithPrices.length
    });
  } catch (error) {
    console.error('Get products for distributor error:', error);
    sendErrorResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, 'Internal server error while retrieving products');
  }
};
