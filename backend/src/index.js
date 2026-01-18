import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

// Routes
import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctors.js';
import serviceRoutes from './routes/services.js';
import appointmentRoutes from './routes/appointments.js';
import articleRoutes from './routes/articles.js';
import quizRoutes from './routes/quiz.js';
import contactRoutes from './routes/contact.js';
import podcastRoutes from './routes/podcasts.js';
import tipsRoutes from './routes/tips.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://vistapatientjourney.vercel.app',
    'https://eye-care-landing-git-main-hungbkzs-projects.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/tips', tipsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Vista Eye Care API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const startServer = async () => {
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('⚠️ Starting server without database connection');
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Vista Eye Care API Server`);
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   Health:  http://localhost:${PORT}/api/health`);
    console.log(`   Env:     ${process.env.NODE_ENV || 'development'}\n`);
  });
};

startServer();
