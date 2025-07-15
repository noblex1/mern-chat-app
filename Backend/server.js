// Import required packages
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.route.js';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Get port from environment or use 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB database');
})
.catch((error) => {
  console.error('❌ Database connection error:', error);
});

// Routes
app.get('/', (req, res) => {
  res.send('Chat Server is Running and Connected to Database!');
});

// Use auth routes - all auth routes will start with /api/auth
app.use('/api/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});