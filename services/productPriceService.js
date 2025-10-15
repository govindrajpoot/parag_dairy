import ProductPrice from '../models/ProductPriceModel.js';
import Product from '../models/ProductModel.js';
import User from '../models/userModel.js';
import { USER_ROLES } from '../utils/constants.js';

/**
 * Create a new product price for a distributor.
 * @param {object} productPriceData - The product price data.
 * @returns {Promise<object>} The created product price.
 */
export const createProductPrice = async (productPriceData) => {
  const { distributorId, productId, price } = productPriceData;

  // Validate distributor exists and is Distributor role
  const distributor = await User.findById(distributorId);
  if (!distributor || distributor.role !== USER_ROLES.DISTRIBUTOR) {
    const error = new Error('Distributor not found');
    error.statusCode = 404;
    throw error;
  }

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if price already exists for this distributor-product
  const existingPrice = await ProductPrice.findByDistributorAndProduct(distributorId, productId);
  if (existingPrice) {
    const error = new Error('Price already set for this distributor and product');
    error.statusCode = 400;
    throw error;
  }

  const productPriceId = await ProductPrice.create({
    distributorId,
    productId,
    price
  });

  return ProductPrice.findById(productPriceId);
};

/**
 * Get all product prices with comprehensive product list per distributor.
 * @returns {Promise<Array<object>>} A list of product prices organized by distributor.
 */
export const getProductPrices = async () => {
  // Get all distributors
  const distributors = await User.findDistributors();

  // Get all products
  const products = await Product.findAll();

  // Get all custom prices
  const customPrices = await ProductPrice.findAll();

  // Organize data by distributor
  const result = distributors.map(distributor => {
    const distributorCustomPrices = customPrices.filter(cp =>
      cp.distributorId === distributor.id
    );

    const productsWithPrices = products.map(product => {
      const customPrice = distributorCustomPrices.find(cp =>
        cp.productId === product.id
      );

      return {
        _id: product.id,
        productCode: product.productCode,
        productName: product.productName,
        defaultRate: product.rate,
        price: customPrice ? customPrice.price : product.rate,
        isCustomPrice: !!customPrice,
        customPriceId: customPrice ? customPrice.id : null,
        gst: product.gst,
        unit: product.unit,
        crate: product.crate
      };
    });

    return {
      distributor: {
        _id: distributor.id,
        name: distributor.name,
        email: distributor.email
      },
      products: productsWithPrices,
      customPricesCount: distributorCustomPrices.length,
      totalProducts: products.length
    };
  });
  return result;
};

/**
 * Get a single product price by ID.
 * @param {string} id - The ID of the product price.
 * @returns {Promise<object|null>} The product price, or null if not found.
 */
export const getProductPriceById = async (id) => {
  return ProductPrice.findById(id);
};

/**
 * Update a product price by ID.
 * @param {string} id - The ID of the product price to update.
 * @param {number} price - The new price.
 * @returns {Promise<object|null>} The updated product price, or null if not found.
 */
export const updateProductPrice = async (id, price) => {
  const productPrice = await ProductPrice.findByIdAndUpdate(
    id,
    { price },
    { new: true, runValidators: true }
  )
  .populate('distributorId', 'name email')
  .populate('productId', 'productCode productName rate');

  if (!productPrice) {
    return null;
  }
  return productPrice;
};

/**
 * Delete a product price by ID.
 * @param {string} id - The ID of the product price to delete.
 * @returns {Promise<object|null>} The deleted product price, or null if not found.
 */
export const deleteProductPrice = async (id) => {
  const productPrice = await ProductPrice.findByIdAndDelete(id);
  if (!productPrice) {
    return null;
  }
  return productPrice;
};
