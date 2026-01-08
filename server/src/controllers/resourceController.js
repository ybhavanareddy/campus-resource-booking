const Resource = require('../models/Resource');
const cloudinary = require('../config/cloudinary');


/**
 * POST /api/resources (Admin)
 */
exports.createResource = async (req, res, next) => {
  try {
    const { name, type, capacity, status, location, description } = req.body;

    if (!name || !type || !capacity) {
      return res.status(400).json({
        message: 'Name, type and capacity are required',
      });
    }

    let imageUrls = [];

    // 🔥 Upload images to Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          {
            folder: 'campus-resources',
          }
        );

        imageUrls.push(result.secure_url);
      }
    }

    const resource = await Resource.create({
      name,
      type: type.toLowerCase(),
      capacity: Number(capacity),
      status: status || 'available',
      location,
      description,
      images: imageUrls, // ✅ URLs saved here
    });

    res.status(201).json(resource);
  } catch (err) {
    console.error('CREATE RESOURCE ERROR:', err);
    next(err);
  }
};



exports.updateResource = async (req, res, next) => {
  try {
    const { name, type, capacity, status } = req.body;

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.name = name ?? resource.name;
    resource.type = type ?? resource.type;
    resource.capacity = capacity ?? resource.capacity;
    resource.status = status ?? resource.status;

    // 🔥 If new images uploaded, append them
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          { folder: 'campus-resources' }
        );
        uploadedImages.push(result.secure_url);
      }

      resource.images.push(...uploadedImages);
    }

    await resource.save();
    res.json(resource);
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
