import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample businesses for Cartagena
  const businesses = await Promise.all([
    // Hotels
    prisma.business.create({
      data: {
        name: 'Hotel Cartagena Plaza',
        description: 'Luxury hotel in the heart of Cartagena historic center',
        category: Category.HOTEL,
        city: 'Cartagena',
        address: 'Plaza de San Diego, Centro Histórico',
        phone: '+57 5 664 9494',
        email: 'info@hotelcartagenaplaza.com',
        whatsapp: '+57 300 123 4567',
        website: 'https://hotelcartagenaplaza.com',
        verified: true,
        latitude: 10.4236,
        longitude: -75.5378,
      },
    }),

    prisma.business.create({
      data: {
        name: 'Hotel Boutique Santa Clara',
        description: 'Historic boutique hotel with colonial architecture',
        category: Category.HOTEL,
        city: 'Cartagena',
        address: 'Calle del Torno, Centro Histórico',
        phone: '+57 5 650 4700',
        email: 'reservas@hotelsantaclara.com',
        whatsapp: '+57 301 234 5678',
        website: 'https://hotelsantaclara.com',
        verified: false,
        latitude: 10.4249,
        longitude: -75.5366,
      },
    }),

    // Tours
    prisma.business.create({
      data: {
        name: 'Cartagena City Tours',
        description: 'Authentic tours through Cartagena and nearby islands',
        category: Category.TOUR,
        city: 'Cartagena',
        address: 'Plaza Santo Domingo',
        phone: '+57 5 668 8888',
        email: 'info@cartagenacitytours.com',
        whatsapp: '+57 302 345 6789',
        website: 'https://cartagenacitytours.com',
        verified: true,
        latitude: 10.4238,
        longitude: -75.5344,
      },
    }),

    prisma.business.create({
      data: {
        name: 'Islas del Rosario Adventure',
        description: 'Day trips to Rosario Islands with snorkeling and lunch',
        category: Category.TOUR,
        city: 'Cartagena',
        address: 'Muelle de los Pegasos',
        phone: '+57 5 642 7777',
        email: 'tours@islasrosario.com',
        whatsapp: '+57 303 456 7890',
        verified: false,
        latitude: 10.3997,
        longitude: -75.5511,
      },
    }),

    // Transportation
    prisma.business.create({
      data: {
        name: 'Cartagena Airport Transfer',
        description: 'Safe and reliable airport transfers 24/7',
        category: Category.TRANSPORT,
        city: 'Cartagena',
        phone: '+57 5 666 5555',
        email: 'reservas@cartagenaairport.com',
        whatsapp: '+57 304 567 8901',
        verified: true,
        latitude: 10.4097,
        longitude: -75.5144,
      },
    }),

    prisma.business.create({
      data: {
        name: 'Taxi Histórico Cartagena',
        description: 'Historic city taxi service with experienced drivers',
        category: Category.TRANSPORT,
        city: 'Cartagena',
        phone: '+57 5 664 4444',
        whatsapp: '+57 305 678 9012',
        verified: false,
        latitude: 10.4206,
        longitude: -75.5400,
      },
    }),
  ]);

  console.log(`✅ Created ${businesses.length} sample businesses`);

  // Create some promo codes
  const promoCodes = await Promise.all([
    prisma.promoCode.create({
      data: {
        code: 'NUMTRIP20',
        description: '20% discount on first night',
        discount: '20%',
        businessId: businesses[0].id,
        active: true,
        validUntil: new Date('2024-12-31'),
      },
    }),

    prisma.promoCode.create({
      data: {
        code: 'WELCOME10',
        description: '10% discount for new customers',
        discount: '10%',
        businessId: businesses[2].id,
        active: true,
        validUntil: new Date('2024-12-31'),
      },
    }),

    prisma.promoCode.create({
      data: {
        code: 'FREETRANSFER',
        description: 'Free airport pickup with 3+ night stay',
        discount: 'Free transfer',
        businessId: businesses[4].id,
        active: true,
        validUntil: new Date('2024-12-31'),
      },
    }),
  ]);

  console.log(`✅ Created ${promoCodes.length} promo codes`);

  // Create some sample validations
  const validations = await Promise.all([
    prisma.validation.create({
      data: {
        type: 'PHONE_WORKS',
        isCorrect: true,
        comment: 'Called and confirmed reservation',
        businessId: businesses[0].id,
      },
    }),

    prisma.validation.create({
      data: {
        type: 'WHATSAPP_WORKS',
        isCorrect: true,
        comment: 'WhatsApp response was immediate',
        businessId: businesses[2].id,
      },
    }),

    prisma.validation.create({
      data: {
        type: 'EMAIL_WORKS',
        isCorrect: true,
        comment: 'Email responded within 2 hours',
        businessId: businesses[0].id,
      },
    }),
  ]);

  console.log(`✅ Created ${validations.length} validations`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });