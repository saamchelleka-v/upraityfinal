import express from 'express';
import {
  getPins,
  getPinById,
  createPin,
  deletePin,
  toggleLikePin,
  toggleSavePin,
  addComment,
  deleteComment,
} from '../controllers/pinController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getPins)
  .post(protect, upload.single('image'), createPin);

router.route('/:id')
  .get(optionalAuth, getPinById)
  .delete(protect, deletePin);

router.post('/:id/like', protect, toggleLikePin);
router.post('/:id/save', protect, toggleSavePin);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

export default router;
