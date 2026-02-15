const { Client } = require('pg');

async function listTables() {
    const client = new Client({
        connectionString: "postgresql://koffiyohanerickouakou@localhost:5432/wozif_account",
    });

    try {
        await client.connect();
        const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Tables in wozif_account:');
        res.rows.forEach(row => console.log(`- ${row.table_name}`));

        const enums = await client.query("SELECT t.typname FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid GROUP BY t.typname");
        console.log('\nEnums:');
        enums.rows.forEach(row => console.log(`- ${row.typname}`));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

listTables();
