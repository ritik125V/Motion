import express from 'express';
import cors from 'cors';
import connectDB from '../backend/Database/mongo.js'
import cookieParser from 'cookie-parser';
import userRouter from './routes/user_route.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
console.log("frontend url from env:", process.env.FRONTEND_URL);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
}));

app.use(cookieParser());
app.use(express.json());


app.use('/api/v1.0/user', userRouter);

app.get('/ping', (req, res) => {
    res.json({
        success: true,
        message: 'pong'
    }).status(200);
});


connectDB();

export default app;
