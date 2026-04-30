const admin = require('../config/firebase');
const prisma = require('../config/prisma');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const mockRoleHeader = req.headers['x-mock-role'];
  const token = authHeader?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }

  // Support for development mock mode with dynamic role sync
  if (token === 'MOCK_DEV_TOKEN' || token === 'DEMO_BYPASS_TOKEN') {
    let user = await prisma.user.findUnique({
        where: { id: 'dev-user-id' }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                id: 'dev-user-id',
                firebaseUid: 'mock-uid',
                name: 'Developer User',
                email: 'dev@carbonx.com',
                role: mockRoleHeader || 'NGO'
            }
        });
    } else if (mockRoleHeader && user.role !== mockRoleHeader) {
        user = await prisma.user.update({
            where: { id: 'dev-user-id' },
            data: { role: mockRoleHeader }
        });
    }
    
    req.user = user;
    return next();
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    let user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    // AUTO-CREATE: If user authenticated via Firebase but not in Supabase yet
    if (!user) {
      console.log(`🚀 New Firebase User Detected: ${decodedToken.email}. Auto-creating Supabase profile...`);
      user = await prisma.user.create({
        data: {
          firebaseUid: decodedToken.uid,
          email: decodedToken.email || 'unknown@carbonx.com',
          name: decodedToken.name || decodedToken.email?.split('@')[0] || 'CarbonX User',
          role: 'NGO', // Default role for new users
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyToken;
