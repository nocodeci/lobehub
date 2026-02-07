const { Pool } = require('pg');
const pool = new Pool({
    connectionString: "postgresql://koffiyohanerickouakou@localhost:5432/wozif_account"
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to DB:', err);
    } else {
        console.log('Connected to DB at:', res.rows[0].now);
    }
    pool.end();
});
