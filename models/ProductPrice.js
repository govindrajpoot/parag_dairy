import mongoose from 'mongoose';

/**
 * ProductPrice Schema for MongoDB
 * Stores custom prices set by admin for specific distributors and products
 */
const productPriceSchema = new mongoose.Schema({
  distributorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Distributor ID is required']
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate price settings for same distributor-product
productPriceSchema.index({ distributorId: 1, productId: 1 }, { unique: true });

const ProductPrice = mongoose.model('ProductPrice', productPriceSchema);

export default ProductPrice;
