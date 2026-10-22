const User = require('../models/User');

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching user profile',
    });
  }
};

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const { name, branch, year, section, bio, interests, profileImage } = req.body;

    if (name) user.name = name;
    if (branch) user.branch = branch;
    if (year) user.year = year;
    if (section) user.section = section;
    if (bio !== undefined) user.bio = bio;
    if (interests) {
      user.interests = Array.isArray(interests) 
        ? interests 
        : interests.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (profileImage) user.profileImage = profileImage;

    const updatedUser = await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        branch: updatedUser.branch,
        year: updatedUser.year,
        section: updatedUser.section,
        bio: updatedUser.bio,
        interests: updatedUser.interests,
        profileImage: updatedUser.profileImage,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error updating profile',
    });
  }
};

module.exports = {
  getUserById,
  updateUserProfile,
};
