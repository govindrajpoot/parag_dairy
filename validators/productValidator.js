
import { body } from 'express-validator';

export const productValidation = [
  body('productCode').notEmpty().withMessage('Product Code is required').trim(),
  body('productName').notEmpty().withMessage('Product Name is required').trim(),
  body('rate').isFloat({ gt: 0 }).withMessage('Rate must be a positive number'),
  body('gst').isFloat({ min: 0, max: 100 }).withMessage('GST must be between 0 and 100'),
  body('unit').notEmpty().withMessage('Unit is required').trim(),
  body('crate').isInt({ gt: 0 }).withMessage('Crate must be a positive integer'),
];
