const Resource = require('../models/Resource');

// @route   GET /api/resources
// @desc    Get all resources with search & filters
// @access  Public
const getAllResources = async (req, res) => {
  try {
    const { search, branch, semester, type } = req.query;
    let query = {};

    if (branch && branch !== 'All') {
      query.branch = branch;
    }
    if (semester && semester !== 'All') {
      query.semester = semester;
    }
    if (type && type !== 'All') {
      query.type = type;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $trim: true, $options: 'i' } },
        { subject: { $regex: search, $trim: true, $options: 'i' } },
        { description: { $regex: search, $trim: true, $options: 'i' } },
      ];
    }

    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name email branch year')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching resources',
    });
  }
};

// @route   POST /api/resources
// @desc    Upload academic resource
// @access  Private
const createResource = async (req, res) => {
  try {
    const { title, description, subject, branch, semester, type, fileUrl } = req.body;

    if (!title || !subject || !fileUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, Subject, and Document Link/File are required',
      });
    }

    const resource = await Resource.create({
      title,
      description,
      subject,
      branch: branch || 'CSE',
      semester: semester || 'Semester 5',
      type: type || 'Notes',
      fileUrl,
      uploadedBy: req.user._id,
    });

    const populated = await Resource.findById(resource._id).populate(
      'uploadedBy',
      'name email branch year'
    );

    res.status(201).json({
      status: 'success',
      message: 'Resource uploaded successfully',
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error uploading resource',
    });
  }
};

// @route   GET /api/resources/:id
// @desc    Get resource details
// @access  Public
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate(
      'uploadedBy',
      'name email branch year'
    );
    if (!resource) {
      return res.status(404).json({
        status: 'error',
        message: 'Resource not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: resource,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error retrieving resource',
    });
  }
};

// @route   DELETE /api/resources/:id
// @desc    Delete a resource (owner or admin)
// @access  Private
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        status: 'error',
        message: 'Resource not found',
      });
    }

    // Check ownership or admin
    if (
      resource.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized: You can only delete your own resources',
      });
    }

    await resource.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Resource removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error deleting resource',
    });
  }
};

module.exports = {
  getAllResources,
  createResource,
  getResourceById,
  deleteResource,
};
