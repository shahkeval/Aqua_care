const mongoose = require('mongoose');

const amcPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Plan description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    durationMonths: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 month'],
    },
    serviceFrequencyDays: {
      type: Number,
      required: [true, 'Service frequency is required'],
      default: 90, // default 3 months
    },
    features: {
      type: [String],
      default: [],
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const AMCPlan = mongoose.model('AMCPlan', amcPlanSchema);

module.exports = AMCPlan;
