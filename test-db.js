const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3307
        });

        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        console.log('Test query result:', rows[0].solution);
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

testConnection();
