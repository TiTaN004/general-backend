import mysql2 from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const pool = mysql2.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: process.env.CONNECTION_LIMIT,
    queueLimit: 0
})