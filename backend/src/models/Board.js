import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Board name is required'],
      trim: true,
      maxlength: 60,
    },
    description: {
      type: String,
      default: '',
      maxlength: 300,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pin',
      },
    ],
    coverImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.model('Board', boardSchema);
export default Board;
