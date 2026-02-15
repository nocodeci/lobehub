const { Client } = require('pg');

async function checkTableNames() {
    const client = new Client({
        connectionString: "postgresql://koffiyohanerickouakou@localhost:5432/wozif_account",
    });

    try {
        await client.connect();
        const res = await client.query("SELECT quote_ident(table_name) as table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Tables (quoted if needed):');
        res.rows.forEach(row => console.log(`- ${row.table_name}`));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkTableNames();
