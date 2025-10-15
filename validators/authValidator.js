
import { body } from 'express-validator';
import { USER_ROLES } from '../utils/constants.js';

export const signupValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(Object.values(USER_ROLES)).withMessage('Invalid role'),
];

export const signinValidation = [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const resetPasswordValidation = [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

export const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
];
