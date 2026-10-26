import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['structures', 'monuments', 'engraving', 'restoration', 'masonry'],
      default: 'structures',
    },
    categoryLabel: {
      type: String,
      required: true,
      default: 'Grave Structure',
    },
    material: {
      type: String,
      required: true,
      trim: true,
    },
    dimensions: {
      type: String,
      default: '',
    },
    cemeteryType: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    craftsmanshipNotes: {
      type: String,
      default: '',
    },
    year: {
      type: String,
      default: 'Recent Commission',
    },
    aspectRatio: {
      type: String,
      default: 'standard',
    },
    featured: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

portfolioSchema.index({ category: 1, status: 1 });
portfolioSchema.index({ title: 'text', description: 'text', material: 'text' });

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
