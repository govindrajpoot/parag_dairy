/**
 * @fileoverview This file contains the constants used in the application.
 * @module utils/constants
 */

/**
 * User roles
 * @enum {string}
 */
export const USER_ROLES = {
  ADMIN: 'Admin',
  DISTRIBUTOR: 'Distributor',
  SUB_ADMIN: 'Sub-Admin'
};

/**
 * HTTP status codes
 * @enum {number}
 */
export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};
