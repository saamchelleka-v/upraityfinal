import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import pinRoutes from './routes/pinRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import userRoutes from './routes/userRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import businessContactRoutes from './routes/businessContactRoutes.js';
import crmRoutes from './routes/crmRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Enable CORS for frontend requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:3000'] : (origin, cb) => cb(null, true),
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve local uploads statically
const uploadsPath = path.resolve('uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pins', pinRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contacts', businessContactRoutes);
app.use('/api/crm', crmRoutes);

// Root & Health Check
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Upraity And Son API (Node.js + Express)',
    database: {
      connected: dbConnected,
      storageMode: dbConnected ? 'mongodb' : 'in-memory-fallback',
      persistence: dbConnected ? 'persistent' : 'temporary-in-memory',
    },
    version: '1.0.0',
  });
});

app.get('/', (req, res) => {
  res.send('Upraity And Son API is running. Access endpoints via /api/...');
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.url}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Upraity And Son Backend server running on http://localhost:${PORT}`);
});

export default app;
