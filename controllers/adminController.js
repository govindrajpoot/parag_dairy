import User from '../models/userModel.js';

/**
 * @desc    Get all admins
 * @route   GET /api/admins
 * @access  Private (Admin only)
 */
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.findAll();

    // Filter admins and remove password from response
    const adminUsers = admins
      .filter(user => user.role === 'Admin')
      .map(admin => admin.toSafeObject())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Admins retrieved successfully',
      data: {
        admins: adminUsers,
        count: adminUsers.length
      }
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while retrieving admins',
      data: null
    });
  }
};

/**
 * @desc    Delete admin by ID
 * @route   DELETE /api/admins/:id
 * @access  Private (Admin only)
 */
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findOneAndDelete({ _id: req.params.id, role: 'Admin' });

    if (!admin) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Admin not found',
        data: null
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Admin deleted successfully',
      data: null
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error while deleting admin',
      data: null
    });
  }
};
