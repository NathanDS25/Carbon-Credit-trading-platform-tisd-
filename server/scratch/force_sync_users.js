const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const emails = [
    'nialrojan2@gmail.com',
    'nialrojan3@gmail.com',
    'nialrojan4@gmail.com',
    'nialrojan5@gmail.com'
  ];

  console.log('--- Force Syncing Identities to Supabase ---');

  for (const email of emails) {
    try {
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          firebaseUid: `mock-uid-${email}`,
          email,
          name: email.split('@')[0],
          role: 'NGO' // Default role
        }
      });
      console.log(`✅ Synchronized: ${email} (ID: ${user.id})`);
    } catch (error) {
      console.error(`❌ Failed to sync ${email}:`, error.message);
    }
  }

  console.log('--- Force Sync Complete ---');
  await prisma.$disconnect();
}

main();
