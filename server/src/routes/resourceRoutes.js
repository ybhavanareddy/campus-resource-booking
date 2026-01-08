const express = require('express');
const router = express.Router();

const {
  getAllResources,
  getResourceById,
  searchResources,
  filterResources,
  sortResources,
  deleteResource,
  createResource,
  updateResource,
} = require('../controllers/resourceController');

const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// CREATE
router.post(
  '/',
  protect,
  adminOnly,
  upload.array('images', 5),
  createResource
);

// READ
router.get('/', getAllResources);
router.get('/search', searchResources);
router.get('/filter', filterResources);
router.get('/sort', sortResources);
router.get('/:id', getResourceById);

// UPDATE
router.put(
  '/:id',
  protect,
  adminOnly,
  upload.array('images', 5),
  updateResource
);

// DELETE
router.delete('/:id', protect, adminOnly, deleteResource);

module.exports = router;
