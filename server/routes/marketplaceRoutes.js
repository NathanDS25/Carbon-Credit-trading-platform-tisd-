const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
const verifyToken = require('../middleware/auth');
const requireRole = require('../middleware/roleGuard');

router.post('/list', verifyToken, requireRole('NGO'), marketplaceController.listCredits);
router.get('/', marketplaceController.getListings);
router.post('/buy/:id', verifyToken, requireRole('COMPANY'), marketplaceController.buyCredits);
router.post('/company-sell', verifyToken, requireRole('COMPANY'), marketplaceController.companySell);

module.exports = router;
