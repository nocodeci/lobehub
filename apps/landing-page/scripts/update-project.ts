import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function updateProject() {
    const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/wozif_account';
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        // Update the cosmetics project with email
        const updated = await prisma.gnataProject.update({
            where: { reference: 'GNATA-2026-0007' },
            data: {
                clientName: 'Client Test',
                clientEmail: 'client@example.com',
            }
        });

        console.log('=== Project Updated ===');
        console.log(JSON.stringify(updated, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

updateProject();
