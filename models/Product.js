import mongoose from 'mongoose';

/**
 * Product Schema for MongoDB
 */
const productSchema = new mongoose.Schema({
  productCode: {
    type: String,
    required: [true, 'Product Code is required'],
    unique: true,
    trim: true
  },
  productName: {
    type: String,
    required: [true, 'Product Name is required'],
    trim: true
  },
  rate: {
    type: Number,
    required: [true, 'Rate is required'],
    min: [0, 'Rate cannot be negative']
  },
  gst: {
    type: Number,
    required: [true, 'GST is required'],
    min: [0, 'GST cannot be negative'],
    max: [100, 'GST cannot exceed 100%']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true
  },
  crate: {
    type: Number,
    required: [true, 'Crate is required'],
    min: [0, 'Crate cannot be negative']
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
