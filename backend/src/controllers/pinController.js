import mongoose from 'mongoose';
import Pin from '../models/Pin.js';
import User from '../models/User.js';
import Board from '../models/Board.js';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { memoryStore, getUserSummary } from '../store/memoryStore.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all pins with optional search, tag filter, and pagination
// @route   GET /api/pins
// @access  Public
export const getPins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const { search, tag, sort } = req.query;

    if (!isDBConnected()) {
      let filtered = [...memoryStore.pins];

      if (tag && tag.toLowerCase() !== 'all') {
        filtered = filtered.filter((p) =>
          p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
        );
      }

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }

      if (sort === 'popular') {
        filtered.sort((a, b) => (b.savesCount || 0) + (b.likes?.length || 0) - ((a.savesCount || 0) + (a.likes?.length || 0)));
      } else {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      const total = filtered.length;
      const skip = (page - 1) * limit;
      const paginated = filtered.slice(skip, skip + limit);

      const currentUserId = req.user ? req.user._id.toString() : 'user-demo';
      const currentUser = memoryStore.users.find((u) => u._id === currentUserId);
      const savedSet = new Set(currentUser?.savedPins || []);

      const formatted = paginated.map((pin) => ({
        ...pin,
        user: getUserSummary(pin.user),
        likesCount: pin.likes ? pin.likes.length : 0,
        isLiked: pin.likes ? pin.likes.includes(currentUserId) : false,
        isSaved: savedSet.has(pin._id),
      }));

      return res.json({
        pins: formatted,
        page,
        pages: Math.ceil(total / limit) || 1,
        total,
      });
    }

    // MongoDB Connected execution
    const skip = (page - 1) * limit;
    let query = {};

    if (tag && tag.toLowerCase() !== 'all') {
      query.tags = { $in: [new RegExp(`^${tag}$`, 'i')] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'popular') {
      sortOptions = { savesCount: -1, 'likes.length': -1, createdAt: -1 };
    }

    const total = await Pin.countDocuments(query);
    const pins = await Pin.find(query)
      .populate('user', 'name username avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const currentUserId = req.user ? req.user._id.toString() : null;
    let currentUserSavedSet = new Set();
    if (currentUserId) {
      const u = await User.findById(currentUserId).select('savedPins');
      if (u && u.savedPins) {
        currentUserSavedSet = new Set(u.savedPins.map((id) => id.toString()));
      }
    }

    const formattedPins = pins.map((pin) => {
      const pinObj = pin.toObject();
      return {
        ...pinObj,
        likesCount: pinObj.likes ? pinObj.likes.length : 0,
        isLiked: currentUserId && pinObj.likes ? pinObj.likes.some((id) => id.toString() === currentUserId) : false,
        isSaved: currentUserId ? currentUserSavedSet.has(pinObj._id.toString()) : false,
      };
    });

    res.json({
      pins: formattedPins,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single pin by ID
// @route   GET /api/pins/:id
// @access  Public
export const getPinById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDBConnected()) {
      const pin = memoryStore.pins.find((p) => p._id === id);
      if (!pin) {
        return res.status(404).json({ message: 'Pin not found' });
      }

      const currentUserId = req.user ? req.user._id.toString() : 'user-demo';
      const currentUser = memoryStore.users.find((u) => u._id === currentUserId);
      const isSaved = currentUser?.savedPins?.includes(pin._id) || false;

      const populatedComments = (pin.comments || []).map((c) => ({
        ...c,
        user: typeof c.user === 'string' ? getUserSummary(c.user) : c.user,
      }));

      return res.json({
        ...pin,
        user: getUserSummary(pin.user),
        likesCount: pin.likes ? pin.likes.length : 0,
        isLiked: pin.likes ? pin.likes.includes(currentUserId) : false,
        isSaved,
        comments: populatedComments,
      });
    }

    const pin = await Pin.findById(id)
      .populate('user', 'name username avatar bio followers following')
      .populate('comments.user', 'name username avatar');

    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }

    const currentUserId = req.user ? req.user._id.toString() : null;
    let isSaved = false;
    if (currentUserId) {
      const u = await User.findById(currentUserId).select('savedPins');
      if (u && u.savedPins) {
        isSaved = u.savedPins.some((pid) => pid.toString() === pin._id.toString());
      }
    }

    const pinObj = pin.toObject();
    res.json({
      ...pinObj,
      likesCount: pinObj.likes ? pinObj.likes.length : 0,
      isLiked: currentUserId && pinObj.likes ? pinObj.likes.some((pid) => pid.toString() === currentUserId) : false,
      isSaved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new pin
// @route   POST /api/pins
// @access  Private
export const createPin = async (req, res) => {
  try {
    const { title, description, destinationLink, tags, boardId, customImageUrl, aspectRatio } = req.body;

    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
      if (isCloudinaryConfigured && req.file.path) {
        imageUrl = req.file.path;
        imagePublicId = req.file.filename || '';
      } else {
        imageUrl = `/uploads/${req.file.filename}`;
      }
    } else if (customImageUrl) {
      imageUrl = customImageUrl;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image is required to create a pin' });
    }

    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags;
    } else if (typeof tags === 'string') {
      parsedTags = tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0);
    }

    const currentUserId = req.user ? req.user._id.toString() : 'user-demo';

    if (!isDBConnected()) {
      const newPin = {
        _id: 'pin-' + Date.now(),
        title: title || 'Untitled Pin',
        description: description || '',
        destinationLink: destinationLink || '',
        imageUrl,
        imagePublicId,
        aspectRatio: Number(aspectRatio) || 1.4,
        tags: parsedTags,
        user: currentUserId,
        likes: [],
        savesCount: 0,
        comments: [],
        createdAt: new Date().toISOString(),
      };

      memoryStore.pins.unshift(newPin);

      if (boardId) {
        const board = memoryStore.boards.find((b) => b._id === boardId);
        if (board) {
          board.pins.push(newPin._id);
          if (!board.coverImage) board.coverImage = imageUrl;
        }
      }

      return res.status(201).json({
        ...newPin,
        user: getUserSummary(currentUserId),
      });
    }

    const newPin = await Pin.create({
      title: title || 'Untitled Pin',
      description: description || '',
      destinationLink: destinationLink || '',
      imageUrl,
      imagePublicId,
      aspectRatio: Number(aspectRatio) || 1.4,
      tags: parsedTags,
      user: req.user._id,
    });

    if (boardId) {
      const board = await Board.findOne({ _id: boardId, user: req.user._id });
      if (board) {
        board.pins.push(newPin._id);
        if (!board.coverImage) board.coverImage = imageUrl;
        await board.save();
      }
    }

    const populatedPin = await Pin.findById(newPin._id).populate('user', 'name username avatar');
    res.status(201).json(populatedPin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a pin
// @route   DELETE /api/pins/:id
// @access  Private
export const deletePin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDBConnected()) {
      const idx = memoryStore.pins.findIndex((p) => p._id === id);
      if (idx !== -1) {
        memoryStore.pins.splice(idx, 1);
      }
      return res.json({ message: 'Pin deleted successfully' });
    }

    const pin = await Pin.findById(id);
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }

    if (pin.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this pin' });
    }

    if (isCloudinaryConfigured && pin.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(pin.imagePublicId);
      } catch (err) {}
    }

    await Board.updateMany({ pins: pin._id }, { $pull: { pins: pin._id } });
    await User.updateMany({ savedPins: pin._id }, { $pull: { savedPins: pin._id } });
    await pin.deleteOne();
    res.json({ message: 'Pin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle like on pin
// @route   POST /api/pins/:id/like
// @access  Private
export const toggleLikePin = async (req, res) => {
  try {
    const currentUserId = req.user ? req.user._id.toString() : 'user-demo';

    if (!isDBConnected()) {
      const pin = memoryStore.pins.find((p) => p._id === req.params.id);
      if (!pin) {
        return res.status(404).json({ message: 'Pin not found' });
      }

      pin.likes = pin.likes || [];
      const idx = pin.likes.indexOf(currentUserId);
      let isLiked = false;

      if (idx === -1) {
        pin.likes.push(currentUserId);
        isLiked = true;
      } else {
        pin.likes.splice(idx, 1);
        isLiked = false;
      }

      return res.json({
        likesCount: pin.likes.length,
        isLiked,
      });
    }

    const pin = await Pin.findById(req.params.id);
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }

    const idx = pin.likes.findIndex((id) => id.toString() === currentUserId);
    let isLiked = false;

    if (idx === -1) {
      pin.likes.push(req.user._id);
      isLiked = true;
    } else {
      pin.likes.splice(idx, 1);
      isLiked = false;
    }

    await pin.save();
    res.json({
      likesCount: pin.likes.length,
      isLiked,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle save/bookmark pin to user profile
// @route   POST /api/pins/:id/save
// @access  Private
export const toggleSavePin = async (req, res) => {
  try {
    const currentUserId = req.user ? req.user._id.toString() : 'user-demo';

    if (!isDBConnected()) {
      const pin = memoryStore.pins.find((p) => p._id === req.params.id);
      const user = memoryStore.users.find((u) => u._id === currentUserId);
      if (!pin) return res.status(404).json({ message: 'Pin not found' });

      user.savedPins = user.savedPins || [];
      const idx = user.savedPins.indexOf(pin._id);
      let isSaved = false;

      if (idx !== -1) {
        user.savedPins.splice(idx, 1);
        pin.savesCount = Math.max(0, (pin.savesCount || 0) - 1);
        isSaved = false;
      } else {
        user.savedPins.push(pin._id);
        pin.savesCount = (pin.savesCount || 0) + 1;
        isSaved = true;
      }

      return res.json({
        isSaved,
        savesCount: pin.savesCount,
      });
    }

    const pin = await Pin.findById(req.params.id);
    if (!pin) return res.status(404).json({ message: 'Pin not found' });

    const user = await User.findById(req.user._id);
    const pinIdStr = pin._id.toString();
    const isAlreadySaved = user.savedPins.some((id) => id.toString() === pinIdStr);

    let isSaved = false;
    if (isAlreadySaved) {
      user.savedPins = user.savedPins.filter((id) => id.toString() !== pinIdStr);
      pin.savesCount = Math.max(0, (pin.savesCount || 0) - 1);
      isSaved = false;
    } else {
      user.savedPins.push(pin._id);
      pin.savesCount = (pin.savesCount || 0) + 1;
      isSaved = true;
    }

    await user.save();
    await pin.save();

    res.json({
      isSaved,
      savesCount: pin.savesCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to pin
// @route   POST /api/pins/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const currentUserId = req.user ? req.user._id.toString() : 'user-demo';

    if (!isDBConnected()) {
      const pin = memoryStore.pins.find((p) => p._id === req.params.id);
      if (!pin) return res.status(404).json({ message: 'Pin not found' });

      const newComment = {
        _id: 'c-' + Date.now(),
        user: getUserSummary(currentUserId),
        text: text.trim(),
        createdAt: new Date().toISOString(),
      };

      pin.comments = pin.comments || [];
      pin.comments.push(newComment);

      return res.status(201).json(newComment);
    }

    const pin = await Pin.findById(req.params.id);
    if (!pin) return res.status(404).json({ message: 'Pin not found' });

    const comment = {
      user: req.user._id,
      text: text.trim(),
    };

    pin.comments.push(comment);
    await pin.save();

    const updatedPin = await Pin.findById(req.params.id).populate('comments.user', 'name username avatar');
    const addedComment = updatedPin.comments[updatedPin.comments.length - 1];
    res.status(201).json(addedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete comment from pin
// @route   DELETE /api/pins/:id/comments/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    if (!isDBConnected()) {
      const pin = memoryStore.pins.find((p) => p._id === req.params.id);
      if (pin && pin.comments) {
        pin.comments = pin.comments.filter((c) => c._id !== req.params.commentId);
      }
      return res.json({ message: 'Comment removed successfully' });
    }

    const pin = await Pin.findById(req.params.id);
    if (!pin) return res.status(404).json({ message: 'Pin not found' });

    const comment = pin.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isAuthor = comment.user.toString() === req.user._id.toString();
    const isPinOwner = pin.user.toString() === req.user._id.toString();

    if (!isAuthor && !isPinOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    pin.comments.pull(req.params.commentId);
    await pin.save();
    res.json({ message: 'Comment removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
