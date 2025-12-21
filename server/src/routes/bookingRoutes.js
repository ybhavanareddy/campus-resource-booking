const express = require('express');
const router = express.Router();
const {
  bookResource,
  cancelBooking,
  updateBooking,
  getUserBookings
} = require('../controllers/bookingController');

const { protect } = require('../middlewares/authMiddleware');

router.post('/book', protect, bookResource);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/update', protect, updateBooking);
router.get('/user/:id', protect, getUserBookings);

module.exports = router;
