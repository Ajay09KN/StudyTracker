const mongoose = require('mongoose');

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const StudySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: 80,
    },
    topic: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    startTime: {
      type: String,
      match: [TIME_REGEX, 'startTime must be in HH:MM format'],
      default: null,
    },
    endTime: {
      type: String,
      match: [TIME_REGEX, 'endTime must be in HH:MM format'],
      default: null,
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [1440, 'Duration cannot exceed 24 hours'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    source: {
      type: String,
      enum: ['manual', 'pomodoro'],
      default: 'manual',
    },
  },
  { timestamps: true }
);

// Normalize date to midnight UTC so day-based aggregation is consistent
StudySessionSchema.pre('validate', function normalizeAndComputeDuration(next) {
  if (this.date) {
    const d = new Date(this.date);
    d.setUTCHours(0, 0, 0, 0);
    this.date = d;
  }

  if (this.startTime && this.endTime) {
    const [sh, sm] = this.startTime.split(':').map(Number);
    const [eh, em] = this.endTime.split(':').map(Number);
    let minutes = eh * 60 + em - (sh * 60 + sm);
    if (minutes <= 0) minutes += 24 * 60; // overnight session
    this.durationMinutes = minutes;
  }

  next();
});

StudySessionSchema.index({ user: 1, date: -1 });
StudySessionSchema.index({ user: 1, subject: 1 });

module.exports = mongoose.model('StudySession', StudySessionSchema);
