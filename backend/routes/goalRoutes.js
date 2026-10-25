const express = require('express');
const { body } = require('express-validator');
const { setGoal, getGoals, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('type').isIn(['monthly', 'yearly']).withMessage('type must be monthly or yearly'),
    body('year').isInt({ min: 2000, max: 2100 }).withMessage('A valid year is required'),
    body('targetHours').isFloat({ min: 0.5 }).withMessage('Target hours must be at least 0.5'),
  ],
  validate,
  setGoal
);
router.get('/', getGoals);
router.delete('/:id', deleteGoal);

module.exports = router;
