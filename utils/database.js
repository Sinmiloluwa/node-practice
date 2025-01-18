import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-practice',
    password: ''
});

const db = pool.promise();

export default db;