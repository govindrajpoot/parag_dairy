import { validationResult } from 'express-validator';
import { sendErrorResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS_CODES } from '../utils/constants.js';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return sendErrorResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, errorMessages.join(', '));
  }
  next();
};
