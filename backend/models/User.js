const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatarColor: {
      type: String,
      default: '#2F6F5E',
    },
    dailyTargetMinutes: {
      type: Number,
      default: 120,
      min: 0,
    },
    pomodoroSettings: {
      workMinutes: { type: Number, default: 25 },
      shortBreakMinutes: { type: Number, default: 5 },
      longBreakMinutes: { type: Number, default: 15 },
      sessionsBeforeLongBreak: { type: Number, default: 4 },
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatarColor: this.avatarColor,
    dailyTargetMinutes: this.dailyTargetMinutes,
    pomodoroSettings: this.pomodoroSettings,
    timezone: this.timezone,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', UserSchema);
