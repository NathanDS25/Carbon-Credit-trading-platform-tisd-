const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('--- Probing Database ---');
    const userCount = await prisma.user.count();
    console.log(`✅ Connection Stable. User Count: ${userCount}`);
    
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('--- Active Tables ---');
    console.table(tables);
  } catch (error) {
    console.error('❌ Database Probe Failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
