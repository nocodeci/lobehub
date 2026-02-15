require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const bcrypt = require('bcryptjs');

async function main() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log('🌱 Seeding database...\n');

    try {
        // Create test Vibe Coders
        console.log('Creating Vibe Coders...');
        const hashedPassword = await bcrypt.hash('password123', 12);

        const coder1 = await prisma.vibeCoder.upsert({
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
        });

        const coder2 = await prisma.vibeCoder.upsert({
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
        });

        console.log('   ✅ Created Vibe Coders');

        // Create test projects
        console.log('\nCreating sample projects...');

        await prisma.gnataProject.upsert({
            where: { reference: 'GNATA-2024-0001' },
            update: {},
            create: {
                reference: 'GNATA-2024-0001',
                name: 'Boutique Mode Africaine',
                description: 'Site e-commerce pour vêtements africains.',
                type: 'ECOMMERCE',
                priority: 'URGENT',
                requirements: ['Panier', 'Paiement mobile', 'Galerie'],
                colors: { primary: '#8B5A2B', secondary: '#F4A460' },
                clientName: 'Mamadou Diallo',
                clientEmail: 'mamadou@example.com',
                clientPhone: '+225 07 00 00 10',
                status: 'PAID',
                price: 30000,
                estimatedTime: 180,
            },
        });

        await prisma.gnataProject.upsert({
            where: { reference: 'GNATA-2024-0002' },
            update: {},
            create: {
                reference: 'GNATA-2024-0002',
                name: 'Portfolio Photographe',
                description: 'Portfolio minimaliste pour photographe.',
                type: 'PORTFOLIO',
                priority: 'HIGH',
                requirements: ['Galerie', 'Contact', 'À propos'],
                colors: { primary: '#1a1a1a', secondary: '#ffffff' },
                clientName: 'Aissatou Bah',
                clientEmail: 'aissatou@example.com',
                status: 'PAID',
                price: 25000,
                estimatedTime: 90,
            },
        });

        await prisma.gnataProject.upsert({
            where: { reference: 'GNATA-2024-0003' },
            update: {},
            create: {
                reference: 'GNATA-2024-0003',
                name: 'Restaurant Le Maquis',
                description: 'Site restaurant avec menu digital.',
                type: 'RESTAURANT',
                priority: 'NORMAL',
                requirements: ['Menu', 'Réservation', 'Horaires'],
                clientName: 'Oumar Sy',
                clientEmail: 'oumar@example.com',
                status: 'PAID',
                price: 28000,
                estimatedTime: 120,
            },
        });

        await prisma.gnataProject.upsert({
            where: { reference: 'GNATA-2024-0004' },
            update: {},
            create: {
                reference: 'GNATA-2024-0004',
                name: 'Blog Lifestyle',
                description: 'Blog personnel.',
                type: 'BLOG',
                priority: 'NORMAL',
                requirements: ['Articles', 'Newsletter'],
                clientName: 'Fatou Ndiaye',
                clientEmail: 'fatou@example.com',
                status: 'PAID',
                price: 20000,
                estimatedTime: 75,
            },
        });

        await prisma.gnataProject.upsert({
            where: { reference: 'GNATA-2024-0005' },
            update: {},
            create: {
                reference: 'GNATA-2024-0005',
                name: 'Landing Formation',
                description: 'Landing page formation en ligne.',
                type: 'LANDING',
                priority: 'HIGH',
                requirements: ['Hero', 'Témoignages', 'FAQ'],
                clientName: 'Ibrahim Koné',
                clientEmail: 'ibrahim@example.com',
                status: 'PAID',
                price: 18000,
                estimatedTime: 60,
            },
        });

        // A project in BUILDING status
        await prisma.gnataProject.upsert({
            where: { reference: 'GNATA-2024-0006' },
            update: {},
            create: {
                reference: 'GNATA-2024-0006',
                name: 'E-commerce Bijoux',
                description: 'Boutique bijoux.',
                type: 'ECOMMERCE',
                priority: 'NORMAL',
                requirements: ['Catalogue', 'Panier'],
                clientName: 'Aminata Kouyaté',
                clientEmail: 'aminata@example.com',
                status: 'BUILDING',
                price: 32000,
                estimatedTime: 150,
                coderId: coder2.id,
                commission: 9600,
                startedAt: new Date(Date.now() - 45 * 60 * 1000),
            },
        });

        console.log('   ✅ Created projects');

        // Create earnings
        console.log('\nCreating earnings...');
        await prisma.coderEarning.deleteMany({});
        await prisma.coderEarning.createMany({
            data: [
                {
                    coderId: coder1.id,
                    projectRef: 'GNATA-2024-0100',
                    amount: 9000,
                    status: 'paid',
                    paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
                {
                    coderId: coder1.id,
                    projectRef: 'GNATA-2024-0101',
                    amount: 7500,
                    status: 'paid',
                    paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                },
                {
                    coderId: coder1.id,
                    projectRef: 'GNATA-2024-0102',
                    amount: 8400,
                    status: 'pending',
                },
            ],
        });
        console.log('   ✅ Created earnings');

        console.log('\n✨ Seeding complete!\n');
        console.log('Test accounts:');
        console.log('   Email: coder1@gnata.io');
        console.log('   Password: password123');
        console.log('');

    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main().catch(console.error);
