import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const useSsl = String(process.env.DB_SSL || '').toLowerCase() === 'true';
const rejectUnauthorized = String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'false').toLowerCase() === 'true';
const caPath = process.env.DB_SSL_CA_PATH;

const sslConfig = useSsl
  ? {
      rejectUnauthorized,
      ...(caPath && fs.existsSync(caPath)
        ? {
            ca: fs.readFileSync(caPath, 'utf8'),
          }
        : {}),
    }
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const query = async (sql, values) => {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, values);
    return results;
  } finally {
    connection.release();
  }
};

export default pool;
