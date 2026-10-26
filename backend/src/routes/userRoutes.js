import express from 'express';
import {
  getUserProfile,
  getUserPins,
  getUserSavedPins,
  toggleFollowUser,
} from '../controllers/userController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:identifier', optionalAuth, getUserProfile);
router.get('/:identifier/pins', optionalAuth, getUserPins);
router.get('/:identifier/saved', optionalAuth, getUserSavedPins);
router.post('/:id/follow', protect, toggleFollowUser);

export default router;
