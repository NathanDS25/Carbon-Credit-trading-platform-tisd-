const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMessages = async (req, res) => {
  try {
    const { receiverId } = req.query;
    const senderId = req.user.id;

    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      },
      orderBy: { createdAt: 'asc' },
      include: { sender: true, receiver: true }
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message, fileUrl } = req.body;
    const senderId = req.user.id;

    const chatMessage = await prisma.chatMessage.create({
      data: {
        senderId,
        receiverId,
        message,
        fileUrl
      }
    });

    res.status(201).json({ success: true, data: chatMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all users who have chatted with current user
    const sent = await prisma.chatMessage.findMany({ where: { senderId: userId }, select: { receiver: true } });
    const received = await prisma.chatMessage.findMany({ where: { receiverId: userId }, select: { sender: true } });
    
    const users = [...sent.map(s => s.receiver), ...received.map(r => r.sender)];
    const uniqueUsers = Array.from(new Set(users.map(u => u.id))).map(id => users.find(u => u.id === id));

    res.json({ success: true, data: uniqueUsers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
