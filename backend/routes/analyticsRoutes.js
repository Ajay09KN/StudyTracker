const express = require('express');
const { getDashboardStats, getChartData, getCalendarData } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/charts', getChartData);
router.get('/calendar', getCalendarData);

module.exports = router;
