import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const userId = await User.create(req.body);
    const user = await User.findById(userId);
    const token = user.generateAuthToken();
    res.status(201).json({
      status: 201,
      success: true,
      message: 'User registered successfully',
      data: { user: user.toSafeObject(), token }
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
      data: null
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Invalid email or password',
        data: null
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Invalid email or password',
        data: null
      });
    }
    const token = user.generateAuthToken();
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Signed in successfully',
      data: { user: user.toSafeObject(), token }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
      data: null
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Users fetched successfully',
      data: users.map(user => user.toSafeObject())
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
      data: null
    });
  }
};

export const resetPassword = async (req, res) => {
  // Implement reset password logic as per your requirements
  res.status(501).json({
    status: 501,
    success: false,
    message: 'Reset password not implemented',
    data: null
  });
};
