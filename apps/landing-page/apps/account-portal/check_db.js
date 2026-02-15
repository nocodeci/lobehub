import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
    .finally(async () => {
        await prisma.$disconnect()
        await pool.end()
    });
