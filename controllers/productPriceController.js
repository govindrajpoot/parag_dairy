import ProductPrice from '../models/ProductPriceModel.js';
import Product from '../models/ProductModel.js';
import User from '../models/userModel.js';

/**
 * @desc    Create a new product price for distributor
 * @route   POST /api/product-prices
 * @access  Private (Admin only)
 */
export const createProductPrice = async (req, res) => {
  try {
    const { distributorId, productId, price } = req.body;

    // Validate required fields
    if (!distributorId || !productId || price == null) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Distributor ID, Product ID, and price are required',
        data: null
      });
    }

    // Validate distributor exists and is Distributor role
    const distributor = await User.findById(distributorId);
    if (!distributor || distributor.role !== 'Distributor') {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Distributor not found',
        data: null
      });
    }

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Product not found',
        data: null
      });
    }

    // Check if price already exists for this distributor-product
    const existingPrice = await ProductPrice.findByDistributorAndProduct(distributorId, productId);
    if (existingPrice) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Price already set for this distributor and product',
        data: null
      });
    }

    const productPriceId = await ProductPrice.create({
      distributorId,
      productId,
      price
    });

    const productPrice = await ProductPrice.findById(productPriceId);

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Product price set successfully',
      data: productPrice
    });
  } catch (error) {
    console.error('Create product price error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Price already exists for this distributor and product',
        data: null
      });
    }

    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while setting product price',
      data: null
    });
  }
};

/**
 * @desc    Get all product prices with comprehensive product list per distributor
 * @route   GET /api/product-prices
 * @access  Private (Admin only)
 */
export const getProductPrices = async (req, res) => {
  try {
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

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Product prices with comprehensive product list retrieved successfully',
      data: {
        distributors: result,
        totalDistributors: distributors.length,
        totalProducts: products.length
      }
    });
  } catch (error) {
    console.error('Get product prices error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while retrieving product prices',
      data: null
    });
  }
};

/**
 * @desc    Get product price by ID
 * @route   GET /api/product-prices/:id
 * @access  Private (Admin only)
 */
export const getProductPriceById = async (req, res) => {
  try {
    const productPrice = await ProductPrice.findById(req.params.id);

    if (!productPrice) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Product price not found',
        data: null
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Product price retrieved successfully',
      data: productPrice
    });
  } catch (error) {
    console.error('Get product price by ID error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while retrieving product price',
      data: null
    });
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

    if (price == null) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Price is required',
        data: null
      });
    }

    const productPrice = await ProductPrice.findByIdAndUpdate(
      req.params.id,
      { price },
      { new: true, runValidators: true }
    )
    .populate('distributorId', 'name email')
    .populate('productId', 'productCode productName rate');

    if (!productPrice) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Product price not found',
        data: null
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Product price updated successfully',
      data: productPrice
    });
  } catch (error) {
    console.error('Update product price error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while updating product price',
      data: null
    });
  }
};

/**
 * @desc    Delete product price by ID
 * @route   DELETE /api/product-prices/:id
 * @access  Private (Admin only)
 */
export const deleteProductPrice = async (req, res) => {
  try {
    const productPrice = await ProductPrice.findByIdAndDelete(req.params.id);

    if (!productPrice) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Product price not found',
        data: null
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Product price deleted successfully',
      data: null
    });
  } catch (error) {
    console.error('Delete product price error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while deleting product price',
      data: null
    });
  }
};
