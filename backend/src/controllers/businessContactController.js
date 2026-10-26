import mongoose from 'mongoose';
import BusinessContact from '../models/BusinessContact.js';
import { memoryStore } from '../store/memoryStore.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all business contacts
// @route   GET /api/contacts
// @access  Public/Admin
export const getContacts = async (req, res) => {
  try {
    const { category, search, status } = req.query;

    if (!isDBConnected()) {
      let contacts = [...(memoryStore.contacts || [])];

      if (category && category.toLowerCase() !== 'all') {
        contacts = contacts.filter(
          (c) => c.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (status) {
        contacts = contacts.filter((c) => c.status === status);
      }

      if (search) {
        const q = search.toLowerCase();
        contacts = contacts.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.organization.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q) ||
            c.phone?.toLowerCase().includes(q) ||
            c.notes?.toLowerCase().includes(q) ||
            (c.specialties && c.specialties.some((s) => s.toLowerCase().includes(q)))
        );
      }

      contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json({
        success: true,
        count: contacts.length,
        contacts,
      });
    }

    const filter = {};
    if (category && category.toLowerCase() !== 'all') {
      filter.category = category;
    }
    if (status) {
      filter.status = status;
    }
    if (search) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { organization: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { notes: { $regex: q, $options: 'i' } },
      ];
    }

    const contacts = await BusinessContact.find(filter).sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error('getContacts error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single contact by ID
// @route   GET /api/contacts/:id
// @access  Public/Admin
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDBConnected()) {
      const contact = memoryStore.contacts.find((c) => c._id === id);
      if (!contact) {
        return res.status(404).json({ success: false, message: 'Contact not found' });
      }
      return res.json({ success: true, contact });
    }

    const contact = await BusinessContact.findById(id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    return res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new contact
// @route   POST /api/contacts
// @access  Public/Admin
export const createContact = async (req, res) => {
  try {
    const {
      name,
      organization,
      category,
      roleTitle,
      phone,
      email,
      address,
      status,
      notes,
      specialties,
    } = req.body;

    if (!name || !organization || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, organization/company, and phone number are required',
      });
    }

    if (!isDBConnected()) {
      const newContact = {
        _id: `contact-${Date.now()}`,
        name,
        organization,
        category: category || 'Quarry & Stone',
        roleTitle: roleTitle || '',
        phone,
        email: email || '',
        address: address || '',
        status: status || 'active',
        notes: notes || '',
        specialties: Array.isArray(specialties)
          ? specialties
          : typeof specialties === 'string' && specialties.trim()
          ? specialties.split(',').map((s) => s.trim())
          : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      memoryStore.contacts.unshift(newContact);
      return res.status(201).json({ success: true, contact: newContact });
    }

    const parsedSpecialties = Array.isArray(specialties)
      ? specialties
      : typeof specialties === 'string' && specialties.trim()
      ? specialties.split(',').map((s) => s.trim())
      : [];

    const newContact = await BusinessContact.create({
      name,
      organization,
      category: category || 'Quarry & Stone',
      roleTitle,
      phone,
      email,
      address,
      status: status || 'active',
      notes,
      specialties: parsedSpecialties,
    });

    return res.status(201).json({ success: true, contact: newContact });
  } catch (error) {
    console.error('createContact error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Public/Admin
export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.specialties && typeof updates.specialties === 'string') {
      updates.specialties = updates.specialties.split(',').map((s) => s.trim());
    }

    if (!isDBConnected()) {
      const idx = memoryStore.contacts.findIndex((c) => c._id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Contact not found' });
      }

      memoryStore.contacts[idx] = {
        ...memoryStore.contacts[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return res.json({ success: true, contact: memoryStore.contacts[idx] });
    }

    const updated = await BusinessContact.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    return res.json({ success: true, contact: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Public/Admin
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDBConnected()) {
      const idx = memoryStore.contacts.findIndex((c) => c._id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Contact not found' });
      }

      const deleted = memoryStore.contacts.splice(idx, 1)[0];
      return res.json({ success: true, message: 'Contact deleted', contact: deleted });
    }

    const deleted = await BusinessContact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    return res.json({ success: true, message: 'Contact deleted', contact: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
