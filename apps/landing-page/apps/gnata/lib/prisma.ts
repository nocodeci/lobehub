import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL;
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};

declare const globalThis: {
    prismaGnata: PrismaClient;
} & typeof global;

const prismaInstance = globalThis.prismaGnata ?? prismaClientSingleton();

// Named export for backward compatibility
export const prisma = prismaInstance;

// Default export
export default prismaInstance;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGnata = prismaInstance;
