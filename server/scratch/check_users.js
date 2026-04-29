const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const emails = [
    'nialrojan2@gmail.com',
    'nialrojan3@gmail.com',
    'nialrojan4@gmail.com',
    'nialrojan5@gmail.com'
  ];

  try {
    console.log('--- Scanning Supabase for Target Accounts ---');
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: emails
        }
      }
    });

    if (users.length === 0) {
      console.log('❌ No matching accounts found in Supabase yet.');
      console.log('Suggestion: Ensure the Firebase → Supabase /auth/me endpoint has been triggered for these users.');
    } else {
      console.log(`✅ Found ${users.length} matching accounts:`);
      console.table(users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));
    }
  } catch (error) {
    console.error('❌ Probe Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
