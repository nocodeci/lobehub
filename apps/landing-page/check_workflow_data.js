const { Client } = require('pg');

async function checkWorkflows() {
    const client = new Client({
        connectionString: "postgresql://koffiyohanerickouakou@localhost:5432/wozif_account",
    });

    try {
        await client.connect();
        const res = await client.query("SELECT * FROM workflow");
        console.log('Workflows:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkWorkflows();
