// import mysql2 from 'mysql2/promise'
// import dotenv from 'dotenv'

// dotenv.config()

// export const pool = mysql2.createPool({
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE,
//     waitForConnections: true,
//     connectionLimit: process.env.CONNECTION_LIMIT,
//     queueLimit: 0
// })

// db.js
import mysql2 from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const pool = mysql2.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.CONNECTION_LIMIT) || 10,
    queueLimit: 0
});

// Test database connection on startup
export const testConnection = async () => {
    try {
        console.log('🔄 Testing database connection...');
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        console.log('✅ Database connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState
        });
        
        return false;
    }
}

// Graceful pool closure
export const closePool = async () => {
    try {
        await pool.end();
        console.log('Database pool closed');
    } catch (error) {
        console.error('Error closing database pool:', error);
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await closePool();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nShutting down gracefully...');
    await closePool();
    process.exit(0);
});