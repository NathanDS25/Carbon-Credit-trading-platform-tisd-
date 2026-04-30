const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Seeding real plantation data into Supabase...');
  
  const devUser = await prisma.user.upsert({
    where: { id: 'dev-user-id' },
    update: {},
    create: {
      id: 'dev-user-id',
      firebaseUid: 'mock-uid',
      name: 'CarbonX NGO Lead',
      email: 'lead@carbonx.org',
      role: 'NGO',
      creditBalance: 1450
    },
  });

  const plantations = [
    {
      name: 'Bandstand Green Belt',
      lat: 19.0435,
      lng: 72.8205,
      areaSqKm: 0.45,
      status: 'VERIFIED',
      creditsAwarded: 120,
      qualityGrade: 'A',
      imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2000'
    },
    {
      name: 'Dehradun Valley R1',
      lat: 30.3165,
      lng: 78.0322,
      areaSqKm: 1.2,
      status: 'VERIFIED',
      creditsAwarded: 450,
      qualityGrade: 'A',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000'
    },
    {
      name: 'Western Ghats Bio-Zone',
      lat: 18.5204,
      lng: 73.8567,
      areaSqKm: 5.5,
      status: 'PENDING',
      creditsAwarded: 0,
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000'
    }
  ];

  for (const p of plantations) {
    // Check if plantation already exists to avoid duplicates
    const existing = await prisma.plantation.findFirst({
        where: { name: p.name, userId: devUser.id }
    });
    
    if (!existing) {
        await prisma.plantation.create({
            data: {
                ...p,
                userId: devUser.id
            }
        });
    }
  }

  console.log('✅ Supabase seeded with real records!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
