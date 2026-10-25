const asyncHandler = require('../middleware/asyncHandler');
const StudySession = require('../models/StudySession');

// @desc    Create a study session
// @route   POST /api/sessions
// @access  Private
const createSession = asyncHandler(async (req, res) => {
  const { subject, topic, date, startTime, endTime, durationMinutes, notes, source } = req.body;

  if (!startTime && !endTime && !durationMinutes) {
    res.status(400);
    throw new Error('Provide either a start/end time or a duration');
  }

  const session = await StudySession.create({
    user: req.user._id,
    subject,
    topic,
    date,
    startTime: startTime || null,
    endTime: endTime || null,
    durationMinutes,
    notes,
    source: source === 'pomodoro' ? 'pomodoro' : 'manual',
  });

  res.status(201).json({ success: true, session });
});

// @desc    Get sessions for the logged-in user (filterable, paginated)
// @route   GET /api/sessions
// @access  Private
const getSessions = asyncHandler(async (req, res) => {
  const { subject, from, to, page = 1, limit = 20, sort = '-date' } = req.query;

  const query = { user: req.user._id };
  if (subject) query.subject = subject;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const [sessions, total] = await Promise.all([
    StudySession.find(query)
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    StudySession.countDocuments(query),
  ]);

  res.json({
    success: true,
    sessions,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

// @desc    Get a single session
// @route   GET /api/sessions/:id
// @access  Private
const getSession = asyncHandler(async (req, res) => {
  const session = await StudySession.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) {
    res.status(404);
    throw new Error('Session not found');
  }
  res.json({ success: true, session });
});

// @desc    Update a session
// @route   PUT /api/sessions/:id
// @access  Private
const updateSession = asyncHandler(async (req, res) => {
  const session = await StudySession.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) {
    res.status(404);
    throw new Error('Session not found');
  }

  const fields = ['subject', 'topic', 'date', 'startTime', 'endTime', 'durationMinutes', 'notes'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) session[field] = req.body[field];
  });

  // Allow explicitly clearing start/end time if duration is set manually
  if (req.body.startTime === '') session.startTime = null;
  if (req.body.endTime === '') session.endTime = null;

  await session.save();
  res.json({ success: true, session });
});

// @desc    Delete a session
// @route   DELETE /api/sessions/:id
// @access  Private
const deleteSession = asyncHandler(async (req, res) => {
  const session = await StudySession.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!session) {
    res.status(404);
    throw new Error('Session not found');
  }
  res.json({ success: true, message: 'Session deleted' });
});

// @desc    Get distinct subjects the user has studied
// @route   GET /api/sessions/subjects/list
// @access  Private
const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await StudySession.distinct('subject', { user: req.user._id });
  res.json({ success: true, subjects: subjects.sort() });
});

module.exports = {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  getSubjects,
};
