const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    // ✅ CURRENT STATE OF BOOKING
    status: {
      type: String,
      enum: [
        'PENDING',
        'APPROVED',
        'WAITLISTED',
        'REJECTED',
        'CANCELLED',
        'COMPLETED',
      ],
      default: 'PENDING',
    },

    purpose: String,

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    // ✅ HISTORY / AUDIT LOG
    auditTrail: [
  {
    action: {
      type: String,
      enum: [
        'CREATED',
        'APPROVED',
        'REJECTED',
        'CANCELLED',
        'COMPLETED',
        'UPDATED',
        'WAITLISTED',
      ],
      required: true,
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // system
    },
    message: String,
    at: { type: Date, default: Date.now },
  },
],

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', BookingSchema);
