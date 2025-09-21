import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * User Schema for MongoDB
 */
const userSchema = new mongoose.Schema({
  partyCode: {
    type: Number,
    required: function() { return this.role === 'Distributor'; },
    unique: function() { return this.role === 'Distributor'; },
    sparse: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  mobile: {
    type: String,
    required: function() { return this.role === 'Distributor'; },
    trim: true,
    maxlength: [20, 'Mobile number cannot exceed 20 characters'],
    sparse: true
  },
  route: {
    type: String,
    required: function() { return this.role === 'Distributor'; },
    trim: true,
    maxlength: [100, 'Route cannot exceed 100 characters'],
    sparse: true
  },
  openingBalance: {
    type: Number,
    required: function() { return this.role === 'Distributor'; },
    default: 0
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['Admin', 'Distributor', 'Sub-Admin'],
    default: 'Sub-Admin'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

/**
 * Hash password before saving
 */
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare entered password with hashed password
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate JWT token
 * @returns {string} JWT token
 */
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET || 'fallback_secret',
    {
      expiresIn: '7d'
    }
  );
  return token;
};

/**
 * Get user object without sensitive information
 * @returns {Object} User object without password
 */
userSchema.methods.toSafeObject = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
