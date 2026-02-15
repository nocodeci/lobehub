const { PrismaClient } = require('@prisma/client');

async function checkProjects() {
    const prisma = new PrismaClient();

    try {
        const projects = await prisma.gnataProject.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
                id: true,
                reference: true,
                name: true,
                status: true,
                clientName: true,
                clientEmail: true,
                price: true,
                chatId: true,
                createdAt: true
            }
        });

        console.log('=== GnataProject Table ===');
        console.log(`Total projects: ${projects.length}`);
        console.log(JSON.stringify(projects, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkProjects();
