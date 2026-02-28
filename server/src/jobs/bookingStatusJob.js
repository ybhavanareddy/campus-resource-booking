const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

/* =========================
   AUDIT HELPER (SYSTEM)
========================= */
const addAudit = async (booking, message) => {
  booking.auditTrail.push({
    action: 'COMPLETED',
    by: null, // system
    message,
  });
  await booking.save();
};

/* =========================
   PROMOTE WAITLIST
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
  await next.save();

  next.auditTrail.push({
    action: 'APPROVED',
    by: null,
    message: 'Auto-approved from waitlist after completion',
  });
  await next.save();
};

/* =========================
   AUTO-COMPLETE JOB
========================= */
const markCompletedBookings = async () => {
  try {
    const now = new Date();

    const bookingsToComplete = await Booking.find({
      status: 'APPROVED',
      endTime: { $lt: now },
    });

    for (const booking of bookingsToComplete) {
      booking.status = 'COMPLETED';
      await booking.save();

      // ✅ AUDIT
      await addAudit(
        booking,
        'Booking automatically completed after end time'
      );

      // ✅ Promote waitlist if any
      await promoteWaitlistedBookings(
        booking.resource,
        booking.startTime,
        booking.endTime
      );
    }

    if (bookingsToComplete.length > 0) {
      console.log(
        `✅ Auto-completed ${bookingsToComplete.length} bookings`
      );
    }
  } catch (error) {
    console.error(
      '❌ Failed to auto-complete bookings:',
      error.message
    );
  }
};

module.exports = markCompletedBookings;
