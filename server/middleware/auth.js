const admin = require('../config/firebase');
const prisma = require('../config/prisma');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }

  // Support for development mock mode
  if (token === 'MOCK_DEV_TOKEN') {
    let user = await prisma.user.findFirst(); // Just get any user for testing if no specific dev user
    if (!user) {
        // Create a dummy user if DB is empty
        user = await prisma.user.create({
            data: {
                id: 'dev-user-id',
                firebaseUid: 'mock-uid',
                name: 'Developer User',
                email: 'dev@carbonx.com',
                role: 'NGO'
            }
        });
    }
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
