const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const verifyToken = require('../middleware/auth');
const requireRole = require('../middleware/roleGuard');
const { getAllListingsOnChain } = require('../services/blockchainService');

router.get('/stats', verifyToken, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalCompanies = await prisma.user.count({ where: { role: 'COMPANY' } });
    const totalCreditsMinted = await prisma.plantation.aggregate({ _sum: { creditsAwarded: true } });
    const totalTradeVolume = await prisma.trade.aggregate({ _sum: { inrPaid: true } });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCompanies,
        totalCreditsMinted: totalCreditsMinted._sum.creditsAwarded || 0,
        totalTradeVolume: totalTradeVolume._sum.inrPaid || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/satellite-queue', verifyToken, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const pendingJobs = await prisma.satelliteJob.findMany({
      where: { jobStatus: 'PENDING' },
      include: { plantation: true },
    });
    res.json({ success: true, data: pendingJobs });
  } catch (error) {
    next(error);
  }
});

router.get('/blockchain-feed', verifyToken, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const onChainListings = await getAllListingsOnChain();
    res.json({ success: true, data: onChainListings });
  } catch (error) {
    next(error);
  }
});

router.post('/mint-override', verifyToken, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { walletAddress, amount, userId } = req.body;
    // Manual minting logic
    res.status(501).json({ success: false, error: 'Manual minting logic not fully implemented' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
