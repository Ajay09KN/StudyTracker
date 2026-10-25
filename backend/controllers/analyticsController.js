const asyncHandler = require('../middleware/asyncHandler');
const StudySession = require('../models/StudySession');
const { getRangeBounds, calculateStreaks, DAY_MS } = require('../utils/dateHelpers');

const dateKey = (d) => new Date(d).toISOString().slice(0, 10);

const sumMinutes = async (userId, start, end, inclusiveEnd = true) => {
  const dateMatch = inclusiveEnd ? { $gte: start, $lte: end } : { $gte: start, $lt: end };
  const result = await StudySession.aggregate([
    { $match: { user: userId, date: dateMatch } },
    { $group: { _id: null, minutes: { $sum: '$durationMinutes' } } },
  ]);
  return result[0]?.minutes || 0;
};

// @desc    Get aggregate dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();

  const dayRange = getRangeBounds('day', now);
  const weekRange = getRangeBounds('week', now);
  const monthRange = getRangeBounds('month', now);
  const yearRange = getRangeBounds('year', now);

  const [todayMinutes, weekMinutes, monthMinutes, yearMinutes] = await Promise.all([
    sumMinutes(userId, dayRange.start, dayRange.end, false),
    sumMinutes(userId, weekRange.start, weekRange.end),
    sumMinutes(userId, monthRange.start, monthRange.end),
    sumMinutes(userId, yearRange.start, yearRange.end),
  ]);

  const [subjectBreakdown, allDates, recentSessions, totalAllTime] = await Promise.all([
    StudySession.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$subject', minutes: { $sum: '$durationMinutes' }, sessions: { $sum: 1 } } },
      { $sort: { minutes: -1 } },
    ]),
    StudySession.aggregate([{ $match: { user: userId } }, { $group: { _id: '$date' } }]),
    StudySession.find({ user: userId }).sort({ date: -1, createdAt: -1 }).limit(6),
    StudySession.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, minutes: { $sum: '$durationMinutes' }, sessions: { $sum: 1 } } },
    ]),
  ]);

  const streaks = calculateStreaks(allDates.map((d) => d._id));

  res.json({
    success: true,
    stats: {
      today: { minutes: todayMinutes },
      week: { minutes: weekMinutes },
      month: { minutes: monthMinutes },
      year: { minutes: yearMinutes },
      allTime: {
        minutes: totalAllTime[0]?.minutes || 0,
        sessions: totalAllTime[0]?.sessions || 0,
        studyDays: allDates.length,
      },
      streaks,
      dailyTargetMinutes: req.user.dailyTargetMinutes,
      todayProgress: req.user.dailyTargetMinutes
        ? Math.min(100, Math.round((todayMinutes / req.user.dailyTargetMinutes) * 100))
        : 0,
    },
    subjects: subjectBreakdown.map((s) => ({
      subject: s._id,
      minutes: s.minutes,
      sessions: s.sessions,
    })),
    recentSessions,
  });
});

// @desc    Get chart-ready aggregated series for a given period
// @route   GET /api/analytics/charts?period=daily|weekly|monthly|yearly
// @access  Private
const getChartData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const period = req.query.period || 'daily';
  const now = new Date();

  if (period === 'daily') {
    const days = Math.min(parseInt(req.query.days, 10) || 14, 90);
    const start = new Date(Date.now() - (days - 1) * DAY_MS);
    start.setUTCHours(0, 0, 0, 0);

    const rows = await StudySession.aggregate([
      { $match: { user: userId, date: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          minutes: { $sum: '$durationMinutes' },
        },
      },
    ]);
    const map = new Map(rows.map((r) => [r._id, r.minutes]));

    const series = [];
    for (let i = 0; i < days; i += 1) {
      const d = new Date(start.getTime() + i * DAY_MS);
      const key = dateKey(d);
      series.push({ label: key, minutes: map.get(key) || 0 });
    }
    return res.json({ success: true, period, series });
  }

  if (period === 'weekly') {
    const weeks = Math.min(parseInt(req.query.weeks, 10) || 12, 52);
    const { start: currentWeekStart } = getRangeBounds('week', now);
    const rangeStart = new Date(currentWeekStart.getTime() - (weeks - 1) * 7 * DAY_MS);

    const rows = await StudySession.aggregate([
      { $match: { user: userId, date: { $gte: rangeStart } } },
      {
        $group: {
          _id: {
            $dateTrunc: { date: '$date', unit: 'week', startOfWeek: 'monday' },
          },
          minutes: { $sum: '$durationMinutes' },
        },
      },
    ]);
    const map = new Map(rows.map((r) => [dateKey(r._id), r.minutes]));

    const series = [];
    for (let i = 0; i < weeks; i += 1) {
      const weekStart = new Date(rangeStart.getTime() + i * 7 * DAY_MS);
      const key = dateKey(weekStart);
      series.push({ label: key, minutes: map.get(key) || 0 });
    }
    return res.json({ success: true, period, series });
  }

  if (period === 'monthly') {
    const year = parseInt(req.query.year, 10) || now.getUTCFullYear();
    const rangeStart = new Date(Date.UTC(year, 0, 1));
    const rangeEnd = new Date(Date.UTC(year + 1, 0, 1));

    const rows = await StudySession.aggregate([
      { $match: { user: userId, date: { $gte: rangeStart, $lt: rangeEnd } } },
      {
        $group: {
          _id: { $month: '$date' },
          minutes: { $sum: '$durationMinutes' },
        },
      },
    ]);
    const map = new Map(rows.map((r) => [r._id, r.minutes]));

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const series = monthNames.map((label, idx) => ({
      label,
      minutes: map.get(idx + 1) || 0,
    }));
    return res.json({ success: true, period, series, year });
  }

  if (period === 'yearly') {
    const rows = await StudySession.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $year: '$date' },
          minutes: { $sum: '$durationMinutes' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const series = rows.map((r) => ({ label: String(r._id), minutes: r.minutes }));
    return res.json({ success: true, period, series });
  }

  res.status(400);
  throw new Error('Invalid period. Use daily, weekly, monthly, or yearly.');
});

// @desc    Get per-day totals for calendar heatmap (a specific month, or a whole year)
// @route   GET /api/analytics/calendar?year=2026&month=7
// @access  Private
const getCalendarData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const year = parseInt(req.query.year, 10) || new Date().getUTCFullYear();
  const month = req.query.month ? parseInt(req.query.month, 10) : null; // 1-12

  let rangeStart;
  let rangeEnd;
  if (month) {
    rangeStart = new Date(Date.UTC(year, month - 1, 1));
    rangeEnd = new Date(Date.UTC(year, month, 1));
  } else {
    rangeStart = new Date(Date.UTC(year, 0, 1));
    rangeEnd = new Date(Date.UTC(year + 1, 0, 1));
  }

  const rows = await StudySession.aggregate([
    { $match: { user: userId, date: { $gte: rangeStart, $lt: rangeEnd } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        minutes: { $sum: '$durationMinutes' },
        sessions: { $sum: 1 },
        subjects: { $addToSet: '$subject' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const days = rows.map((r) => ({
    date: r._id,
    minutes: r.minutes,
    sessions: r.sessions,
    subjects: r.subjects,
  }));

  res.json({ success: true, year, month, days });
});

module.exports = { getDashboardStats, getChartData, getCalendarData };
