import Product from '../models/Product.js';

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Admin only)
 */
export const createProduct = async (req, res) => {
  try {
    const { productCode, productName, rate, gst, unit, crate } = req.body;

    // Validate required fields
    if (!productCode || !productName || rate == null || gst == null || !unit || crate == null) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'All product fields are required',
        data: null
      });
    }

    // Check if productCode already exists
    const existingProduct = await Product.findOne({ productCode: productCode.trim() });
    if (existingProduct) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Product Code already exists',
        data: null
      });
    }

    const product = new Product({
      productCode: productCode.trim(),
      productName: productName.trim(),
      rate,
      gst,
      unit: unit.trim(),
      crate
    });

    await product.save();

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while creating product',
      data: null
    });
  }
};

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Private (Admin only)
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        count: products.length
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while retrieving products',
      data: null
    });
  }
};

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Private (Admin only)
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Product not found',
        data: null
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while retrieving product',
      data: null
    });
  }
};

/**
 * @desc    Update product by ID
 * @route   PUT /api/products/:id
 * @access  Private (Admin only)
 */
export const updateProduct = async (req, res) => {
  try {
    const { productCode, productName, rate, gst, unit, crate } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Product not found',
        data: null
      });
    }

    // Update fields if provided
    if (productCode) product.productCode = productCode.trim();
    if (productName) product.productName = productName.trim();
    if (rate != null) product.rate = rate;
    if (gst != null) product.gst = gst;
    if (unit) product.unit = unit.trim();
    if (crate != null) product.crate = crate;

    await product.save();

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while updating product',
      data: null
    });
  }
};

/**
 * @desc    Delete product by ID
 * @route   DELETE /api/products/:id
 * @access  Private (Admin only)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Product not found',
        data: null
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Product deleted successfully',
      data: null
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while deleting product',
      data: null
    });
  }
};
