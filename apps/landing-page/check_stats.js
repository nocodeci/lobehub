const { Client } = require('pg');

async function checkUserStats() {
    const client = new Client({
        connectionString: "postgresql://koffiyohanerickouakou@localhost:5432/wozif_account",
    });

    try {
        await client.connect();
        const res = await client.query("SELECT * FROM \"user_stats\" WHERE user_id = '00000000-0000-0000-0000-000000000000'");
        console.log('Anonymous User Stats:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkUserStats();
