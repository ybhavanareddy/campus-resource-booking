const Booking = require('../models/Booking');

/**
 * GET /api/analytics/usage
 * Returns booking count per resource
 */
exports.getUsageAnalytics = async (req, res, next) => {
  try {
    const usage = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      {
        $group: {
          _id: '$resource',
          totalBookings: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'resources',
          localField: '_id',
          foreignField: '_id',
          as: 'resource'
        }
      },
      { $unwind: '$resource' },
      {
        $project: {
          _id: 0,
          resourceName: '$resource.name',
          totalBookings: 1
        }
      }
    ]);

    res.json(usage);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/analytics/top-rooms
 * Returns top 5 most booked resources
 */
exports.getTopResources = async (req, res, next) => {
  try {
    const topResources = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      {
        $group: {
          _id: '$resource',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'resources',
          localField: '_id',
          foreignField: '_id',
          as: 'resource'
        }
      },
      { $unwind: '$resource' },
      {
        $project: {
          _id: 0,
          name: '$resource.name',
          type: '$resource.type',
          totalBookings: '$count'
        }
      }
    ]);

    res.json(topResources);
  } catch (err) {
    next(err);
  }
};
