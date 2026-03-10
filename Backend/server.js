import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js'
import connectDB from './config/db.js';



dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// --- MODIFIED CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174',
  'https://kantam-the-ganga-water.vercel.app',
  'https://kantam-the-ganga-water-admin.vercel.app'
];

app.use(cors({
    origin: allowedOrigins, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));
// ----------------------------------

app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users',userRoutes)




// Database Connection
connectDB();

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));