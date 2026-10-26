import mongoose from 'mongoose';

const businessContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Quarry & Stone',
        'Cemetery Superintendent',
        'Parish / Church Official',
        'Gilding & Gold Leaf',
        'Logistics & Crane',
        'Architect / Representative',
        'Trade Association / NAMM',
        'Other Partner',
      ],
      default: 'Quarry & Stone',
    },
    roleTitle: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'preferred', 'archived'],
      default: 'active',
    },
    notes: {
      type: String,
      default: '',
    },
    specialties: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

businessContactSchema.index({ category: 1, status: 1 });
businessContactSchema.index({ name: 'text', organization: 'text' });

const BusinessContact =
  mongoose.models.BusinessContact || mongoose.model('BusinessContact', businessContactSchema);

export default BusinessContact;
