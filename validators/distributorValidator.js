
import { body } from 'express-validator';

export const distributorValidation = [
  body('partyCode').notEmpty().withMessage('Party code is required'),
  body('mobile').notEmpty().withMessage('Mobile number is required'),
  body('route').notEmpty().withMessage('Route is required'),
  body('openingBalance').isFloat({ min: 0 }).withMessage('Opening balance must be a non-negative number'),
];
