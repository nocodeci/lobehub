import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

console.log('--- Model Keys ---');
console.log(Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
console.log('--- Application Delegate ---');
console.log(typeof prisma.application);
process.exit(0);
