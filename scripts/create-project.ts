import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function createTestProject() {
    const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/wozif_account';
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        // Generate reference
        const year = new Date().getFullYear();
        const count = await prisma.gnataProject.count();
        const reference = `GNATA-${year}-${String(count + 1).padStart(4, '0')}`;

        // Create the project for the cosmetics e-commerce order
        const project = await prisma.gnataProject.create({
            data: {
                reference,
                name: "Site E-commerce Cosmétiques",
                description: "Site e-commerce comme Jumia avec paiement inclus, envoi de mail automatique, paiement à la livraison et paiement en ligne AfriFlow",
                type: 'ECOMMERCE',
                priority: 'NORMAL',
                requirements: ['Paiement en ligne', 'Paiement à la livraison', 'Envoi de mail automatique'],
                clientName: "Client Gnata",
                clientEmail: "",
                price: 64900,
                status: 'PAID', // Ready to be assigned
                externalPaymentId: 'a6x0926j',
            }
        });

        console.log('=== Project Created ===');
        console.log(JSON.stringify(project, null, 2));

        // List all projects
        const allProjects = await prisma.gnataProject.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                reference: true,
                name: true,
                status: true,
                price: true,
                createdAt: true
            }
        });

        console.log('\n=== All Projects ===');
        console.log(JSON.stringify(allProjects, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

createTestProject();
