import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import ConnectDB from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import incomeRoutes from './routes/income.routes.js'
import expenseRoutes from './routes/expense.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'

// Load env based on environment
dotenv.config({
    path: `.env.${process.env.NODE_ENV || "development"}`
});

const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/income', incomeRoutes)
app.use('/api/v1/expense', expenseRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)


ConnectDB()
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})