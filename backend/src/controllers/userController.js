import mongoose from 'mongoose';
import User from '../models/User.js';
import Pin from '../models/Pin.js';
import Board from '../models/Board.js';
import { memoryStore, getUserSummary } from '../store/memoryStore.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

// @desc    Get user public profile by username or id
// @route   GET /api/users/:identifier
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const { identifier } = req.params;

    if (!isDBConnected()) {
      const user = memoryStore.users.find(
        (u) => u._id === identifier || u.username === identifier.toLowerCase()
      );
      if (!user) return res.status(404).json({ message: 'User not found' });

      const pinsCount = memoryStore.pins.filter((p) => p.user === user._id).length;
      const boardsCount = memoryStore.boards.filter((b) => b.user === user._id).length;
      const currentUserId = req.user ? req.user._id.toString() : 'user-demo';
      const isFollowing = user.followers?.includes(currentUserId) || false;

      return res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
        pinsCount,
        boardsCount,
        isFollowing,
      });
    }

    let query = {};
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: identifier }, { username: identifier.toLowerCase() }] };
    } else {
      query = { username: identifier.toLowerCase() };
    }

    const user = await User.findOne(query)
      .select('-password')
      .populate('followers', 'name username avatar')
      .populate('following', 'name username avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pinsCount = await Pin.countDocuments({ user: user._id });
    const boardsCount = await Board.countDocuments({ user: user._id, isPrivate: false });

    const currentUserId = req.user ? req.user._id.toString() : null;
    const isFollowing = currentUserId
      ? user.followers.some((f) => f._id.toString() === currentUserId)
      : false;

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      pinsCount,
      boardsCount,
      isFollowing,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pins created by user
// @route   GET /api/users/:identifier/pins
// @access  Public
export const getUserPins = async (req, res) => {
  try {
    const { identifier } = req.params;

    if (!isDBConnected()) {
      const user = memoryStore.users.find(
        (u) => u._id === identifier || u.username === identifier.toLowerCase()
      );
      if (!user) return res.status(404).json({ message: 'User not found' });

      const pins = memoryStore.pins
        .filter((p) => p.user === user._id)
        .map((p) => ({ ...p, user: getUserSummary(p.user) }));

      return res.json(pins);
    }

    let user;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier);
    } else {
      user = await User.findOne({ username: identifier.toLowerCase() });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pins = await Pin.find({ user: user._id })
      .populate('user', 'name username avatar')
      .sort({ createdAt: -1 });

    res.json(pins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get saved pins of a user
// @route   GET /api/users/:identifier/saved
// @access  Public
export const getUserSavedPins = async (req, res) => {
  try {
    const { identifier } = req.params;

    if (!isDBConnected()) {
      const user = memoryStore.users.find(
        (u) => u._id === identifier || u.username === identifier.toLowerCase()
      );
      if (!user) return res.status(404).json({ message: 'User not found' });

      const savedPins = (user.savedPins || [])
        .map((pid) => {
          const p = memoryStore.pins.find((pin) => pin._id === pid);
          return p ? { ...p, user: getUserSummary(p.user), isSaved: true } : null;
        })
        .filter(Boolean);

      return res.json(savedPins);
    }

    let user;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier);
    } else {
      user = await User.findOne({ username: identifier.toLowerCase() });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const populatedUser = await User.findById(user._id).populate({
      path: 'savedPins',
      populate: { path: 'user', select: 'name username avatar' },
    });

    res.json(populatedUser.savedPins || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Follow or unfollow user
// @route   POST /api/users/:id/follow
// @access  Private
export const toggleFollowUser = async (req, res) => {
  try {
    const currentUserId = req.user ? req.user._id.toString() : 'user-demo';

    if (currentUserId === req.params.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    if (!isDBConnected()) {
      const targetUser = memoryStore.users.find((u) => u._id === req.params.id);
      const currentUser = memoryStore.users.find((u) => u._id === currentUserId);

      if (!targetUser) return res.status(404).json({ message: 'User not found' });

      targetUser.followers = targetUser.followers || [];
      currentUser.following = currentUser.following || [];

      const idx = targetUser.followers.indexOf(currentUserId);
      let isFollowing = false;

      if (idx !== -1) {
        targetUser.followers.splice(idx, 1);
        const fIdx = currentUser.following.indexOf(targetUser._id);
        if (fIdx !== -1) currentUser.following.splice(fIdx, 1);
        isFollowing = false;
      } else {
        targetUser.followers.push(currentUserId);
        currentUser.following.push(targetUser._id);
        isFollowing = true;
      }

      return res.json({
        isFollowing,
        followersCount: targetUser.followers.length,
      });
    }

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = targetUser.followers.some(
      (id) => id.toString() === currentUser._id.toString()
    );

    if (isFollowing) {
      targetUser.followers.pull(currentUser._id);
      currentUser.following.pull(targetUser._id);
    } else {
      targetUser.followers.push(currentUser._id);
      currentUser.following.push(targetUser._id);
    }

    await targetUser.save();
    await currentUser.save();

    res.json({
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
