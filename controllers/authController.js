import * as authService from '../services/authService.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS_CODES } from '../utils/constants.js';

export const signup = async (req, res) => {
  try {
    const { user, token } = await authService.signup(req.body);
    sendSuccessResponse(res, HTTP_STATUS_CODES.CREATED, 'User registered successfully', { user, token });
  } catch (error) {
    console.error('Signup error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.BAD_REQUEST, error.message || 'Internal server error during signup');
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.signin(email, password);
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Signed in successfully', { user, token });
  } catch (error) {
    console.error('Signin error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.UNAUTHORIZED, error.message || 'Internal server error during signin');
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Users fetched successfully', users);
  } catch (error) {
    console.error('Get all users error:', error);
    sendErrorResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, 'Internal server error while fetching users');
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.resetPassword(email);
    sendSuccessResponse(res, HTTP_STATUS_CODES.OK, 'Password reset email sent (if user exists)', null);
  } catch (error) {
    console.error('Reset password error:', error);
    sendErrorResponse(res, error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message || 'Internal server error during password reset');
  }
};
