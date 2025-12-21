const express = require('express');
const router = express.Router();
const {
  getAllResources,
  getResourceById,
  searchResources,
  filterResources,
  sortResources,
  deleteResource,
  createResource   // 👈 ADD THIS
} = require('../controllers/resourceController');

const { protect, adminOnly } = require('../middlewares/authMiddleware');

// CREATE resource (Admin)
router.post('/', protect, adminOnly, createResource);


router.get('/', getAllResources);
router.get('/search', searchResources);
router.get('/filter', filterResources);
router.get('/sort', sortResources);
router.get('/:id', getResourceById);
router.delete('/:id', protect, adminOnly, deleteResource);

module.exports = router;
