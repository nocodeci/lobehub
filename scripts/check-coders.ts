import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function checkVibeCoders() {
    const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/wozif_account';
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const coders = await prisma.vibeCoder.findMany({
            select: {
                id: true,
                coderNumber: true,
                name: true,
                email: true,
                status: true,
                rating: true,
                totalProjects: true,
                specialty: true,
                level: true,
                createdAt: true
            }
        });

        console.log('=== Vibe Coders ===');
        console.log(`Total: ${coders.length}`);
        console.log(JSON.stringify(coders, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

checkVibeCoders();
