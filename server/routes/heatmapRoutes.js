const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

router.get('/', async (req, res, next) => {
  try {
    // Aggregated data for India Heatmap
    // Note: Since we don't have a 'state' field in User/Plantation, we'll mock it or use coordinates.
    // For this implementation, we'll simulate some state-wise data.
    const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan'];
    const heatmapData = states.map(state => ({
      state,
      totalCredits: Math.floor(Math.random() * 10000),
      avgQuality: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      ngoCount: Math.floor(Math.random() * 50),
      avgPriceINR: Math.floor(Math.random() * 500) + 1000,
    }));

    res.json({ success: true, data: heatmapData });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
