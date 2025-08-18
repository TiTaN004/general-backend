import express from 'express'
import dotenv from 'dotenv'
import authRoute from './routes/auth.route.js';
import { errorHandling } from './middleware/errorHandling.middleware.js';
dotenv.config();
const app = express();

// app.get('/', (req,res, next) => {
//     res.send("hello from home")
// })

app.use('/api/v1/auth', authRoute)

app.use(errorHandling)

app.listen(process.env.PORT,() => {
    console.log(`server running on port ${process.env.PORT}`)
})