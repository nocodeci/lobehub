const { Client } = require('pg');

async function createDatabase() {
    const client = new Client({
        connectionString: "postgresql://koffiyohanerickouakou@localhost:5432/postgres",
    });

    try {
        await client.connect();
        await client.query('CREATE DATABASE sim_studio');
        console.log('Database sim_studio created or already exists');
    } catch (err) {
        if (err.code === '42P04') {
            console.log('Database sim_studio already exists');
        } else {
            console.error('Error creating database:', err);
        }
    } finally {
        await client.end();
    }
}

createDatabase();
