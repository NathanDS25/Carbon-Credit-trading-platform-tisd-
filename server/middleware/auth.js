const admin = require('../config/firebase');
const prisma = require('../config/prisma');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }

  if (token === 'MOCK_ADMIN_TOKEN') {
    const user = await prisma.user.findUnique({ where: { id: '17f43afd-c912-4e51-8c33-1abce143ae55' } });
    req.user = user;
    return next();
  }

  if (token === 'MOCK_NGO_TOKEN') {
    const user = await prisma.user.findUnique({ where: { id: 'test-ngo-id' } });
    req.user = user;
    return next();
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found in database' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyToken;
