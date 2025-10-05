import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

let pool;

/**
 * Connect to MySQL database using connection pool
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'dairy',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test the connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    console.log('MySQL Connected successfully');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

/**
 * Get database connection from pool
 * @returns {mysql.PoolConnection}
 */
const getConnection = async () => {
  if (!pool) {
    throw new Error('Database not connected');
  }
  return await pool.getConnection();
};

export default connectDB;
export { getConnection };
