import Product from '../models/ProductModel.js';
import ProductPrice from '../models/ProductPriceModel.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

/**
 * Create a new product.
 * @param {object} productData - The product data.
 * @returns {Promise<object>} The created product.
 */
export const createProduct = async (productData) => {
  const { productCode, productName, rate, gst, unit, crate } = productData;

  // Check if productCode already exists
  const existingProduct = await Product.findByProductCode(productCode.trim());
  if (existingProduct) {
    throw new BadRequestError('Product Code already exists');
  }

  const productId = await Product.create({
    productCode: productCode.trim(),
    productName: productName.trim(),
    rate,
    gst,
    unit: unit.trim(),
    crate
  });

  return Product.findById(productId);
};

/**
 * Get all products.
 * @returns {Promise<Array<object>>} A list of all products.
 */
export const getProducts = async () => {
  return Product.findAll();
};

/**
 * Get a single product by its ID.
 * @param {string} id - The product ID.
 * @returns {Promise<object|null>} The product, or null if not found.
 */
export const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  return product;
};

/**
 * Update a product.
 * @param {string} id - The product ID.
 * @param {object} updateData - The data to update.
 * @returns {Promise<object>} The updated product.
 */
export const updateProduct = async (id, updateData) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  await Product.update(id, updateData);
  return Product.findById(id);
};

/**
 * Delete a product by its ID.
 * @param {string} id - The product ID.
 * @returns {Promise<object|null>} The deleted product, or null if not found.
 */
export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  return product;
};

/**
 * Get all products with custom prices for a specific distributor.
 * @param {string} distributorId - The ID of the distributor.
 * @returns {Promise<Array<object>>} A list of products with their prices.
 */
export const getProductsForDistributor = async (distributorId) => {
  // Get all products
  const products = await Product.findAll();

  // Get custom prices for this distributor
  const customPrices = await ProductPrice.findByDistributorId(distributorId);

  // Create a map for quick lookup
  const priceMap = new Map();
  customPrices.forEach(cp => {
    priceMap.set(cp.productId, cp.price);
  });

  // Build response with price logic
  return products.map(product => {
    const productId = product.id;
    const customPrice = priceMap.get(productId);
    const isCustomPrice = customPrice !== undefined;

    return {
      id: product.id,
      productCode: product.productCode,
      productName: product.productName,
      defaultRate: product.rate,
      price: isCustomPrice ? customPrice : product.rate,
      isCustomPrice,
      gst: product.gst,
      unit: product.unit,
      crate: product.crate,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  });
};
