const express = require('express');
const router = express.Router();

const {
  bookResource,
  cancelBooking,
  updateBooking,
  getUserBookings,
  approveBooking,
  rejectBooking,
  getAvailability,
  getAdminBookings,
  getBookingById,
} = require('../controllers/bookingController');

const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/', protect, bookResource);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/update', protect, updateBooking);
router.get('/user/:id', protect, getUserBookings);
router.get('/availability', protect, getAvailability);

router.patch('/:id/approve', protect, adminOnly, approveBooking);
router.patch('/:id/reject', protect, adminOnly, rejectBooking);
router.get('/', protect, adminOnly, getAdminBookings);
router.get('/:id', protect, adminOnly, getBookingById);

module.exports = router;
