const { Client } = require('pg');

async function setupDatabase() {
    const client = new Client({
        connectionString: "postgresql://koffiyohanerickouakou@localhost:5432/sim_studio",
    });

    try {
        await client.connect();
        await client.query('CREATE EXTENSION IF NOT EXISTS vector');
        console.log('Extension pgvector enabled');
    } catch (err) {
        console.error('Error enabling extension:', err);
    } finally {
        await client.end();
    }
}

setupDatabase();
