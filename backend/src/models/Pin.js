import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

const pinSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Pin title is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      default: '',
      maxlength: 800,
    },
    destinationLink: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    aspectRatio: {
      type: Number,
      default: 1.5, // height / width ratio standard for Pinterest cards
    },
    width: {
      type: Number,
      default: 600,
    },
    height: {
      type: Number,
      default: 900,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    savesCount: {
      type: Number,
      default: 0,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for fast search and filtering
pinSchema.index({ title: 'text', description: 'text', tags: 'text' });
pinSchema.index({ tags: 1 });
pinSchema.index({ createdAt: -1 });

const Pin = mongoose.model('Pin', pinSchema);
export default Pin;
