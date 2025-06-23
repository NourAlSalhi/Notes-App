import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure CORS to allow your frontend's URL
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'; // Set FRONTEND_URL in Render env vars!

app.use(cors({
  origin: frontendUrl, // Only allow your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // If you send cookies/auth headers
}));

// Routes
app.use('/api', authRoutes);
app.use('/api/notes', noteRoutes);

// Connect DB and Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
