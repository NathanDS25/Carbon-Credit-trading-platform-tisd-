const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { participantId, scheduledAt, meetLink } = req.body;
    const meeting = await prisma.meeting.create({
      data: {
        organizerId: req.user.id,
        participantId,
        scheduledAt: new Date(scheduledAt),
        meetLink,
      },
    });
    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    next(error);
  }
});

router.get('/mine', verifyToken, async (req, res, next) => {
  try {
    const meetings = await prisma.meeting.findMany({
      where: {
        OR: [
          { organizerId: req.user.id },
          { participantId: req.user.id },
        ],
      },
      include: {
        organizer: { select: { name: true } },
        participant: { select: { name: true } },
      },
    });
    res.json({ success: true, data: meetings });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', verifyToken, async (req, res, next) => {
  try {
    const { status } = req.body;
    const meeting = await prisma.meeting.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json({ success: true, data: meeting });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
