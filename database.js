const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3307,
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0       
});

module.exports = pool;

pool.getConnection()
    .then((conn) => {
        console.log('Connected to the MySQL database.');
        conn.release();
    })
    .catch((err) => {
        console.error('Error connecting to the MySQL database:', err);
    });
