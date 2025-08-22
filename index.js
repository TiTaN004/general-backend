// import express from 'express'
// import dotenv from 'dotenv'
// import authRoute from './routes/auth.route.js';
// import { errorHandling } from './middleware/errorHandling.middleware.js';
// dotenv.config();
// const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/api/v1/auth', authRoute)
// app.use(errorHandling)

// app.listen(process.env.PORT,() => {
//     console.log(`server running on port ${process.env.PORT}`)
// })

// index.js
import express from 'express'
import dotenv from 'dotenv'
import authRoute from './routes/auth.route.js';
import { errorHandling, notFound } from './middleware/errorHandling.middleware.js';
import { testConnection } from './db.js';
import responseRoute from './routes/response.route.js';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { statisticRoute } from './routes/statistics.route.js';

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
    ],
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 200
};

dotenv.config();
const app = express();

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser())

// Add request logging middleware (helpful for debugging)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "API is running successfully",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/response', responseRoute);
app.use('/api/v1/statistic', statisticRoute)

// 404 handler (must be after all routes)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandling);

const PORT = process.env.PORT || 3000;

// Start server with database connection test
const startServer = async () => {
    try {
        // Test database connection first
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('❌ Failed to connect to database. Server not started.');
            process.exit(1);
        }

        // Start server only if database is connected
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`🌐 API URL: http://localhost:${PORT}`);
            console.log(`📋 Health check: http://localhost:${PORT}/`);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();