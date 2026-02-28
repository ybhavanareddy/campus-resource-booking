// server/src/index.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 🔁 Background job (ONLY ONE)
const markCompletedBookings = require('./jobs/bookingStatusJob');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// =========================
// MIDDLEWARES
// =========================
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// =========================
// ROUTES
// =========================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// =========================
// HEALTH CHECK
// =========================
app.get('/', (req, res) => {
  res.send('Campus Booking API is running');
});

// =========================
// GLOBAL ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Server Error' });
});

// =========================
// SYSTEM JOBS
// =========================

// Runs every 5 minutes
setInterval(async () => {
  try {
    await markCompletedBookings();
    console.log('✅ Booking auto-complete job executed');
  } catch (err) {
    console.error('❌ Booking auto-complete job failed:', err.message);
  }
}, 5 * 60 * 1000);

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
