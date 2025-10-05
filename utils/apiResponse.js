/**
 * @fileoverview This file contains the utility functions for sending API responses.
 * @module utils/apiResponse
 */

import { HTTP_STATUS_CODES } from './constants.js';

/**
 * Sends a success response.
 * @param {object} res - The response object.
 * @param {number} statusCode - The HTTP status code.
 * @param {string} message - The success message.
 * @param {object} data - The data to be sent in the response.
 */
export const sendSuccessResponse = (res, statusCode, message, data) => {
  res.status(statusCode).json({
    status: statusCode,
    success: true,
    message,
    data
  });
};

/**
 * Sends an error response.
 * @param {object} res - The response object.
 * @param {number} statusCode - The HTTP status code.
 * @param {string} message - The error message.
 */
export const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({
    status: statusCode,
    success: false,
    message,
    data: null
  });
};
