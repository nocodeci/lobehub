import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };


if (!globalForPrisma.prisma && connectionString) {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({ adapter });
} else if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
}
const prisma = globalForPrisma.prisma;

export { prisma };
