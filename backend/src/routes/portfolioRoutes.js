import express from 'express';
import {
  getPortfolioItems,
  getPortfolioItemById,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getPortfolioItems)
  .post(protect, createPortfolioItem);

router.route('/:id')
  .get(getPortfolioItemById)
  .put(protect, updatePortfolioItem)
  .delete(protect, deletePortfolioItem);

export default router;
