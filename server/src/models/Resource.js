const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema(
  {
    bookingType: {
  type: String,
  enum: ['SLOT', 'HOSTEL'],
  default: 'SLOT',
},


    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ['room', 'lab', 'sports'],
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    images: [{ type: String }],

    // Admin-level control (not booking-based)
    status: {
      type: String,
      enum: ['available', 'unavailable'],
      default: 'available',
    },

    location: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', ResourceSchema);
