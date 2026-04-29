const express = require('express');
const router = express.Router();
const plantationController = require('../controllers/plantationController');
const verifyToken = require('../middleware/auth');
const requireRole = require('../middleware/roleGuard');

router.post('/', verifyToken, requireRole('NGO'), plantationController.createPlantation);
router.get('/mine', verifyToken, requireRole('NGO'), plantationController.getMyPlantations);
router.get('/', verifyToken, requireRole('ADMIN'), plantationController.getAllPlantations);
router.get('/:id', verifyToken, plantationController.getPlantationDetail);
router.patch('/:id/approve', verifyToken, requireRole('ADMIN'), plantationController.approvePlantation);
router.patch('/:id/reject', verifyToken, requireRole('ADMIN'), plantationController.rejectPlantation);

module.exports = router;
