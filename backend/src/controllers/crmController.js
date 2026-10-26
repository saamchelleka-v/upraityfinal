import mongoose from 'mongoose';
import InquiryLead from '../models/InquiryLead.js';
import BusinessContact from '../models/BusinessContact.js';
import Portfolio from '../models/Portfolio.js';
import { memoryStore } from '../store/memoryStore.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

export const VALID_STATUSES = ['new', 'contacted', 'site_visit', 'quoted', 'in_progress', 'completed', 'archived'];
export const VALID_PRIORITIES = ['normal', 'high', 'urgent'];

// @desc    Get all CRM inquiries with filters and search
// @route   GET /api/crm/inquiries
// @access  Protected
export const getInquiries = async (req, res) => {
  try {
    const { status, priority, serviceType, search } = req.query;

    if (!isDBConnected()) {
      let leads = [...(memoryStore.inquiries || [])];

      if (status && status.toLowerCase() !== 'all') {
        leads = leads.filter((l) => l.status.toLowerCase() === status.toLowerCase());
      }

      if (priority && priority.toLowerCase() !== 'all') {
        leads = leads.filter((l) => l.priority.toLowerCase() === priority.toLowerCase());
      }

      if (serviceType && serviceType.toLowerCase() !== 'all') {
        leads = leads.filter((l) =>
          l.serviceType?.toLowerCase().includes(serviceType.toLowerCase())
        );
      }

      if (search) {
        const q = search.toLowerCase();
        leads = leads.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.email.toLowerCase().includes(q) ||
            l.phone.toLowerCase().includes(q) ||
            l.cemetery?.toLowerCase().includes(q) ||
            l.message?.toLowerCase().includes(q)
        );
      }

      leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json({
        success: true,
        count: leads.length,
        inquiries: leads,
      });
    }

    const filter = {};
    if (status && status.toLowerCase() !== 'all') {
      filter.status = status;
    }
    if (priority && priority.toLowerCase() !== 'all') {
      filter.priority = priority;
    }
    if (serviceType && serviceType.toLowerCase() !== 'all') {
      filter.serviceType = { $regex: serviceType, $options: 'i' };
    }
    if (search) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { cemetery: { $regex: q, $options: 'i' } },
        { message: { $regex: q, $options: 'i' } },
      ];
    }

    const inquiries = await InquiryLead.find(filter).sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    console.error('getInquiries error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single inquiry by ID
// @route   GET /api/crm/inquiries/:id
// @access  Protected
export const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDBConnected()) {
      const inq = memoryStore.inquiries.find((l) => l._id === id);
      if (!inq) {
        return res.status(404).json({ success: false, message: 'Inquiry not found' });
      }
      return res.json({ success: true, inquiry: inq });
    }

    const inq = await InquiryLead.findById(id);
    if (!inq) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    return res.json({ success: true, inquiry: inq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new inquiry from public contact form or quote calculator
// @route   POST /api/crm/inquiries
// @access  Public
export const createInquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      cemetery,
      serviceType,
      message,
      estimatedBudget,
      source,
    } = req.body;

    if (!name || !name.trim() || !email || !email.trim() || !phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone number are required',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Phone validation
    const cleanedPhone = phone.replace(/[\s()-]/g, '');
    if (cleanedPhone.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const trimmedMessage = (message || '').trim();

    // Prevent duplicate submissions within 60 seconds
    const now = Date.now();
    if (!isDBConnected()) {
      const recentDuplicate = memoryStore.inquiries.find((l) => {
        const timeDiff = now - new Date(l.createdAt).getTime();
        return (
          timeDiff < 60000 &&
          l.email.toLowerCase() === trimmedEmail &&
          l.message === trimmedMessage
        );
      });
      if (recentDuplicate) {
        return res.status(200).json({
          success: true,
          message: 'Your inquiry has already been received. Our stonemasons will follow up shortly.',
          inquiry: recentDuplicate,
        });
      }

      const newInquiry = {
        _id: `inq-${Date.now()}`,
        name: trimmedName,
        email: trimmedEmail,
        phone: phone.trim(),
        cemetery: cemetery ? cemetery.trim() : '',
        serviceType: serviceType || 'Grave Structure',
        message: trimmedMessage,
        status: 'new',
        priority: 'normal',
        estimatedBudget: estimatedBudget || '',
        assignedTo: 'Head Monumental Mason',
        source: source || 'contact_form',
        internalNotes: [
          {
            note: 'Initial web inquiry received via public portal.',
            author: 'System',
            createdAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      memoryStore.inquiries.unshift(newInquiry);
      return res.status(201).json({
        success: true,
        message: 'Thank you. Your consultation inquiry has been logged with our stonemasons.',
        inquiry: newInquiry,
      });
    }

    // MongoDB Mode Duplicate Check
    const recentDuplicate = await InquiryLead.findOne({
      email: trimmedEmail,
      message: trimmedMessage,
      createdAt: { $gte: new Date(Date.now() - 60000) },
    });
    if (recentDuplicate) {
      return res.status(200).json({
        success: true,
        message: 'Your inquiry has already been received. Our stonemasons will follow up shortly.',
        inquiry: recentDuplicate,
      });
    }

    const newInquiry = await InquiryLead.create({
      name: trimmedName,
      email: trimmedEmail,
      phone: phone.trim(),
      cemetery: cemetery ? cemetery.trim() : '',
      serviceType: serviceType || 'Grave Structure',
      message: trimmedMessage,
      status: 'new',
      priority: 'normal',
      estimatedBudget: estimatedBudget || '',
      assignedTo: 'Head Monumental Mason',
      source: source || 'contact_form',
      internalNotes: [
        {
          note: 'Initial web inquiry received via public portal.',
          author: 'System',
          createdAt: new Date(),
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you. Your consultation inquiry has been logged with our stonemasons.',
      inquiry: newInquiry,
    });
  } catch (error) {
    console.error('createInquiry error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inquiry (status, priority, assignedTo, budget, notes)
// @route   PATCH /api/crm/inquiries/:id
// @access  Protected
export const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo, estimatedBudget, note } = req.body;

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid inquiry status "${status}". Allowed values: ${VALID_STATUSES.join(', ')}`,
      });
    }

    // Validate priority if provided
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Invalid priority "${priority}". Allowed values: ${VALID_PRIORITIES.join(', ')}`,
      });
    }

    if (!isDBConnected()) {
      const idx = memoryStore.inquiries.findIndex((l) => l._id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Inquiry not found' });
      }

      const current = memoryStore.inquiries[idx];
      if (status) current.status = status;
      if (priority) current.priority = priority;
      if (assignedTo) current.assignedTo = assignedTo;
      if (estimatedBudget !== undefined) current.estimatedBudget = estimatedBudget;

      if (note && note.trim()) {
        if (!current.internalNotes) current.internalNotes = [];
        current.internalNotes.unshift({
          note: note.trim(),
          author: req.user?.name || req.body.author || 'Admin Mason',
          createdAt: new Date().toISOString(),
        });
      }

      current.updatedAt = new Date().toISOString();
      return res.json({ success: true, inquiry: current });
    }

    const lead = await InquiryLead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    if (status) lead.status = status;
    if (priority) lead.priority = priority;
    if (assignedTo) lead.assignedTo = assignedTo;
    if (estimatedBudget !== undefined) lead.estimatedBudget = estimatedBudget;

    if (note && note.trim()) {
      lead.internalNotes.unshift({
        note: note.trim(),
        author: req.user?.name || req.body.author || 'Admin Mason',
        createdAt: new Date(),
      });
    }

    await lead.save();
    return res.json({ success: true, inquiry: lead });
  } catch (error) {
    console.error('updateInquiry error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add internal note to inquiry
// @route   POST /api/crm/inquiries/:id/notes
// @access  Protected
export const addInquiryNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note, author } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({ success: false, message: 'Note text is required' });
    }

    const noteAuthor = author || req.user?.name || 'Head Mason';
    const noteEntry = {
      note: note.trim(),
      author: noteAuthor,
      createdAt: new Date().toISOString(),
    };

    if (!isDBConnected()) {
      const inq = memoryStore.inquiries.find((l) => l._id === id);
      if (!inq) {
        return res.status(404).json({ success: false, message: 'Inquiry not found' });
      }

      if (!inq.internalNotes) inq.internalNotes = [];
      inq.internalNotes.unshift(noteEntry);
      inq.updatedAt = new Date().toISOString();

      return res.status(201).json({ success: true, note: noteEntry, inquiry: inq });
    }

    const lead = await InquiryLead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    lead.internalNotes.unshift({
      note: note.trim(),
      author: noteAuthor,
      createdAt: new Date(),
    });
    await lead.save();

    return res.status(201).json({ success: true, note: lead.internalNotes[0], inquiry: lead });
  } catch (error) {
    console.error('addInquiryNote error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/crm/inquiries/:id
// @access  Public/Admin
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDBConnected()) {
      const idx = memoryStore.inquiries.findIndex((l) => l._id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Inquiry not found' });
      }

      const deleted = memoryStore.inquiries.splice(idx, 1)[0];
      return res.json({ success: true, message: 'Inquiry deleted', inquiry: deleted });
    }

    const deleted = await InquiryLead.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    return res.json({ success: true, message: 'Inquiry deleted', inquiry: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get CRM and CMS dashboard stats
// @route   GET /api/crm/stats
// @access  Public/Admin
export const getCRMStats = async (req, res) => {
  try {
    if (!isDBConnected()) {
      const inqs = memoryStore.inquiries || [];
      const contacts = memoryStore.contacts || [];
      const portfolio = memoryStore.portfolio || [];

      const statusCounts = {
        new: inqs.filter((i) => i.status === 'new').length,
        contacted: inqs.filter((i) => i.status === 'contacted').length,
        site_visit: inqs.filter((i) => i.status === 'site_visit').length,
        quoted: inqs.filter((i) => i.status === 'quoted').length,
        in_progress: inqs.filter((i) => i.status === 'in_progress').length,
        completed: inqs.filter((i) => i.status === 'completed').length,
        archived: inqs.filter((i) => i.status === 'archived').length,
      };

      const highPriorityCount = inqs.filter((i) => i.priority === 'urgent' || i.priority === 'high').length;

      return res.json({
        success: true,
        stats: {
          totalInquiries: inqs.length,
          newInquiries: statusCounts.new,
          activeInquiries: inqs.filter((i) => !['completed', 'archived'].includes(i.status)).length,
          highPriorityCount,
          statusCounts,
          totalContacts: contacts.length,
          activeContacts: contacts.filter((c) => c.status === 'active' || c.status === 'preferred').length,
          totalPortfolioWorks: portfolio.length,
          publishedPortfolioWorks: portfolio.filter((p) => p.status === 'published').length,
        },
      });
    }

    const [inquiries, totalContacts, activeContacts, totalPortfolio, publishedPortfolio] = await Promise.all([
      InquiryLead.find({}),
      BusinessContact.countDocuments({}),
      BusinessContact.countDocuments({ status: { $in: ['active', 'preferred'] } }),
      Portfolio.countDocuments({}),
      Portfolio.countDocuments({ status: 'published' }),
    ]);

    const statusCounts = {
      new: inquiries.filter((i) => i.status === 'new').length,
      contacted: inquiries.filter((i) => i.status === 'contacted').length,
      site_visit: inquiries.filter((i) => i.status === 'site_visit').length,
      quoted: inquiries.filter((i) => i.status === 'quoted').length,
      in_progress: inquiries.filter((i) => i.status === 'in_progress').length,
      completed: inquiries.filter((i) => i.status === 'completed').length,
      archived: inquiries.filter((i) => i.status === 'archived').length,
    };

    const highPriorityCount = inquiries.filter((i) => i.priority === 'urgent' || i.priority === 'high').length;

    return res.json({
      success: true,
      stats: {
        totalInquiries: inquiries.length,
        newInquiries: statusCounts.new,
        activeInquiries: inquiries.filter((i) => !['completed', 'archived'].includes(i.status)).length,
        highPriorityCount,
        statusCounts,
        totalContacts,
        activeContacts,
        totalPortfolioWorks: totalPortfolio,
        publishedPortfolioWorks: publishedPortfolio,
      },
    });
  } catch (error) {
    console.error('getCRMStats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
