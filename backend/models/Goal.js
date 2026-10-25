const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      // 1-12, only set when type === 'monthly'
      type: Number,
      min: 1,
      max: 12,
      default: null,
    },
    targetHours: {
      type: Number,
      required: [true, 'Target hours is required'],
      min: [0.5, 'Target must be at least 0.5 hours'],
    },
  },
  { timestamps: true }
);

GoalSchema.index({ user: 1, type: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Goal', GoalSchema);
