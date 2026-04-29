const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const verifyToken = require('../middleware/auth');

router.get('/:userId', verifyToken, async (req, res, next) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: req.params.userId },
          { senderId: req.params.userId, receiverId: req.user.id },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
});

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { receiverId, message, fileUrl } = req.body;
    const newMessage = await prisma.chatMessage.create({
      data: {
        senderId: req.user.id,
        receiverId,
        message,
        fileUrl,
      },
    });
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
