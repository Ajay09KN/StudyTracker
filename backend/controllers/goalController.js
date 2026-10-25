const asyncHandler = require('../middleware/asyncHandler');
const Goal = require('../models/Goal');
const StudySession = require('../models/StudySession');

const minutesForGoal = async (userId, goal) => {
  let start;
  let end;
  if (goal.type === 'monthly') {
    start = new Date(Date.UTC(goal.year, goal.month - 1, 1));
    end = new Date(Date.UTC(goal.year, goal.month, 1));
  } else {
    start = new Date(Date.UTC(goal.year, 0, 1));
    end = new Date(Date.UTC(goal.year + 1, 0, 1));
  }

  const result = await StudySession.aggregate([
    { $match: { user: userId, date: { $gte: start, $lt: end } } },
    { $group: { _id: null, minutes: { $sum: '$durationMinutes' } } },
  ]);
  return result[0]?.minutes || 0;
};

const withProgress = async (userId, goal) => {
  const minutes = await minutesForGoal(userId, goal);
  const targetMinutes = goal.targetHours * 60;
  return {
    ...goal.toObject(),
    studiedMinutes: minutes,
    targetMinutes,
    progressPercent: targetMinutes ? Math.min(100, Math.round((minutes / targetMinutes) * 100)) : 0,
  };
};

// @desc    Create or update (upsert) a monthly/yearly goal
// @route   POST /api/goals
// @access  Private
const setGoal = asyncHandler(async (req, res) => {
  const { type, year, month, targetHours } = req.body;

  if (!['monthly', 'yearly'].includes(type)) {
    res.status(400);
    throw new Error('type must be "monthly" or "yearly"');
  }
  if (type === 'monthly' && (!month || month < 1 || month > 12)) {
    res.status(400);
    throw new Error('A valid month (1-12) is required for monthly goals');
  }

  const filter = {
    user: req.user._id,
    type,
    year,
    month: type === 'monthly' ? month : null,
  };

  const goal = await Goal.findOneAndUpdate(
    filter,
    { ...filter, targetHours },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(201).json({ success: true, goal: await withProgress(req.user._id, goal) });
});

// @desc    Get all goals for the user (optionally filter by year)
// @route   GET /api/goals?year=2026
// @access  Private
const getGoals = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.year) filter.year = parseInt(req.query.year, 10);

  const goals = await Goal.find(filter).sort({ year: -1, month: 1 });
  const goalsWithProgress = await Promise.all(goals.map((g) => withProgress(req.user._id, g)));

  res.json({ success: true, goals: goalsWithProgress });
});

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }
  res.json({ success: true, message: 'Goal deleted' });
});

module.exports = { setGoal, getGoals, deleteGoal };
