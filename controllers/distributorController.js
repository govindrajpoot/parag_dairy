import User from '../models/userModel.js';

/**
 * @desc    Get all distributors
 * @route   GET /api/distributors
 * @access  Private (Admin only)
 */
export const getDistributors = async (req, res) => {
  try {
    const distributors = await User.findDistributors();

    // Remove password from response
    const safeDistributors = distributors.map(distributor => distributor.toSafeObject());

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Distributors retrieved successfully',
      data: {
        distributors: safeDistributors,
        count: safeDistributors.length
      }
    });
  } catch (error) {
    console.error('Get distributors error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while retrieving distributors',
      data: null
    });
  }
};

/**
 * @desc    Get distributor by ID
 * @route   GET /api/distributors/:id
 * @access  Private (Admin only)
 */
export const getDistributorById = async (req, res) => {
  try {
    const distributor = await User.findOne({ _id: req.params.id, role: 'Distributor' }).select('-password');

    if (!distributor) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Distributor not found',
        data: null
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Distributor retrieved successfully',
      data: distributor
    });
  } catch (error) {
    console.error('Get distributor by ID error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while retrieving distributor',
      data: null
    });
  }
};

/**
 * @desc    Update distributor by ID
 * @route   PUT /api/distributors/:id
 * @access  Private (Admin only)
 */
export const updateDistributor = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Prevent role change or password update here (password update via reset-password)
    delete updateData.role;
    delete updateData.password;

    const distributor = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'Distributor' },
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!distributor) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Distributor not found',
        data: null
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Distributor updated successfully',
      data: distributor
    });
  } catch (error) {
    console.error('Update distributor error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while updating distributor',
      data: null
    });
  }
};

/**
 * @desc    Delete distributor by ID
 * @route   DELETE /api/distributors/:id
 * @access  Private (Admin only)
 */
export const deleteDistributor = async (req, res) => {
  try {
    const distributor = await User.findOneAndDelete({ _id: req.params.id, role: 'Distributor' });

    if (!distributor) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Distributor not found',
        data: null
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Distributor deleted successfully',
      data: null
    });
  } catch (error) {
    console.error('Delete distributor error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while deleting distributor',
      data: null
    });
  }
};
