const CampusUpdate = require('../models/CampusUpdate');

// @route   GET /api/updates
// @desc    Get all official campus updates & notices
// @access  Public
const getAllUpdates = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const updates = await CampusUpdate.find(query)
      .populate('createdBy', 'name role email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: updates.length,
      data: updates,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching campus updates',
    });
  }
};

// @route   GET /api/updates/:id
// @desc    Get single campus update
// @access  Public
const getUpdateById = async (req, res) => {
  try {
    const update = await CampusUpdate.findById(req.params.id).populate(
      'createdBy',
      'name role email'
    );

    if (!update) {
      return res.status(404).json({
        status: 'error',
        message: 'Campus update not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: update,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching update details',
    });
  }
};

// @route   POST /api/admin/updates
// @desc    Create official notice/event (Admin only)
// @access  Private/Admin
const createUpdate = async (req, res) => {
  try {
    const { title, description, category, date, image, attachment } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, description, and category are required',
      });
    }

    const update = await CampusUpdate.create({
      title,
      description,
      category,
      date: date || new Date().toISOString().split('T')[0],
      image: image || '',
      attachment: attachment || '',
      createdBy: req.user._id,
    });

    const populated = await CampusUpdate.findById(update._id).populate(
      'createdBy',
      'name role email'
    );

    res.status(201).json({
      status: 'success',
      message: 'Official update published successfully',
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error publishing update',
    });
  }
};

// @route   PUT /api/admin/updates/:id
// @desc    Update notice/event (Admin only)
// @access  Private/Admin
const editUpdate = async (req, res) => {
  try {
    const update = await CampusUpdate.findById(req.params.id);
    if (!update) {
      return res.status(404).json({
        status: 'error',
        message: 'Campus update not found',
      });
    }

    const { title, description, category, date, image, attachment } = req.body;

    if (title) update.title = title;
    if (description) update.description = description;
    if (category) update.category = category;
    if (date) update.date = date;
    if (image !== undefined) update.image = image;
    if (attachment !== undefined) update.attachment = attachment;

    const saved = await update.save();
    const populated = await CampusUpdate.findById(saved._id).populate(
      'createdBy',
      'name role email'
    );

    res.status(200).json({
      status: 'success',
      message: 'Notice updated successfully',
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error updating notice',
    });
  }
};

// @route   DELETE /api/admin/updates/:id
// @desc    Delete notice/event (Admin only)
// @access  Private/Admin
const deleteUpdate = async (req, res) => {
  try {
    const update = await CampusUpdate.findById(req.params.id);
    if (!update) {
      return res.status(404).json({
        status: 'error',
        message: 'Campus update not found',
      });
    }

    await update.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Official update deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error deleting update',
    });
  }
};

module.exports = {
  getAllUpdates,
  getUpdateById,
  createUpdate,
  editUpdate,
  deleteUpdate,
};
