const express = require('express');
const router = express.Router();
const {
  storePerformance,
  getPerformanceSummary,
  getPerformanceAnalysis,
  getRecommendation
} = require('../controllers/performanceController');

// Store performance data
router.post('/performance', storePerformance);

// Legacy summary endpoint
router.get('/performance', getPerformanceSummary);

// Analysis by userId
router.get('/performance/analysis/:userId', getPerformanceAnalysis);

// Recommendation by userId
router.get('/recommend/:userId', getRecommendation);

module.exports = router;
