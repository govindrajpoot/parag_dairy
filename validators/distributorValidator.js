
import { body } from 'express-validator';

export const distributorUpdateValidation = [
  body('partyCode').optional().notEmpty().withMessage('Party code cannot be empty'),
  body('mobile').optional().notEmpty().withMessage('Mobile number cannot be empty'),
  body('route').optional().notEmpty().withMessage('Route cannot be empty'),
  body('openingBalance').optional().isFloat({ min: 0 }).withMessage('Opening balance must be a non-negative number'),
];

export const createDemandValidation = [
  body('rno').notEmpty().withMessage('RNO is required'),
  body('date').optional().isISO8601().withMessage('Date must be in ISO 8601 format'),
  body('products').isArray({ min: 1 }).withMessage('Products must be an array with at least one item'),
  body('products.*.productId').isInt({ min: 1 }).withMessage('Each product must have a valid positive integer productId'),
  body('products.*.qty').isInt({ min: 1 }).withMessage('Each product quantity must be a positive integer'),
];
