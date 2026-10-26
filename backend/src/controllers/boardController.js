import mongoose from 'mongoose';
import Board from '../models/Board.js';
import Pin from '../models/Pin.js';
import { memoryStore, getUserSummary } from '../store/memoryStore.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

// @desc    Get user boards
// @route   GET /api/boards/user/:userId
// @access  Public
export const getUserBoards = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isDBConnected()) {
      const isOwner = req.user && req.user._id.toString() === userId;
      let boards = memoryStore.boards.filter((b) => b.user === userId || (!b.user && userId === 'user-demo'));

      if (!isOwner) {
        boards = boards.filter((b) => !b.isPrivate);
      }

      const populatedBoards = boards.map((b) => {
        const pinObjs = (b.pins || [])
          .map((pid) => memoryStore.pins.find((p) => p._id === pid))
          .filter(Boolean)
          .slice(0, 4);

        return {
          ...b,
          user: getUserSummary(b.user),
          pins: pinObjs,
        };
      });

      return res.json(populatedBoards);
    }

    const isOwner = req.user && req.user._id.toString() === userId;
    const filter = { user: userId };
    if (!isOwner) {
      filter.isPrivate = false;
    }

    const boards = await Board.find(filter)
      .populate('user', 'name username avatar')
      .populate({
        path: 'pins',
        select: 'imageUrl title aspectRatio',
        options: { limit: 4 },
      })
      .sort({ createdAt: -1 });

    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single board by ID with its pins
// @route   GET /api/boards/:id
// @access  Public
export const getBoardById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDBConnected()) {
      const board = memoryStore.boards.find((b) => b._id === id);
      if (!board) return res.status(404).json({ message: 'Board not found' });

      const pinObjs = (board.pins || []).map((pid) => {
        const p = memoryStore.pins.find((pin) => pin._id === pid);
        return p ? { ...p, user: getUserSummary(p.user) } : null;
      }).filter(Boolean);

      return res.json({
        ...board,
        user: getUserSummary(board.user),
        pins: pinObjs,
      });
    }

    const board = await Board.findById(id)
      .populate('user', 'name username avatar')
      .populate({
        path: 'pins',
        populate: {
          path: 'user',
          select: 'name username avatar',
        },
      });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const isOwner = req.user && req.user._id.toString() === board.user._id.toString();
    if (board.isPrivate && !isOwner) {
      return res.status(403).json({ message: 'This board is private' });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new board
// @route   POST /api/boards
// @access  Private
export const createBoard = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Board name is required' });
    }

    const currentUserId = req.user ? req.user._id.toString() : 'user-demo';

    if (!isDBConnected()) {
      const newBoard = {
        _id: 'board-' + Date.now(),
        name: name.trim(),
        description: description || '',
        isPrivate: Boolean(isPrivate),
        user: currentUserId,
        pins: [],
        createdAt: new Date().toISOString(),
      };
      memoryStore.boards.unshift(newBoard);
      return res.status(201).json(newBoard);
    }

    const board = await Board.create({
      name: name.trim(),
      description: description || '',
      isPrivate: Boolean(isPrivate),
      user: req.user._id,
      pins: [],
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add or remove pin from board
// @route   POST /api/boards/:id/pins
// @access  Private
export const togglePinInBoard = async (req, res) => {
  try {
    const { pinId } = req.body;
    if (!pinId) {
      return res.status(400).json({ message: 'pinId is required' });
    }

    if (!isDBConnected()) {
      const board = memoryStore.boards.find((b) => b._id === req.params.id);
      if (!board) return res.status(404).json({ message: 'Board not found' });

      board.pins = board.pins || [];
      const idx = board.pins.indexOf(pinId);
      let added = false;

      if (idx === -1) {
        board.pins.push(pinId);
        added = true;
        const pin = memoryStore.pins.find((p) => p._id === pinId);
        if (pin && !board.coverImage) board.coverImage = pin.imageUrl;
      } else {
        board.pins.splice(idx, 1);
        added = false;
      }

      return res.json({ message: added ? 'Pin added to board' : 'Pin removed from board', added, board });
    }

    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    if (board.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this board' });
    }

    const pin = await Pin.findById(pinId);
    if (!pin) return res.status(404).json({ message: 'Pin not found' });

    const pinIndex = board.pins.findIndex((id) => id.toString() === pinId);
    let added = false;

    if (pinIndex === -1) {
      board.pins.push(pin._id);
      added = true;
      if (!board.coverImage) board.coverImage = pin.imageUrl;
    } else {
      board.pins.splice(pinIndex, 1);
      added = false;
      if (board.pins.length === 0) board.coverImage = '';
    }

    await board.save();
    res.json({ message: added ? 'Pin added to board' : 'Pin removed from board', added, board });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private
export const deleteBoard = async (req, res) => {
  try {
    if (!isDBConnected()) {
      const idx = memoryStore.boards.findIndex((b) => b._id === req.params.id);
      if (idx !== -1) memoryStore.boards.splice(idx, 1);
      return res.json({ message: 'Board deleted successfully' });
    }

    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    if (board.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this board' });
    }

    await board.deleteOne();
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
