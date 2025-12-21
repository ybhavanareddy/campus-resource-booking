const Resource = require('../models/Resource');


/**
 * POST /api/resources (Admin)
 */
exports.createResource = async (req, res, next) => {
  try {
    const { name, type, status } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    const resource = await Resource.create({
      name,
      type,
      status: status || 'available',
    });

    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
};


/**
 * GET /api/resources
 */
exports.getAllResources = async (req, res, next) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/resources/:id
 */
exports.getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/resources/search?query=
 */
exports.searchResources = async (req, res, next) => {
  try {
    const { query } = req.query;
    const resources = await Resource.find({
      name: { $regex: query, $options: 'i' }
    });
    res.json(resources);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/resources/filter?type=&status=
 */
exports.filterResources = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;

    const resources = await Resource.find(filter);
    res.json(resources);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/resources/sort?by=date
 */
exports.sortResources = async (req, res, next) => {
  try {
    const sortField = req.query.by === 'date' ? 'createdAt' : 'name';
    const resources = await Resource.find().sort({ [sortField]: 1 });
    res.json(resources);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/resources/:id (Admin)
 */
exports.deleteResource = async (req, res, next) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (err) {
    next(err);
  }
};
