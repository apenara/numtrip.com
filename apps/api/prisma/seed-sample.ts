import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting sample data seed...');

  // Create sample businesses for Cartagena
  const businesses = [
    {
      name: 'Hotel Charleston Santa Teresa',
      description: 'Luxury boutique hotel in the heart of Cartagena\'s old city, offering elegant rooms and rooftop pool with stunning views.',
      category: 'HOTEL' as const,
      city: 'Cartagena',
      address: 'Cra. 3 #31-23, Centro Histórico',
      phone: '+57 5 6649494',
      email: 'reservas@hotelcharleston.com',
      whatsapp: '+57 3001234567',
      website: 'https://www.hotelcharlestonsantateresa.com',
      verified: true,
      latitude: 10.4259,
      longitude: -75.5483,
    },
    {
      name: 'Cartagena City Tours',
      description: 'Professional tour guides offering walking tours, island hopping, and cultural experiences in Cartagena.',
      category: 'TOUR' as const,
      city: 'Cartagena',
      address: 'Plaza Santo Domingo, Local 5',
      phone: '+57 5 6789012',
      email: 'info@cartagenacitytours.com',
      whatsapp: '+57 3109876543',
      website: 'https://www.cartagenacitytours.com',
      verified: true,
      latitude: 10.4235,
      longitude: -75.5512,
    },
    {
      name: 'Caribbean Transfers',
      description: 'Reliable airport transfers and private transportation services throughout Cartagena and surrounding areas.',
      category: 'TRANSPORT' as const,
      city: 'Cartagena',
      address: 'Aeropuerto Rafael Núñez',
      phone: '+57 5 5551234',
      email: 'bookings@caribbeantransfers.co',
      whatsapp: '+57 3201234567',
      verified: false,
      latitude: 10.4426,
      longitude: -75.5130,
    },
    {
      name: 'La Cevicheria',
      description: 'Famous seafood restaurant featured in Anthony Bourdain\'s show, serving fresh ceviche and Colombian cuisine.',
      category: 'RESTAURANT' as const,
      city: 'Cartagena',
      address: 'Calle Stuart #7-14, San Diego',
      phone: '+57 5 6601492',
      email: 'reservas@lacevicheria.com',
      whatsapp: '+57 3156789012',
      website: 'https://www.lacevicheria.com',
      verified: true,
      latitude: 10.4251,
      longitude: -75.5495,
    },
    {
      name: 'Castillo San Felipe Tour',
      description: 'Historical fortress tours with professional guides explaining the colonial history of Cartagena.',
      category: 'ATTRACTION' as const,
      city: 'Cartagena',
      address: 'Av. Antonio de Arévalo, Cartagena',
      phone: '+57 5 6666789',
      email: 'info@castillosanfelipe.gov.co',
      verified: false,
      latitude: 10.4178,
      longitude: -75.5395,
    },
  ];

  // Create businesses
  for (const business of businesses) {
    // First check if business exists
    const existing = await prisma.business.findFirst({
      where: { 
        name: business.name,
        city: business.city,
      },
    });

    const created = existing 
      ? await prisma.business.update({
          where: { id: existing.id },
          data: business,
        })
      : await prisma.business.create({
          data: business,
        });
    console.log(`✅ Created/Updated business: ${created.name}`);

    // Add some promo codes for verified businesses
    if (business.verified) {
      const promoCode = `${business.name.split(' ')[0].toUpperCase()}2025`;
      const existingPromo = await prisma.promoCode.findUnique({
        where: { code: promoCode },
      });

      if (!existingPromo) {
        await prisma.promoCode.create({
          data: {
            code: promoCode,
            description: 'Special discount for NumTrip users',
            discount: '10% OFF',
            validUntil: new Date('2025-12-31'),
            businessId: created.id,
            active: true,
          },
        });
      }
      console.log(`  📱 Added promo code for ${created.name}`);
    }

    // Add some sample validations
    const validationTypes = ['PHONE_WORKS', 'EMAIL_WORKS', 'WHATSAPP_WORKS'];
    for (const type of validationTypes) {
      await prisma.validation.create({
        data: {
          type: type as any,
          isCorrect: Math.random() > 0.2, // 80% positive validations
          businessId: created.id,
          comment: Math.random() > 0.7 ? 'Contact verified successfully' : null,
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
        },
      });
    }
    console.log(`  ✓ Added sample validations for ${created.name}`);
  }

  console.log('🎉 Sample data seed completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding data:', e);
    await prisma.$disconnect();
    process.exit(1);
  });