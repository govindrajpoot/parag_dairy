import User from '../models/User.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Private (Admin/Distributor can create users)
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation removed as per user request

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'User with this email already exists',
        data: null
      });
    }

    // Validate role
    const validRoles = ['Admin', 'Distributor', 'Sub-Admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid role. Must be Admin, Distributor, or Sub-Admin',
        data: null
      });
    }

    // Create new user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      createdBy: req.user ? req.user._id : null
    };

    // Include Distributor-specific fields if role is Distributor
    if (role === 'Distributor') {
      const { partyCode, mobile, route, openingBalance } = req.body;
      userData.partyCode = partyCode;
      userData.mobile = mobile;
      userData.route = route;
      userData.openingBalance = openingBalance;
    }

    const user = new User(userData);

    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    // Return user data without password
    const safeUser = user.toSafeObject();

    res.status(201).json({
      status: 201,
      success: true,
      message: 'User created successfully',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (error) {
    console.error('Signup error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation error',
        data: { errors: messages }
      });
    }

    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error during signup',
      data: null
    });
  }
};

/**
 * @desc    Authenticate user and get token
 * @route   POST /api/auth/signin
 * @access  Public
 */
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Email and password are required',
        data: null
      });
    }

    // Check if user exists and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Invalid credentials',
        data: null
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Account is deactivated',
        data: null
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Invalid credentials',
        data: null
      });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    // Return user data without password
    const userData = user.toSafeObject();

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error during signin',
      data: null
    });
  }
};

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private (Admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        count: users.length
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while retrieving users',
      data: null
    });
  }
};

/**
 * @desc    Reset user password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Email and new password are required',
        data: null
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'User not found',
        data: null
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Password reset successful',
      data: null
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error during password reset',
      data: null
    });
  }
};
