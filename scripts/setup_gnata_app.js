const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const crypto = require('crypto');

async function main() {
    // Hardcoded for this script execution based on .env file
    const connectionString = "postgresql://koffiyohanerickouakou@localhost:5432/wozif_account";

    console.log("Connecting to database...");
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("Checking for existing Gnata application...");

        // 1. Get or Create a User (we'll use a predictable email for the system admin/owner)
        let user = await prisma.user.findFirst({
            where: { email: "admin@gnata.com" }
        });

        if (!user) {
            // Fallback to first available user or create one
            user = await prisma.user.findFirst();
            if (!user) {
                console.log("No users found. Creating admin user...");
                user = await prisma.user.create({
                    data: {
                        name: "Gnata Admin",
                        email: "admin@gnata.com",
                        password: "hashed_password_placeholder",
                        image: "/avatar.png"
                    }
                });
            }
        }

        console.log(`Using user: ${user.email} (${user.id})`);

        // 2. Create the "Gnata" Application if it doesn't exist
        let app = await prisma.application.findFirst({
            where: { name: "Gnata" }
        });

        if (!app) {
            console.log("Creating Gnata application...");
            app = await prisma.application.create({
                data: {
                    name: "Gnata",
                    category: "SaaS",
                    userId: user.id,
                    website: "https://gnata.wozif.com"
                }
            });
        } else {
            console.log("Gnata application already exists.");
        }

        // 3. Create or Refresh API Keys
        let apiConfig = await prisma.apiConfig.findUnique({
            where: { applicationId: app.id }
        });

        if (!apiConfig) {
            console.log("Generating API keys...");
            const publicKey = `pk_live_${crypto.randomBytes(12).toString('hex')}`;
            const secretKey = `sk_live_${crypto.randomBytes(24).toString('hex')}`;

            apiConfig = await prisma.apiConfig.create({
                data: {
                    applicationId: app.id,
                    publicKey,
                    secretKey,
                }
            });
        }

        console.log("\n--- GNATA APPLICATION CREDENTIALS ---");
        console.log(`AfriFlow App Name: ${app.name}`);
        console.log(`AfriFlow App ID:   ${app.id}`);
        console.log(`API Public Key:    ${apiConfig.publicKey}`);
        console.log(`API Secret Key:    ${apiConfig.secretKey}`);
        console.log("-------------------------------------");

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
