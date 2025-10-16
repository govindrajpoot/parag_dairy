import { body } from 'express-validator';

export const updateDemandDispatchValidation = [
  body('dispatch_qty').isInt({ min: 0 }).withMessage('Dispatch quantity must be a non-negative integer'),
  body('dispatch_date').isISO8601().withMessage('Dispatch date must be in ISO 8601 format'),
  body('dispatch_no').optional().notEmpty().withMessage('Dispatch number cannot be empty'),
  body('gate_pass_no').optional().notEmpty().withMessage('Gate pass number cannot be empty'),
  body('vehicle_no').optional().notEmpty().withMessage('Vehicle number cannot be empty'),
];
