const LostFound = require('../models/LostFound');

// @route   GET /api/lost-found
// @desc    Get all lost and found listings with filters
// @access  Public
const getAllLostFound = async (req, res) => {
  try {
    const { search, type, category, status } = req.query;
    let query = {};

    if (type && type !== 'All') {
      query.type = type;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await LostFound.find(query)
      .populate('postedBy', 'name email branch year profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching lost & found items',
    });
  }
};

// @route   POST /api/lost-found
// @desc    Create a new lost or found listing
// @access  Private
const createLostFound = async (req, res) => {
  try {
    const { title, description, type, category, location, date, image, contact } = req.body;

    if (!title || !description || !type || !location || !contact) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide Title, Description, Type (Lost/Found), Location, and Contact info',
      });
    }

    const item = await LostFound.create({
      title,
      description,
      type,
      category: category || 'Other',
      location,
      date: date || new Date().toISOString().split('T')[0],
      image: image || '',
      contact,
      postedBy: req.user._id,
      status: 'Active',
    });

    const populated = await LostFound.findById(item._id).populate(
      'postedBy',
      'name email branch year profileImage'
    );

    res.status(201).json({
      status: 'success',
      message: `${type} item listed successfully`,
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error creating listing',
    });
  }
};

// @route   GET /api/lost-found/:id
// @desc    Get single listing details
// @access  Public
const getLostFoundById = async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id).populate(
      'postedBy',
      'name email branch year profileImage'
    );

    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Listing not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching item details',
    });
  }
};

// @route   PUT /api/lost-found/:id
// @desc    Update listing (e.g., mark as Resolved)
// @access  Private
const updateLostFound = async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Listing not found',
      });
    }

    // Must be owner or admin
    if (
      item.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized: You can only edit your own listings',
      });
    }

    const { status, title, description, category, location, contact, image } = req.body;

    if (status) item.status = status;
    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (location) item.location = location;
    if (contact) item.contact = contact;
    if (image !== undefined) item.image = image;

    const updated = await item.save();
    const populated = await LostFound.findById(updated._id).populate(
      'postedBy',
      'name email branch year profileImage'
    );

    res.status(200).json({
      status: 'success',
      message: 'Listing updated successfully',
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error updating listing',
    });
  }
};

// @route   DELETE /api/lost-found/:id
// @desc    Delete a listing
// @access  Private
const deleteLostFound = async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Listing not found',
      });
    }

    // Must be owner or admin
    if (
      item.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized: You can only delete your own listings',
      });
    }

    await item.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error deleting listing',
    });
  }
};

module.exports = {
  getAllLostFound,
  createLostFound,
  getLostFoundById,
  updateLostFound,
  deleteLostFound,
};
