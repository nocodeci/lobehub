import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

async function main() {
    console.log('🌱 Seeding database...\n');

    // Create test Vibe Coders
    console.log('Creating Vibe Coders...');
    const hashedPassword = await bcrypt.hash('password123', 12);

    const coders = await Promise.all([
        prisma.vibeCoder.upsert({
            where: { email: 'coder1@gnata.io' },
            update: {},
            create: {
                name: 'Vibe Coder #1',
                email: 'coder1@gnata.io',
                password: hashedPassword,
                specialty: ['ecommerce', 'portfolio'],
                level: 'Expert',
                rating: 4.9,
                totalProjects: 47,
                avgBuildTime: 102,
                status: 'online',
                paymentMethod: 'orange_money',
                paymentPhone: '+225 07 00 00 01',
            },
        }),
        prisma.vibeCoder.upsert({
            where: { email: 'coder2@gnata.io' },
            update: {},
            create: {
                name: 'Vibe Coder #2',
                email: 'coder2@gnata.io',
                password: hashedPassword,
                specialty: ['restaurant', 'blog'],
                level: 'Pro',
                rating: 4.7,
                totalProjects: 28,
                avgBuildTime: 95,
                status: 'busy',
                paymentMethod: 'wave',
                paymentPhone: '+221 77 00 00 02',
            },
        }),
        prisma.vibeCoder.upsert({
            where: { email: 'coder3@gnata.io' },
            update: {},
            create: {
                name: 'Vibe Coder #3',
                email: 'coder3@gnata.io',
                password: hashedPassword,
                specialty: ['landing', 'custom'],
                level: 'Junior',
                rating: 4.5,
                totalProjects: 12,
                avgBuildTime: 130,
                status: 'offline',
                paymentMethod: 'mtn',
                paymentPhone: '+225 05 00 00 03',
            },
        }),
    ]);
    console.log(`   ✅ Created ${coders.length} Vibe Coders`);

    // Create test projects (simulating paid orders)
    console.log('\nCreating sample projects...');
    const projects = await Promise.all([
        prisma.gnataProject.upsert({
            where: { reference: 'GNATA-2024-0001' },
            update: {},
            create: {
                reference: 'GNATA-2024-0001',
                name: 'Boutique Mode Africaine',
                description: 'Site e-commerce pour vente de vêtements traditionnels africains. Le client souhaite un design moderne avec des couleurs chaudes.',
                type: 'ECOMMERCE',
                priority: 'URGENT',
                requirements: ['Panier d\'achat', 'Paiement mobile money', 'Galerie produits', 'Page contact'],
                colors: { primary: '#8B5A2B', secondary: '#F4A460' },
                clientName: 'Mamadou Diallo',
                clientEmail: 'mamadou@example.com',
                clientPhone: '+225 07 00 00 10',
                status: 'PAID',
                price: 30000,
                estimatedTime: 180,
            },
        }),
        prisma.gnataProject.upsert({
            where: { reference: 'GNATA-2024-0002' },
            update: {},
            create: {
                reference: 'GNATA-2024-0002',
                name: 'Portfolio Photographe',
                description: 'Portfolio minimaliste pour photographe professionnel. Focus sur les visuels avec navigation fluide.',
                type: 'PORTFOLIO',
                priority: 'HIGH',
                requirements: ['Galerie photos', 'À propos', 'Contact', 'Réservation'],
                colors: { primary: '#1a1a1a', secondary: '#ffffff' },
                clientName: 'Aissatou Bah',
                clientEmail: 'aissatou@example.com',
                clientPhone: '+221 77 00 00 11',
                status: 'PAID',
                price: 25000,
                estimatedTime: 90,
            },
        }),
        prisma.gnataProject.upsert({
            where: { reference: 'GNATA-2024-0003' },
            update: {},
            create: {
                reference: 'GNATA-2024-0003',
                name: 'Site Restaurant Le Maquis',
                description: 'Site vitrine pour restaurant avec menu digital et système de réservation.',
                type: 'RESTAURANT',
                priority: 'NORMAL',
                requirements: ['Menu digital', 'Réservation en ligne', 'Galerie', 'Horaires'],
                colors: { primary: '#D4AF37', secondary: '#1a1a1a' },
                clientName: 'Oumar Sy',
                clientEmail: 'oumar@example.com',
                clientPhone: '+223 70 00 00 12',
                status: 'PAID',
                price: 28000,
                estimatedTime: 120,
            },
        }),
        prisma.gnataProject.upsert({
            where: { reference: 'GNATA-2024-0004' },
            update: {},
            create: {
                reference: 'GNATA-2024-0004',
                name: 'Blog Lifestyle',
                description: 'Blog personnel avec catégories et système de commentaires.',
                type: 'BLOG',
                priority: 'NORMAL',
                requirements: ['Articles', 'Catégories', 'Commentaires', 'Newsletter'],
                colors: { primary: '#FF6B6B', secondary: '#4ECDC4' },
                clientName: 'Fatou Ndiaye',
                clientEmail: 'fatou@example.com',
                clientPhone: '+221 78 00 00 13',
                status: 'PAID',
                price: 20000,
                estimatedTime: 75,
            },
        }),
        prisma.gnataProject.upsert({
            where: { reference: 'GNATA-2024-0005' },
            update: {},
            create: {
                reference: 'GNATA-2024-0005',
                name: 'Landing Page Formation',
                description: 'Landing page pour promouvoir une formation en ligne avec formulaire d\'inscription.',
                type: 'LANDING',
                priority: 'HIGH',
                requirements: ['Hero section', 'Témoignages', 'Pricing', 'FAQ', 'Inscription'],
                colors: { primary: '#6366F1', secondary: '#8B5CF6' },
                clientName: 'Ibrahim Koné',
                clientEmail: 'ibrahim@example.com',
                clientPhone: '+225 05 00 00 14',
                status: 'PAID',
                price: 18000,
                estimatedTime: 60,
            },
        }),
        // A project in BUILDING status (assigned to a coder)
        prisma.gnataProject.upsert({
            where: { reference: 'GNATA-2024-0006' },
            update: {},
            create: {
                reference: 'GNATA-2024-0006',
                name: 'E-commerce Bijoux',
                description: 'Boutique en ligne pour artisan bijoutier.',
                type: 'ECOMMERCE',
                priority: 'NORMAL',
                requirements: ['Catalogue', 'Panier', 'Paiement', 'Contact'],
                colors: { primary: '#C9B037', secondary: '#1a1a1a' },
                clientName: 'Aminata Kouyaté',
                clientEmail: 'aminata@example.com',
                clientPhone: '+223 76 00 00 15',
                status: 'BUILDING',
                price: 32000,
                estimatedTime: 150,
                coderId: coders[1].id,
                commission: 9600,
                startedAt: new Date(Date.now() - 45 * 60 * 1000), // Started 45 min ago
            },
        }),
    ]);
    console.log(`   ✅ Created ${projects.length} projects`);

    // Create some earnings for coders
    console.log('\nCreating sample earnings...');
    await prisma.coderEarning.createMany({
        data: [
            {
                coderId: coders[0].id,
                projectRef: 'GNATA-2024-0100',
                amount: 9000,
                status: 'paid',
                paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
            {
                coderId: coders[0].id,
                projectRef: 'GNATA-2024-0101',
                amount: 7500,
                status: 'paid',
                paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            },
            {
                coderId: coders[0].id,
                projectRef: 'GNATA-2024-0102',
                amount: 8400,
                status: 'pending',
            },
        ],
        skipDuplicates: true,
    });
    console.log(`   ✅ Created earnings records`);

    console.log('\n✨ Seeding complete!\n');
    console.log('Test accounts:');
    console.log('   Email: coder1@gnata.io');
    console.log('   Password: password123');
    console.log('');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
