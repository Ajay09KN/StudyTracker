const express = require('express');
const { body } = require('express-validator');
const {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  getSubjects,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

const sessionValidation = [
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('date').isISO8601().withMessage('A valid date is required'),
  body('startTime')
    .optional({ checkFalsy: true })
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('startTime must be in HH:MM format'),
  body('endTime')
    .optional({ checkFalsy: true })
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('endTime must be in HH:MM format'),
  body('durationMinutes')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 1440 })
    .withMessage('Duration must be between 1 and 1440 minutes'),
];

router.get('/subjects/list', getSubjects);
router.route('/').post(sessionValidation, validate, createSession).get(getSessions);
router
  .route('/:id')
  .get(getSession)
  .put(updateSession)
  .delete(deleteSession);

module.exports = router;
