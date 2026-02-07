const { Client } = require('pg');

async function setupDatabase() {
    const client = new Client({
        connectionString: "postgresql://koffiyohanerickouakou@localhost:5432/wozif_account",
    });

    try {
        await client.connect();
        // Try to enable vector extension (might fail if not installed on system)
        try {
            await client.query('CREATE EXTENSION IF NOT EXISTS vector');
            console.log('Extension pgvector enabled in wozif_account');
        } catch (e) {
            console.warn('Could not enable pgvector, SIM Studio might have issues with vector types:', e.message);
        }
    } catch (err) {
        console.error('Error connecting to database:', err);
    } finally {
        await client.end();
    }
}

setupDatabase();
