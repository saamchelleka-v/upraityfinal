import express from 'express';
import {
  getInquiries,
  getInquiryById,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  getCRMStats,
  addInquiryNote,
} from '../controllers/crmController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, getCRMStats);

router.route('/inquiries')
  .get(protect, getInquiries)
  .post(createInquiry);

router.route('/inquiries/:id')
  .get(protect, getInquiryById)
  .patch(protect, updateInquiry)
  .delete(protect, deleteInquiry);

router.post('/inquiries/:id/notes', protect, addInquiryNote);

export default router;
