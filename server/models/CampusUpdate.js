const mongoose = require('mongoose');

const campusUpdateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Update title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Update description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Update category is required'],
      enum: ['Notices', 'Events', 'Workshops', 'Hackathons', 'Clubs', 'Academics', 'Deadlines'],
      default: 'Notices',
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    image: {
      type: String,
      default: '',
    },
    attachment: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CampusUpdate', campusUpdateSchema);
