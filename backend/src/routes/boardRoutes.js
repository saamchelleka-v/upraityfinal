import express from 'express';
import {
  getUserBoards,
  getBoardById,
  createBoard,
  togglePinInBoard,
  deleteBoard,
} from '../controllers/boardController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createBoard);
router.get('/user/:userId', optionalAuth, getUserBoards);
router.get('/:id', optionalAuth, getBoardById);
router.post('/:id/pins', protect, togglePinInBoard);
router.delete('/:id', protect, deleteBoard);

export default router;
