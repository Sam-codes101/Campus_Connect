const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @route   POST /api/auth/register
// @desc    Register a new student
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, branch, year, section } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and password are required',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'A student with this college email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      branch: branch || 'CSE',
      year: year || '3rd Year',
      section: section || 'A',
      role: 'student',
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful! Welcome to Campus Connect.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        year: user.year,
        section: user.section,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        interests: user.interests,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error during registration',
    });
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both email and password',
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        year: user.year,
        section: user.section,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        interests: user.interests,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error during login',
    });
  }
};

// @route   GET /api/auth/me
// @desc    Get currently logged in user profile
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to retrieve profile',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
