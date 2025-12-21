const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

/**
 * POST /api/resources/book
 */
exports.bookResource = async (req, res, next) => {
  try {
    const { resourceId, startTime, endTime, purpose } = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    const booking = await Booking.create({
      user: req.user._id,
      resource: resourceId,
      startTime,
      endTime,
      purpose
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/resources/:id/cancel
 */
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // 🔐 SECURITY CHECK (ADD THIS)
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    next(err);
  }
};


/**
 * PUT /api/resources/:id/update
 */
exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // 🔐 SECURITY CHECK (ADD THIS)
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    booking.startTime = req.body.startTime || booking.startTime;
    booking.endTime = req.body.endTime || booking.endTime;

    await booking.save();
    res.json(booking);
  } catch (err) {
    next(err);
  }
};


/**
 * GET /api/users/:id/bookings
 */
exports.getUserBookings = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bookings = await Booking.find({ user: req.params.id })
      .populate('resource');

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

