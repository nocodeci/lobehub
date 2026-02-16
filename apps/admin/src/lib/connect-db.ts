import pg from 'pg';

const connectPool = new pg.Pool({
    connectionString: process.env.CONNECT_DATABASE_URL,
});

export default connectPool;
