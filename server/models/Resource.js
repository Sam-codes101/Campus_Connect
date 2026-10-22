const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      default: 'CSE',
      trim: true,
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'],
      default: 'Semester 5',
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Resource type is required'],
      enum: ['Notes', 'PYQs', 'Lab Files', 'Assignments', 'Study Material'],
      default: 'Notes',
    },
    fileUrl: {
      type: String,
      required: [true, 'Resource file or document link is required'],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resource', resourceSchema);
