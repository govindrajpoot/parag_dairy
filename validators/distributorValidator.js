
import { body } from 'express-validator';

export const distributorUpdateValidation = [
  body('partyCode').optional().notEmpty().withMessage('Party code cannot be empty'),
  body('mobile').optional().notEmpty().withMessage('Mobile number cannot be empty'),
  body('route').optional().notEmpty().withMessage('Route cannot be empty'),
  body('openingBalance').optional().isFloat({ min: 0 }).withMessage('Opening balance must be a non-negative number'),
];
