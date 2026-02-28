const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

/* =========================
   AUDIT HELPER
========================= */
const addAudit = async (booking, action, userId = null, message = '') => {
  booking.auditTrail.push({ action, by: userId, message });
  await booking.save(); // ✅ always persist audit
};

/* =========================
   CREATE BOOKING
========================= */
exports.bookResource = async (req, res, next) => {
  try {
    const { resourceId, startTime, endTime, purpose } = req.body;

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({
        message: 'End time must be after start time',
      });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const overlappingCount = await Booking.countDocuments({
      resource: resourceId,
      status: { $in: ['PENDING', 'APPROVED'] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    const finalStatus =
      overlappingCount >= resource.capacity ? 'WAITLISTED' : 'PENDING';

    const booking = await Booking.create({
      user: req.user._id,
      resource: resourceId,
      startTime,
      endTime,
      purpose,
      status: finalStatus,
    });

    // ✅ AUDIT (CREATED)
    await addAudit(
      booking,
      'CREATED',
      req.user._id,
      finalStatus === 'WAITLISTED'
        ? 'Booking created and added to waitlist'
        : 'Booking request created'
    );

    res.status(201).json({
      booking,
      message:
        finalStatus === 'WAITLISTED'
          ? 'Capacity full. Added to waitlist.'
          : 'Booking request created.',
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   CANCEL BOOKING (USER)
========================= */
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: 'Booking not found' });

    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not allowed' });

    if (booking.status === 'COMPLETED')
      return res.status(400).json({
        message: 'Completed bookings cannot be cancelled',
      });

    booking.status = 'CANCELLED';
    await booking.save(); // ✅ IMPORTANT (status must be saved first)

    // ✅ AUDIT
    await addAudit(
      booking,
      'CANCELLED',
      req.user._id,
      'Booking cancelled by user'
    );

    await promoteWaitlistedBookings(
      booking.resource,
      booking.startTime,
      booking.endTime
    );

    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    next(err);
  }
};

/* =========================
   UPDATE BOOKING (USER)
========================= */
exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: 'Booking not found' });

    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not allowed' });

    if (booking.status !== 'PENDING')
      return res.status(400).json({
        message: 'Only pending bookings can be modified',
      });

    booking.startTime = req.body.startTime || booking.startTime;
    booking.endTime = req.body.endTime || booking.endTime;
    await booking.save();

    // ✅ AUDIT
    await addAudit(
      booking,
      'UPDATED',
      req.user._id,
      'Booking time updated'
    );

    res.json(booking);
  } catch (err) {
    next(err);
  }
};

/* =========================
   USER BOOKINGS
========================= */
exports.getUserBookings = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id)
      return res.status(403).json({ message: 'Access denied' });

    const bookings = await Booking.find({ user: req.params.id })
      .populate('resource')
      .populate('auditTrail.by', 'name role')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

/* =========================
   ADMIN: APPROVE BOOKING
========================= */
exports.approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('resource');
    if (!booking)
      return res.status(404).json({ message: 'Booking not found' });

    if (!['PENDING', 'WAITLISTED'].includes(booking.status))
      return res.status(400).json({
        message: 'Only pending or waitlisted bookings can be approved',
      });

    const approvedCount = await Booking.countDocuments({
      resource: booking.resource._id,
      status: 'APPROVED',
      startTime: { $lt: booking.endTime },
      endTime: { $gt: booking.startTime },
    });

    if (approvedCount >= booking.resource.capacity) {
      return res.status(409).json({
        message: 'Capacity already full for this time range',
      });
    }

    booking.status = 'APPROVED';
    booking.approvedBy = req.user._id;
    await booking.save(); // ✅ save status first

    // ✅ AUDIT
    await addAudit(
      booking,
      'APPROVED',
      req.user._id,
      'Booking approved by admin'
    );

    res.json({ message: 'Booking approved', booking });
  } catch (err) {
    next(err);
  }
};

/* =========================
   ADMIN: REJECT BOOKING
========================= */
exports.rejectBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'REJECTED';
    booking.rejectionReason = reason;
    booking.approvedBy = req.user._id;
    await booking.save(); // ✅ save first

    // ✅ AUDIT
    await addAudit(
      booking,
      'REJECTED',
      req.user._id,
      reason || 'Rejected by admin'
    );

    await promoteWaitlistedBookings(
      booking.resource,
      booking.startTime,
      booking.endTime
    );

    res.json({ message: 'Booking rejected', booking });
  } catch (err) {
    next(err);
  }
};

/* =========================
   ADMIN: FETCH BOOKINGS
========================= */
exports.getAdminBookings = async (req, res, next) => {
  try {
    const statuses = req.query.status?.split(',') || ['PENDING'];

    const bookings = await Booking.find({
      status: { $in: statuses },
    })
      .populate('user', 'name email role')
      .populate('resource', 'name capacity bookingType')
      .populate('auditTrail.by', 'name role') // ✅ REQUIRED
      .sort({ createdAt: 1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};


/* =========================
   AVAILABILITY API
========================= */
exports.getAvailability = async (req, res, next) => {
  try {
    const { resourceId, startTime, endTime } = req.query;

    const resource = await Resource.findById(resourceId);
    if (!resource)
      return res.status(404).json({ message: 'Resource not found' });

    const used = await Booking.countDocuments({
      resource: resourceId,
      status: { $in: ['PENDING', 'APPROVED'] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    res.json({
      capacity: resource.capacity,
      used,
      remaining: Math.max(resource.capacity - used, 0),
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   INTERNAL: PROMOTE WAITLIST
========================= */
const promoteWaitlistedBookings = async (
  resourceId,
  startTime,
  endTime
) => {
  const resource = await Resource.findById(resourceId);
  if (!resource) return;

  const approvedCount = await Booking.countDocuments({
    resource: resourceId,
    status: 'APPROVED',
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  if (approvedCount >= resource.capacity) return;

  const next = await Booking.findOne({
    resource: resourceId,
    status: 'WAITLISTED',
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  }).sort({ createdAt: 1 });

  if (!next) return;

  next.status = 'APPROVED';
  await next.save(); // ✅ REQUIRED

  await addAudit(
    next,
    'APPROVED',
    null,
    'Auto-approved from waitlist'
  );
};

/* =========================
   GET SINGLE BOOKING (ADMIN / USER)
========================= */
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('resource', 'name capacity bookingType')
      .populate('auditTrail.by', 'name role');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
};
