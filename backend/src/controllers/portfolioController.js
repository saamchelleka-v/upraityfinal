import mongoose from 'mongoose';
import Portfolio from '../models/Portfolio.js';
import { memoryStore } from '../store/memoryStore.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all portfolio items (with category, search, status filter)
// @route   GET /api/portfolio
// @access  Public
export const getPortfolioItems = async (req, res) => {
  try {
    const { category, search, status, sort } = req.query;

    if (!isDBConnected()) {
      let items = [...(memoryStore.portfolio || [])];

      if (category && category.toLowerCase() !== 'all') {
        items = items.filter(
          (item) => item.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (status && status !== 'all') {
        items = items.filter((item) => item.status === status);
      } else if (!status) {
        // Exclude unpublished records for public requests
        items = items.filter((item) => (item.status || 'published') === 'published');
      }

      if (search) {
        const q = search.toLowerCase();
        items = items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.material?.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q) ||
            item.categoryLabel?.toLowerCase().includes(q) ||
            item.cemeteryType?.toLowerCase().includes(q)
        );
      }

      if (sort === 'order') {
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
      } else {
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return res.json({
        success: true,
        count: items.length,
        items,
      });
    }

    const filter = {};
    if (category && category.toLowerCase() !== 'all') {
      filter.category = category;
    }
    if (status && status !== 'all') {
      filter.status = status;
    } else if (!status) {
      filter.status = 'published';
    }

    if (search) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { material: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { categoryLabel: { $regex: q, $options: 'i' } },
        { cemeteryType: { $regex: q, $options: 'i' } },
      ];
    }

    const items = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });
    return res.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error('getPortfolioItems error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single portfolio item by ID
// @route   GET /api/portfolio/:id
// @access  Public
export const getPortfolioItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDBConnected()) {
      const item = memoryStore.portfolio.find((p) => p._id === id || p.id === id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Portfolio item not found' });
      }
      return res.json({ success: true, item });
    }

    const item = await Portfolio.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }
    return res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new portfolio item
// @route   POST /api/portfolio
// @access  Protected
export const createPortfolioItem = async (req, res) => {
  try {
    const {
      title,
      category,
      categoryLabel,
      material,
      dimensions,
      cemeteryType,
      image,
      caption,
      description,
      craftsmanshipNotes,
      year,
      aspectRatio,
      featured,
      status,
      order,
    } = req.body;

    if (!title || !material || !image) {
      return res.status(400).json({
        success: false,
        message: 'Title, material, and image URL are required',
      });
    }

    const categoryMap = {
      structures: 'Grave Structure',
      monuments: 'Granite/Marble Monument',
      engraving: 'Lettering & Engraving',
      restoration: 'Grave Renovation',
      masonry: 'Small Masonry',
    };

    const finalCategory = category || 'structures';
    const finalCategoryLabel = categoryLabel || categoryMap[finalCategory] || 'Monument Work';
    const validAspectRatios = ['tall', 'wide', 'square', 'standard'];
    const finalAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : 'standard';

    if (!isDBConnected()) {
      const newItem = {
        _id: `monument-${Date.now()}`,
        title: title.trim(),
        category: finalCategory,
        categoryLabel: finalCategoryLabel,
        material: material.trim(),
        dimensions: dimensions || '',
        cemeteryType: cemeteryType || '',
        image: image.trim(),
        caption: caption || title,
        description: description || '',
        craftsmanshipNotes: craftsmanshipNotes || '',
        year: year || 'Recent Commission',
        aspectRatio: finalAspectRatio,
        featured: featured !== undefined ? featured : true,
        status: status || 'published',
        order: Number(order) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      memoryStore.portfolio.unshift(newItem);
      return res.status(201).json({ success: true, item: newItem });
    }

    const newItem = await Portfolio.create({
      title: title.trim(),
      category: finalCategory,
      categoryLabel: finalCategoryLabel,
      material: material.trim(),
      dimensions,
      cemeteryType,
      image: image.trim(),
      caption,
      description,
      craftsmanshipNotes,
      year: year || 'Recent Commission',
      aspectRatio: finalAspectRatio,
      featured: featured !== undefined ? featured : true,
      status: status || 'published',
      order: Number(order) || 0,
    });

    return res.status(201).json({ success: true, item: newItem });
  } catch (error) {
    console.error('createPortfolioItem error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Public/Admin
export const updatePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!isDBConnected()) {
      const idx = memoryStore.portfolio.findIndex((p) => p._id === id || p.id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Portfolio item not found' });
      }

      memoryStore.portfolio[idx] = {
        ...memoryStore.portfolio[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return res.json({ success: true, item: memoryStore.portfolio[idx] });
    }

    const updated = await Portfolio.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    return res.json({ success: true, item: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Public/Admin
export const deletePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDBConnected()) {
      const idx = memoryStore.portfolio.findIndex((p) => p._id === id || p.id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Portfolio item not found' });
      }

      const deleted = memoryStore.portfolio.splice(idx, 1)[0];
      return res.json({ success: true, message: 'Portfolio item deleted', item: deleted });
    }

    const deleted = await Portfolio.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    return res.json({ success: true, message: 'Portfolio item deleted', item: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
