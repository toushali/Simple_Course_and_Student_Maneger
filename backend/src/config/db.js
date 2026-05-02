const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT, 10) || 5432,
    user:     process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    max: 10,                      // max connections in the pool
    idleTimeoutMillis: 30000,     // close idle clients after 30s
    connectionTimeoutMillis: 2000 // fail fast if server unreachable
});

// Startup sanity check — verify credentials work before serving traffic
pool.query('SELECT NOW()')
    .then(() => console.log('✓ PostgreSQL connected'))
    .catch(err => {
        console.error('✗ PostgreSQL connection failed:', err.message);
        process.exit(1);
    });

// Catch unexpected errors on idle clients so the process doesn't crash
pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err);
});

module.exports = {
    // Simple query helper — use for single statements
    query: (text, params) => pool.query(text, params),

    // Dedicated client — use for transactions (needs BEGIN/COMMIT/ROLLBACK on same connection)
    getClient: () => pool.connect(),

    // Expose the pool itself if you ever need pool-level access
    pool
};