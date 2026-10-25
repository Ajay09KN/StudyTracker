const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

// @desc    Update profile info (name, email, timezone, avatar color)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, email, timezone, avatarColor } = req.body;

  if (email && email.toLowerCase() !== user.email) {
    const taken = await User.findOne({ email: email.toLowerCase() });
    if (taken) {
      res.status(400);
      throw new Error('That email is already in use');
    }
    user.email = email.toLowerCase();
  }

  if (name) user.name = name;
  if (timezone) user.timezone = timezone;
  if (avatarColor) user.avatarColor = avatarColor;

  await user.save();
  res.json({ success: true, user: user.toSafeObject() });
});

// @desc    Update study preferences (daily target, pomodoro settings)
// @route   PUT /api/users/preferences
// @access  Private
const updatePreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { dailyTargetMinutes, pomodoroSettings } = req.body;

  if (dailyTargetMinutes !== undefined) user.dailyTargetMinutes = dailyTargetMinutes;
  if (pomodoroSettings) {
    user.pomodoroSettings = { ...user.pomodoroSettings.toObject(), ...pomodoroSettings };
  }

  await user.save();
  res.json({ success: true, user: user.toSafeObject() });
});

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated successfully' });
});

module.exports = { updateProfile, updatePreferences, changePassword };
