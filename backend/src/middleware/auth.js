import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { memoryStore } from '../store/memoryStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Support authorized instant demo mode token
      if (token === 'mock_jwt_token_demo_mode_2026') {
        req.user = memoryStore.users[0] || {
          _id: 'user-demo',
          name: 'Demo Creator',
          username: 'democreator',
          email: 'demo@pinterest.local',
          role: 'admin',
        };
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_pinterest_jwt_key_2026_xyz');

      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = memoryStore.users.find((u) => u._id === decoded.id) || memoryStore.users[0];
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized: user account not found' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized: token invalid or expired' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized: no authorization token provided' });
};

export const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (token === 'mock_jwt_token_demo_mode_2026') {
        req.user = memoryStore.users[0];
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_pinterest_jwt_key_2026_xyz');
      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = memoryStore.users.find((u) => u._id === decoded.id) || memoryStore.users[0];
      }
    } catch (error) {
      req.user = memoryStore.users[0];
    }
  }
  next();
};
