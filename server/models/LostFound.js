const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Item title/name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide item description'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Type is required (Lost or Found)'],
      enum: ['Lost', 'Found'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Electronics', 'Documents', 'Books', 'Accessories', 'Clothing', 'Other'],
      default: 'Other',
    },
    location: {
      type: String,
      required: [true, 'Campus location is required'],
      trim: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    image: {
      type: String,
      default: '',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contact: {
      type: String,
      required: [true, 'Contact details (phone or email) are required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LostFound', lostFoundSchema);
