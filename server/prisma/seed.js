const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    const user = await prisma.user.upsert({
      where: { email: 'test@ngo.com' },
      update: {},
      create: {
        id: 'test-ngo-id',
        firebaseUid: 'mock-firebase-uid',
        name: 'Green Earth NGO',
        email: 'test@ngo.com',
        role: 'NGO',
        walletAddress: '0x61080a970e39b97ddfa49825c6b166a419de6f4814e5f314e14663041bfe29cb', // Using your wallet
      },
    });
    console.log('✅ Mock NGO User Created:', user.id);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
