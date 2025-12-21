// server/src/models/Resource.js
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., "room", "lab", "sports"
  capacity: { type: Number, default: 1 },
  images: [{ type: String }], // urls
  status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
  location: { type: String },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
