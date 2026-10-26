import mongoose from 'mongoose';

const inquiryLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    cemetery: {
      type: String,
      default: '',
    },
    serviceType: {
      type: String,
      required: true,
      default: 'Grave Structure',
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'site_visit', 'quoted', 'in_progress', 'completed', 'archived'],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['normal', 'high', 'urgent'],
      default: 'normal',
    },
    estimatedBudget: {
      type: String,
      default: '',
    },
    assignedTo: {
      type: String,
      default: 'Head Monumental Mason',
    },
    source: {
      type: String,
      enum: ['contact_form', 'quote_calculator', 'phone', 'direct'],
      default: 'contact_form',
    },
    internalNotes: [
      {
        note: { type: String, required: true },
        author: { type: String, default: 'Admin' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

inquiryLeadSchema.index({ status: 1, priority: 1 });
inquiryLeadSchema.index({ name: 'text', email: 'text', cemetery: 'text' });

const InquiryLead =
  mongoose.models.InquiryLead || mongoose.model('InquiryLead', inquiryLeadSchema);

export default InquiryLead;
