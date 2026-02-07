const { Pool } = require('pg');
const pool = new Pool({
    connectionString: "postgresql://koffiyohanerickouakou@127.0.0.1:5432/wozif_account"
});

pool.query(`
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'user' 
  ORDER BY ordinal_position
`, (err, res) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('User table columns:');
        res.rows.forEach(row => {
            console.log(`  ${row.column_name}: ${row.data_type}`);
        });
    }
    pool.end();
});
