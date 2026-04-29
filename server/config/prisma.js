const { PrismaClient } = require('@prisma/client');

// Using POOLER PORT 6543 for better compatibility with Supabase background connections.
const DB_URL = 'postgresql://postgres.lqdlnxlkfevzkssxirab:Crackinmya$$69@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DB_URL,
    },
  },
});

module.exports = prisma;
