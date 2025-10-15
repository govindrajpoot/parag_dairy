import { body } from 'express-validator';

export const createProductPriceValidation = [
  body('distributorId').notEmpty().withMessage('Distributor ID is required').isString(),
  body('productId').notEmpty().withMessage('Product ID is required').isString(),
  body('price').notEmpty().withMessage('Price is required').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
];

export const updateProductPriceValidation = [
  body('price').notEmpty().withMessage('Price is required').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
];
