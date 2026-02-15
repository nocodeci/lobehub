const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const records = await prisma.paymentRecord.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
            orderId: true,
            customerName: true,
            customerPhone: true,
            customerEmail: true
        }
    });
    console.log('--- Last 5 PaymentRecords ---');
    console.log(JSON.stringify(records, null, 2));

    const customers = await prisma.customer.findMany({
        take: 5,
        select: {
            name: true,
            email: true,
            phone: true
        }
    });
    console.log('--- Last 5 Customers ---');
    console.log(JSON.stringify(customers, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
