const { Client } = require('pg');

async function checkWorkspaces() {
    const client = new Client({
        connectionString: "postgresql://koffiyohanerickouakou@localhost:5432/wozif_account",
    });

    try {
        await client.connect();
        const workspaces = await client.query("SELECT * FROM workspace");
        console.log('Workspaces:', JSON.stringify(workspaces.rows, null, 2));

        const perms = await client.query("SELECT * FROM permissions");
        console.log('Permissions:', JSON.stringify(perms.rows, null, 2));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkWorkspaces();
