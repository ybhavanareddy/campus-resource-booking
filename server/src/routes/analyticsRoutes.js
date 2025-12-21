const express = require('express');
const router = express.Router();
const {
  getUsageAnalytics,
  getTopResources
} = require('../controllers/analyticsController');

const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Admin-only analytics
router.get('/usage', protect, adminOnly, getUsageAnalytics);
router.get('/top-rooms', protect, adminOnly, getTopResources);

module.exports = router;
