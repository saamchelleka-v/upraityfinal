'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Layers,
  Camera,
  Inbox,
  Users,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  ExternalLink,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Building,
  Sparkles,
  ArrowUpRight,
  MessageSquare,
  FileText,
  X,
  Loader2,
  RefreshCw,
  Copy,
  Kanban,
  Table as TableIcon,
  Check,
  Database,
  Calendar,
  Clock,
  Send,
  MoreVertical,
} from 'lucide-react';
import { AdminSidebar, AdminSection } from '../../components/AdminSidebar';
import { ThemeToggle } from '../../components/ThemeToggle';
import { UPRAITY_DATA, UpraityItem } from '../../data/upraityData';
import {
  PortfolioItem,
  BusinessContact,
  InquiryLead,
  CRMStats,
  InquiryStatus,
  InquiryPriority,
  ContactCategory,
} from '../../types/cms';
import {
  fetchPortfolioItems,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  fetchBusinessContacts,
  createBusinessContact,
  updateBusinessContact,
  deleteBusinessContact,
  fetchInquiries,
  updateInquiry,
  addInquiryNote,
  deleteInquiry,
  fetchCRMStats,
  fetchHealthStatus,
  HealthStatus,
} from '../../services/cmsApi';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Data States
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryLead[]>([]);
  const [contacts, setContacts] = useState<BusinessContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Confirmation Modal
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: async () => {},
  });

  // ========================
  // Filters & Pagination
  // ========================
  // Global quick search in top toolbar
  const [globalSearch, setGlobalSearch] = useState('');

  // Portfolio Filters & Pagination
  const [portfolioCategory, setPortfolioCategory] = useState<string>('all');
  const [portfolioStatus, setPortfolioStatus] = useState<string>('all');
  const [portfolioPage, setPortfolioPage] = useState(1);
  const itemsPerPage = 10;

  // Gallery Filters
  const [galleryCategory, setGalleryCategory] = useState<string>('all');
  const [activeGalleryPreview, setActiveGalleryPreview] = useState<UpraityItem | null>(null);

  // CRM Filters & Views
  const [crmViewMode, setCrmViewMode] = useState<'table' | 'kanban'>('table');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');
  const [inquiryPriorityFilter, setInquiryPriorityFilter] = useState<string>('all');

  // Contact Filters
  const [contactCategoryFilter, setContactCategoryFilter] = useState<string>('all');

  // ========================
  // Modals & Drawers
  // ========================
  // Portfolio Modal
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<PortfolioItem | null>(null);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [portfolioFormData, setPortfolioFormData] = useState({
    title: '',
    category: 'structures' as PortfolioItem['category'],
    categoryLabel: 'Grave Structure',
    material: '',
    dimensions: '',
    cemeteryType: '',
    image: '',
    caption: '',
    description: '',
    craftsmanshipNotes: '',
    year: '2026 Commission',
    aspectRatio: 'standard' as 'tall' | 'wide' | 'square' | 'standard',
    status: 'published' as 'published' | 'draft',
    featured: true,
  });

  // Contact Modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<BusinessContact | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    organization: '',
    category: 'Quarry & Stone' as ContactCategory,
    roleTitle: '',
    phone: '',
    email: '',
    address: '',
    status: 'active' as 'active' | 'preferred' | 'archived',
    notes: '',
    specialties: '',
  });

  // Inquiry Inspection Drawer
  const [activeInquiryModal, setActiveInquiryModal] = useState<InquiryLead | null>(null);
  const [newInternalNote, setNewInternalNote] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  // ========================
  // Initial Data Loading
  // ========================
  const loadAllData = async () => {
    try {
      setRefreshing(true);
      const [statsData, portfolioData, inqData, contactData, health] = await Promise.all([
        fetchCRMStats(),
        fetchPortfolioItems({ status: 'all' }),
        fetchInquiries(),
        fetchBusinessContacts(),
        fetchHealthStatus(),
      ]);
      setStats(statsData);
      setPortfolioItems(portfolioData);
      setInquiries(inqData);
      setContacts(contactData);
      setHealthStatus(health);
    } catch (err) {
      console.error('Error loading admin data:', err);
      addToast('Could not reach backend API server', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // ========================
  // Portfolio Operations
  // ========================
  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setPortfolioError(null);

    if (!portfolioFormData.title.trim()) {
      setPortfolioError('Please enter a monument title');
      return;
    }
    if (!portfolioFormData.material.trim()) {
      setPortfolioError('Please enter stone/granite material specification');
      return;
    }
    if (!portfolioFormData.image.trim()) {
      setPortfolioError('Please provide an image path or URL');
      return;
    }

    setIsActionLoading(true);
    try {
      if (editingPortfolioItem) {
        const updated = await updatePortfolioItem(editingPortfolioItem._id, portfolioFormData);
        setPortfolioItems((prev) =>
          prev.map((item) => (item._id === updated._id ? updated : item))
        );
        addToast(`Updated "${updated.title}"`);
      } else {
        const created = await createPortfolioItem(portfolioFormData);
        setPortfolioItems((prev) => [created, ...prev]);
        addToast(`Created "${created.title}"`);
      }
      setIsPortfolioModalOpen(false);
      setEditingPortfolioItem(null);
      fetchCRMStats().then(setStats);
    } catch (err: any) {
      setPortfolioError(err.message || 'Error saving portfolio item');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleTogglePublished = async (item: PortfolioItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      const updated = await updatePortfolioItem(item._id, { status: newStatus });
      setPortfolioItems((prev) =>
        prev.map((i) => (i._id === updated._id ? updated : i))
      );
      addToast(`Status changed to ${newStatus}`);
      fetchCRMStats().then(setStats);
    } catch (err: any) {
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDeletePortfolio = (id: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Portfolio Monument',
      description: `Are you sure you want to remove "${title}"? This will unpublish the work from the catalog.`,
      confirmLabel: 'Delete Monument',
      onConfirm: async () => {
        try {
          await deletePortfolioItem(id);
          setPortfolioItems((prev) => prev.filter((item) => item._id !== id));
          addToast(`Removed "${title}" from portfolio`);
          fetchCRMStats().then(setStats);
        } catch (err: any) {
          addToast(err.message || 'Error deleting item', 'error');
        }
      },
    });
  };

  const openCreatePortfolio = () => {
    setPortfolioError(null);
    setEditingPortfolioItem(null);
    setPortfolioFormData({
      title: '',
      category: 'structures',
      categoryLabel: 'Grave Structure',
      material: 'Grade-A Shanxi Black Granite',
      dimensions: '6ft 6in x 2ft 6in',
      cemeteryType: 'Traditional Kerbed Section',
      image: '/gallery/sample.jpg',
      caption: 'Full kerb structure with precision laser leveling',
      description: 'Solid granite structure engineered with BRAMM ground anchors.',
      craftsmanshipNotes: 'Installed over solid concrete ground piers with stainless dowels.',
      year: '2026 Commission',
      aspectRatio: 'standard',
      status: 'published',
      featured: true,
    });
    setIsPortfolioModalOpen(true);
  };

  const openEditPortfolio = (item: PortfolioItem) => {
    setPortfolioError(null);
    setEditingPortfolioItem(item);
    setPortfolioFormData({
      title: item.title,
      category: item.category,
      categoryLabel: item.categoryLabel,
      material: item.material,
      dimensions: item.dimensions || '',
      cemeteryType: item.cemeteryType || '',
      image: item.image,
      caption: item.caption || '',
      description: item.description || '',
      craftsmanshipNotes: item.craftsmanshipNotes || '',
      year: item.year || '2026 Commission',
      aspectRatio: (item.aspectRatio as any) || 'standard',
      status: item.status,
      featured: item.featured ?? true,
    });
    setIsPortfolioModalOpen(true);
  };

  // ========================
  // Trade Directory Operations
  // ========================
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);

    if (!contactFormData.name.trim() || !contactFormData.organization.trim() || !contactFormData.phone.trim()) {
      setContactError('Contact name, company/organization, and phone number are required');
      return;
    }

    setIsActionLoading(true);
    try {
      const payload = {
        ...contactFormData,
        specialties: contactFormData.specialties
          ? contactFormData.specialties.split(',').map((s) => s.trim())
          : [],
      };

      if (editingContact) {
        const updated = await updateBusinessContact(editingContact._id, payload);
        setContacts((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c))
        );
        addToast(`Updated partner "${updated.name}"`);
      } else {
        const created = await createBusinessContact(payload);
        setContacts((prev) => [created, ...prev]);
        addToast(`Added partner "${created.name}"`);
      }
      setIsContactModalOpen(false);
      setEditingContact(null);
      fetchCRMStats().then(setStats);
    } catch (err: any) {
      setContactError(err.message || 'Error saving contact');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteContact = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Business Contact',
      description: `Are you sure you want to remove "${name}" from the supplier directory?`,
      confirmLabel: 'Remove Contact',
      onConfirm: async () => {
        try {
          await deleteBusinessContact(id);
          setContacts((prev) => prev.filter((c) => c._id !== id));
          addToast(`Removed "${name}" from directory`);
          fetchCRMStats().then(setStats);
        } catch (err: any) {
          addToast(err.message || 'Error deleting contact', 'error');
        }
      },
    });
  };

  const openCreateContact = () => {
    setContactError(null);
    setEditingContact(null);
    setContactFormData({
      name: '',
      organization: '',
      category: 'Quarry & Stone',
      roleTitle: '',
      phone: '+44 (0) ',
      email: '',
      address: '',
      status: 'active',
      notes: '',
      specialties: 'Granite Blocks, Honed Slabs',
    });
    setIsContactModalOpen(true);
  };

  const openEditContact = (contact: BusinessContact) => {
    setContactError(null);
    setEditingContact(contact);
    setContactFormData({
      name: contact.name,
      organization: contact.organization,
      category: contact.category,
      roleTitle: contact.roleTitle || '',
      phone: contact.phone,
      email: contact.email || '',
      address: contact.address || '',
      status: contact.status,
      notes: contact.notes || '',
      specialties: contact.specialties ? contact.specialties.join(', ') : '',
    });
    setIsContactModalOpen(true);
  };

  // ========================
  // CRM Inquiry Operations
  // ========================
  const handleUpdateInquiryStatus = async (
    id: string,
    newStatus: InquiryStatus,
    updates: Partial<{ priority: InquiryPriority; estimatedBudget: string; assignedTo: string }> = {}
  ) => {
    try {
      const updated = await updateInquiry(id, {
        status: newStatus,
        ...updates,
      });
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === updated._id ? updated : inq))
      );
      if (activeInquiryModal && activeInquiryModal._id === id) {
        setActiveInquiryModal(updated);
      }
      addToast(`Moved lead to "${newStatus.replace('_', ' ')}"`);
      fetchCRMStats().then(setStats);
    } catch (err: any) {
      addToast(err.message || 'Failed to update stage', 'error');
    }
  };

  const handleAddNoteToLead = async (inquiryId: string) => {
    if (!newInternalNote.trim()) return;
    setIsActionLoading(true);
    try {
      const res = await addInquiryNote(inquiryId, {
        note: newInternalNote.trim(),
        author: 'Head Mason',
      });
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === res.inquiry._id ? res.inquiry : inq))
      );
      if (activeInquiryModal && activeInquiryModal._id === inquiryId) {
        setActiveInquiryModal(res.inquiry);
      }
      setNewInternalNote('');
      addToast('Note logged to inquiry record');
    } catch (err: any) {
      addToast(err.message || 'Failed to add note', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteInquiry = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Customer Inquiry',
      description: `Permanently delete consultation request from "${name}"? This removes all historical notes.`,
      confirmLabel: 'Delete Inquiry',
      onConfirm: async () => {
        try {
          await deleteInquiry(id);
          setInquiries((prev) => prev.filter((inq) => inq._id !== id));
          setActiveInquiryModal(null);
          addToast(`Deleted inquiry from "${name}"`);
          fetchCRMStats().then(setStats);
        } catch (err: any) {
          addToast(err.message || 'Failed to delete inquiry', 'error');
        }
      },
    });
  };

  // Clipboard copy helper
  const copyToClipboard = (text: string, label: string = 'Copied') => {
    navigator.clipboard.writeText(text);
    addToast(`${label} copied to clipboard`);
  };

  // ========================
  // Filtered Computed Data
  // ========================
  const filteredPortfolio = useMemo(() => {
    return portfolioItems.filter((item) => {
      const matchesCategory =
        portfolioCategory === 'all' || item.category === portfolioCategory;
      const matchesStatus =
        portfolioStatus === 'all' || item.status === portfolioStatus;
      const q = globalSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.material.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.cemeteryType && item.cemeteryType.toLowerCase().includes(q));
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [portfolioItems, portfolioCategory, portfolioStatus, globalSearch]);

  const paginatedPortfolio = useMemo(() => {
    const start = (portfolioPage - 1) * itemsPerPage;
    return filteredPortfolio.slice(start, start + itemsPerPage);
  }, [filteredPortfolio, portfolioPage]);

  const totalPortfolioPages = Math.ceil(filteredPortfolio.length / itemsPerPage) || 1;

  const filteredGallery = useMemo(() => {
    return UPRAITY_DATA.filter((item) => {
      const matchesCategory =
        galleryCategory === 'all' || item.category === galleryCategory;
      const q = globalSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.material.toLowerCase().includes(q) ||
        item.image.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [galleryCategory, globalSearch]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesStatus =
        inquiryStatusFilter === 'all' || inq.status === inquiryStatusFilter;
      const matchesPriority =
        inquiryPriorityFilter === 'all' || inq.priority === inquiryPriorityFilter;
      const q = globalSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.phone.includes(q) ||
        (inq.cemetery && inq.cemetery.toLowerCase().includes(q)) ||
        (inq.serviceType && inq.serviceType.toLowerCase().includes(q));
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [inquiries, inquiryStatusFilter, inquiryPriorityFilter, globalSearch]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesCategory =
        contactCategoryFilter === 'all' || c.category === contactCategoryFilter;
      const q = globalSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.organization.toLowerCase().includes(q) ||
        (c.roleTitle && c.roleTitle.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q)) ||
        (c.notes && c.notes.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [contacts, contactCategoryFilter, globalSearch]);

  // Stage Helpers
  const STAGES: { id: InquiryStatus; label: string; dotColor: string }[] = [
    { id: 'new', label: 'New Entry', dotColor: 'bg-blue-500' },
    { id: 'contacted', label: 'Contacted', dotColor: 'bg-cyan-500' },
    { id: 'site_visit', label: 'Site Visit', dotColor: 'bg-purple-500' },
    { id: 'quoted', label: 'Estimate Sent', dotColor: 'bg-amber-500' },
    { id: 'in_progress', label: 'In Workshop', dotColor: 'bg-indigo-500' },
    { id: 'completed', label: 'Completed', dotColor: 'bg-emerald-500' },
  ];

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            New
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Contacted
          </span>
        );
      case 'site_visit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Site Visit
          </span>
        );
      case 'quoted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Estimate Sent
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            In Workshop
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );
      case 'archived':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            Archived
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: InquiryPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50">
            URGENT
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
            HIGH
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
            NORMAL
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9F9FB] dark:bg-[#0F0F11] text-neutral-900 dark:text-neutral-100 antialiased font-sans">
      {/* Redesigned Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          setPortfolioPage(1);
        }}
        newInquiriesCount={stats?.newInquiries || 0}
        totalPortfolioCount={portfolioItems.length}
        totalContactsCount={contacts.length}
        totalGalleryCount={UPRAITY_DATA.length}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Workspace Shell */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          isSidebarCollapsed ? 'md:pl-18' : 'md:pl-64'
        }`}
      >
        {/* Compact Top Toolbar */}
        <header className="sticky top-0 z-30 h-14 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between px-4 sm:px-6">
          {/* Breadcrumb & Section Name */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400 font-mono hidden sm:inline">Workspace</span>
            <span className="text-neutral-300 dark:text-neutral-600 hidden sm:inline">/</span>
            <span className="font-semibold text-neutral-900 dark:text-white capitalize">
              {activeSection === 'crm' ? 'Client Inquiries' : activeSection}
            </span>

            {/* Storage Mode Status Pill */}
            {healthStatus && (
              <span
                title={
                  healthStatus.database.connected
                    ? 'Connected to permanent MongoDB storage'
                    : 'Operating on zero-config in-memory store (changes reset on restart)'
                }
                className={`ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                  healthStatus.database.connected
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40'
                    : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/40'
                }`}
              >
                <Database size={10} />
                <span className="hidden sm:inline">
                  {healthStatus.database.connected ? 'MongoDB Active' : 'Memory Store'}
                </span>
              </span>
            )}
          </div>

          {/* Quick Global Search, Theme & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Contextual search input */}
            <div className="relative w-36 sm:w-56">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Filter current view..."
                className="w-full pl-8 pr-2.5 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#8B7355] border border-transparent focus:border-[#8B7355]"
              />
              {globalSearch && (
                <button
                  type="button"
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Refresh Data Button */}
            <button
              type="button"
              onClick={loadAllData}
              disabled={refreshing}
              title="Refresh data from server"
              className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle variant="compact" />

            {/* Section Primary Context Action */}
            {activeSection === 'portfolio' && (
              <button
                type="button"
                onClick={openCreatePortfolio}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#8B7355] hover:bg-[#786348] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <Plus size={13} />
                <span className="hidden sm:inline">Add Monument</span>
              </button>
            )}

            {activeSection === 'contacts' && (
              <button
                type="button"
                onClick={openCreateContact}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#8B7355] hover:bg-[#786348] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <Plus size={13} />
                <span className="hidden sm:inline">Add Partner</span>
              </button>
            )}
          </div>
        </header>

        {/* Workspace Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* ========================================================= */}
          {/* 1. OVERVIEW DASHBOARD */}
          {/* ========================================================= */}
          {activeSection === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-serif">
                    Operational Overview
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Live operational metrics, inquiry pipeline activity, and portfolio catalog records.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openCreatePortfolio}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#8B7355] text-white text-xs font-medium hover:bg-[#786348] transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>New Monument</span>
                  </button>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Metric 1 */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#161619] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider font-medium">Total Inquiries</span>
                    <Inbox size={15} />
                  </div>
                  <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
                    {stats?.totalInquiries ?? inquiries.length}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {stats?.newInquiries ?? 0} new
                    </span>
                    <span>awaiting initial mason contact</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#161619] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider font-medium">Active Pipeline</span>
                    <Clock size={15} />
                  </div>
                  <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
                    {stats?.activeInquiries ?? inquiries.filter(i => !['completed', 'archived'].includes(i.status)).length}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
                    <span>Inquiries in progress or visit</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#161619] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider font-medium">Published Works</span>
                    <Layers size={15} />
                  </div>
                  <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
                    {stats?.publishedPortfolioWorks ?? portfolioItems.filter(p => p.status === 'published').length}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    <span>Active on public website catalog</span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#161619] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider font-medium">Trade Partners</span>
                    <Users size={15} />
                  </div>
                  <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
                    {contacts.length}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    <span>Quarries & cemetery authorities</span>
                  </div>
                </div>
              </div>

              {/* Recent Inquiries List */}
              <div className="rounded-xl bg-white dark:bg-[#161619] border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Recent Inquiries
                    </h3>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Latest customer consultation and memorial requests.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSection('crm')}
                    className="text-xs font-medium text-[#8B7355] hover:text-[#786348] flex items-center gap-1"
                  >
                    <span>View all inquiries</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="divide-y divide-neutral-200/60 dark:divide-neutral-800/80">
                  {inquiries.slice(0, 5).map((inq) => (
                    <div
                      key={inq._id}
                      onClick={() => setActiveInquiryModal(inq)}
                      className="p-3.5 sm:px-4 flex items-center justify-between hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-700 dark:text-neutral-300 shrink-0">
                          {inq.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                            {inq.name}
                          </div>
                          <div className="text-[11px] text-neutral-500 truncate flex items-center gap-1.5">
                            <span>{inq.serviceType}</span>
                            <span>•</span>
                            <span>{inq.cemetery || 'Churchyard/Cemetery not specified'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:block">{getPriorityBadge(inq.priority)}</div>
                        <div>{getStatusBadge(inq.status)}</div>
                        <ChevronRight size={14} className="text-neutral-400" />
                      </div>
                    </div>
                  ))}

                  {inquiries.length === 0 && (
                    <div className="p-8 text-center text-xs text-neutral-400">
                      No customer inquiries logged yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. PORTFOLIO MANAGEMENT */}
          {/* ========================================================= */}
          {activeSection === 'portfolio' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-serif">
                    Portfolio Catalog
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Manage monuments, grave structures, and hand-carved commissions.
                  </p>
                </div>

                {/* Filter selects */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={portfolioCategory}
                    onChange={(e) => {
                      setPortfolioCategory(e.target.value);
                      setPortfolioPage(1);
                    }}
                    className="px-2.5 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="structures">Grave Structures</option>
                    <option value="monuments">Monuments</option>
                    <option value="engraving">Engraving & Lettering</option>
                    <option value="restoration">Renovation</option>
                    <option value="masonry">Small Masonry</option>
                  </select>

                  <select
                    value={portfolioStatus}
                    onChange={(e) => {
                      setPortfolioStatus(e.target.value);
                      setPortfolioPage(1);
                    }}
                    className="px-2.5 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>

                  <button
                    type="button"
                    onClick={openCreatePortfolio}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#8B7355] text-white text-xs font-semibold hover:bg-[#786348] transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>New Monument</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="rounded-xl bg-white dark:bg-[#161619] border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-[11px] font-mono uppercase text-neutral-400">
                        <th className="py-2.5 px-4 w-14">Image</th>
                        <th className="py-2.5 px-4">Title & Details</th>
                        <th className="py-2.5 px-4">Material Spec</th>
                        <th className="py-2.5 px-4">Category</th>
                        <th className="py-2.5 px-4">Aspect</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/80">
                      {paginatedPortfolio.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                        >
                          {/* Thumbnail */}
                          <td className="py-2.5 px-4">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-900 relative shrink-0 border border-black/10 dark:border-white/10">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          </td>

                          {/* Title */}
                          <td className="py-2.5 px-4 max-w-xs">
                            <div className="font-semibold text-neutral-900 dark:text-white truncate">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-neutral-500 truncate">
                              {item.dimensions || item.cemeteryType || item.year || 'Standard Commission'}
                            </div>
                          </td>

                          {/* Material */}
                          <td className="py-2.5 px-4 text-neutral-600 dark:text-neutral-400 truncate max-w-xs">
                            {item.material}
                          </td>

                          {/* Category */}
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                              {item.categoryLabel || item.category}
                            </span>
                          </td>

                          {/* Aspect Ratio */}
                          <td className="py-2.5 px-4">
                            <span className="text-[10px] font-mono text-neutral-400 capitalize">
                              {item.aspectRatio || 'standard'}
                            </span>
                          </td>

                          {/* Status toggle pill */}
                          <td className="py-2.5 px-4">
                            <button
                              type="button"
                              onClick={() => handleTogglePublished(item)}
                              title="Click to toggle status"
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors cursor-pointer ${
                                item.status === 'published'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                              />
                              <span className="capitalize">{item.status}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => openEditPortfolio(item)}
                                className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                title="Edit Monument"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePortfolio(item._id, item.title)}
                                className="p-1.5 rounded text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                                title="Delete Monument"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {paginatedPortfolio.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-neutral-400">
                            No portfolio monuments found matching your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-3 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                  <span>
                    Showing {paginatedPortfolio.length} of {filteredPortfolio.length} works
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={portfolioPage <= 1}
                      onClick={() => setPortfolioPage((p) => Math.max(1, p - 1))}
                      className="px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="font-mono text-[11px]">
                      {portfolioPage} / {totalPortfolioPages}
                    </span>
                    <button
                      type="button"
                      disabled={portfolioPage >= totalPortfolioPages}
                      onClick={() => setPortfolioPage((p) => Math.min(totalPortfolioPages, p + 1))}
                      className="px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. GALLERY MANAGEMENT */}
          {/* ========================================================= */}
          {activeSection === 'gallery' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-serif">
                    Gallery Archival Imagery
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Browse the 101 archival heritage photographs. Click any item to inspect or copy asset path.
                  </p>
                </div>

                {/* Category filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={galleryCategory}
                    onChange={(e) => setGalleryCategory(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                  >
                    <option value="all">All Archive Images (101)</option>
                    <option value="structures">Grave Structures</option>
                    <option value="monuments">Monuments</option>
                    <option value="engraving">Engraving & Lettering</option>
                    <option value="restoration">Renovation</option>
                    <option value="masonry">Small Masonry</option>
                  </select>
                </div>
              </div>

              {/* Grid of gallery assets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {filteredGallery.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-lg bg-white dark:bg-[#161619] border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xs hover:border-[#8B7355]/60 transition-all flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => setActiveGalleryPreview(item)}
                      className="relative w-full aspect-4/3 bg-neutral-900 overflow-hidden cursor-pointer"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye size={20} className="text-white drop-shadow-md" />
                      </div>
                    </div>

                    {/* Metadata Card Footer */}
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] font-semibold text-neutral-900 dark:text-white truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono truncate mt-0.5">
                          {item.image}
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                        <span className="text-[9px] font-mono uppercase text-neutral-400">
                          {item.categoryLabel}
                        </span>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.image, 'Image Path')}
                          title="Copy image path to clipboard"
                          className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          <Copy size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. CRM INQUIRIES */}
          {/* ========================================================= */}
          {activeSection === 'crm' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-serif">
                    Client Inquiries Pipeline
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Track consultation leads from initial inquiry to workshop completion.
                  </p>
                </div>

                {/* View switcher & Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* View mode toggle */}
                  <div className="flex items-center p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                    <button
                      type="button"
                      onClick={() => setCrmViewMode('table')}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                        crmViewMode === 'table'
                          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <TableIcon size={12} />
                      <span>Table</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCrmViewMode('kanban')}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                        crmViewMode === 'kanban'
                          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <Kanban size={12} />
                      <span>Kanban</span>
                    </button>
                  </div>

                  {/* Status filter */}
                  <select
                    value={inquiryStatusFilter}
                    onChange={(e) => setInquiryStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                  >
                    <option value="all">All Stages</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="site_visit">Site Visit</option>
                    <option value="quoted">Estimate Sent</option>
                    <option value="in_progress">In Workshop</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>

                  {/* Priority filter */}
                  <select
                    value={inquiryPriorityFilter}
                    onChange={(e) => setInquiryPriorityFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                  >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              {/* TABLE VIEW */}
              {crmViewMode === 'table' && (
                <div className="rounded-xl bg-white dark:bg-[#161619] border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-[11px] font-mono uppercase text-neutral-400">
                          <th className="py-2.5 px-4">Client Contact</th>
                          <th className="py-2.5 px-4">Memorial Service</th>
                          <th className="py-2.5 px-4">Cemetery Plot</th>
                          <th className="py-2.5 px-4">Pipeline Stage</th>
                          <th className="py-2.5 px-4">Priority</th>
                          <th className="py-2.5 px-4">Est. Quote</th>
                          <th className="py-2.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/80">
                        {filteredInquiries.map((inq) => (
                          <tr
                            key={inq._id}
                            className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                          >
                            {/* Client */}
                            <td className="py-2.5 px-4">
                              <div className="font-semibold text-neutral-900 dark:text-white">
                                {inq.name}
                              </div>
                              <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                                <a
                                  href={`tel:${inq.phone}`}
                                  className="hover:text-[#8B7355] flex items-center gap-1"
                                >
                                  <Phone size={10} />
                                  <span>{inq.phone}</span>
                                </a>
                                <span>•</span>
                                <a
                                  href={`mailto:${inq.email}`}
                                  className="hover:text-[#8B7355] flex items-center gap-1"
                                >
                                  <Mail size={10} />
                                  <span>{inq.email}</span>
                                </a>
                              </div>
                            </td>

                            {/* Service */}
                            <td className="py-2.5 px-4 text-neutral-700 dark:text-neutral-300 font-medium">
                              {inq.serviceType}
                            </td>

                            {/* Cemetery */}
                            <td className="py-2.5 px-4 text-neutral-500">
                              {inq.cemetery || 'Not specified'}
                            </td>

                            {/* Inline Stage Selector */}
                            <td className="py-2.5 px-4">
                              <select
                                value={inq.status}
                                onChange={(e) =>
                                  handleUpdateInquiryStatus(inq._id, e.target.value as InquiryStatus)
                                }
                                className="px-2 py-0.5 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium focus:outline-none cursor-pointer"
                              >
                                <option value="new">New Entry</option>
                                <option value="contacted">Contacted</option>
                                <option value="site_visit">Site Visit</option>
                                <option value="quoted">Estimate Sent</option>
                                <option value="in_progress">In Workshop</option>
                                <option value="completed">Completed</option>
                                <option value="archived">Archived</option>
                              </select>
                            </td>

                            {/* Priority */}
                            <td className="py-2.5 px-4">{getPriorityBadge(inq.priority)}</td>

                            {/* Estimate */}
                            <td className="py-2.5 px-4 font-mono font-medium text-neutral-700 dark:text-neutral-300">
                              {inq.estimatedBudget || '—'}
                            </td>

                            {/* Actions */}
                            <td className="py-2.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setActiveInquiryModal(inq)}
                                  className="px-2 py-1 rounded text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                                >
                                  Details
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteInquiry(inq._id, inq.name)}
                                  className="p-1 rounded text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                                  title="Delete Lead"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {filteredInquiries.length === 0 && (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-neutral-400">
                              No customer inquiries found matching your filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* KANBAN BOARD VIEW */}
              {crmViewMode === 'kanban' && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 pb-8 overflow-x-auto">
                  {STAGES.map((stage) => {
                    const stageInquiries = filteredInquiries.filter((i) => i.status === stage.id);
                    return (
                      <div
                        key={stage.id}
                        className="rounded-xl bg-neutral-100/70 dark:bg-neutral-900/50 p-2.5 flex flex-col min-h-[400px] border border-neutral-200/60 dark:border-neutral-800"
                      >
                        {/* Column Header */}
                        <div className="flex items-center justify-between px-1.5 py-1 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${stage.dotColor}`} />
                            <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                              {stage.label}
                            </span>
                          </div>
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                            {stageInquiries.length}
                          </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-2 flex-1">
                          {stageInquiries.map((inq) => (
                            <div
                              key={inq._id}
                              onClick={() => setActiveInquiryModal(inq)}
                              className="p-3 rounded-lg bg-white dark:bg-[#161619] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-xs text-neutral-900 dark:text-white truncate">
                                  {inq.name}
                                </span>
                                {inq.priority !== 'normal' && getPriorityBadge(inq.priority)}
                              </div>

                              <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-1">
                                {inq.serviceType}
                              </p>

                              {inq.cemetery && (
                                <p className="text-[10px] text-neutral-400 truncate">
                                  {inq.cemetery}
                                </p>
                              )}

                              <div className="pt-1.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
                                <span>{inq.estimatedBudget || 'Est: TBD'}</span>
                                <span className="font-mono">
                                  {new Date(inq.createdAt).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>
                          ))}

                          {stageInquiries.length === 0 && (
                            <div className="h-20 flex items-center justify-center text-[11px] text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                              Empty stage
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. BUSINESS DIRECTORY */}
          {/* ========================================================= */}
          {activeSection === 'contacts' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-serif">
                    Trade Partner Directory
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Quarries, cemetery superintendents, church officials, gilders, and crane riggers.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={contactCategoryFilter}
                    onChange={(e) => setContactCategoryFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                  >
                    <option value="all">All Trade Categories</option>
                    <option value="Quarry & Stone">Quarries & Stone</option>
                    <option value="Cemetery Superintendent">Cemetery Superintendents</option>
                    <option value="Parish / Church Official">Parish & Church Officials</option>
                    <option value="Gilding & Gold Leaf">Gilding & Leaf Artisans</option>
                    <option value="Logistics & Crane">Logistics & Crane</option>
                  </select>

                  <button
                    type="button"
                    onClick={openCreateContact}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#8B7355] text-white text-xs font-semibold hover:bg-[#786348] transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>New Partner</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-xl bg-white dark:bg-[#161619] border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-[11px] font-mono uppercase text-neutral-400">
                        <th className="py-2.5 px-4">Contact & Role</th>
                        <th className="py-2.5 px-4">Company / Organization</th>
                        <th className="py-2.5 px-4">Category</th>
                        <th className="py-2.5 px-4">Direct Contact</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/80">
                      {filteredContacts.map((contact) => (
                        <tr
                          key={contact._id}
                          className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                        >
                          <td className="py-2.5 px-4">
                            <div className="font-semibold text-neutral-900 dark:text-white">
                              {contact.name}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              {contact.roleTitle || 'Trade Representative'}
                            </div>
                          </td>

                          <td className="py-2.5 px-4 font-medium text-neutral-800 dark:text-neutral-200">
                            {contact.organization}
                          </td>

                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                              {contact.category}
                            </span>
                          </td>

                          <td className="py-2.5 px-4">
                            <div className="text-neutral-900 dark:text-neutral-100 font-mono text-[11px]">
                              {contact.phone}
                            </div>
                            {contact.email && (
                              <div className="text-[11px] text-neutral-500">{contact.email}</div>
                            )}
                          </td>

                          <td className="py-2.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                                contact.status === 'preferred'
                                  ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                              }`}
                            >
                              {contact.status}
                            </span>
                          </td>

                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => openEditContact(contact)}
                                className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                title="Edit Contact"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteContact(contact._id, contact.name)}
                                className="p-1.5 rounded text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                                title="Delete Contact"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredContacts.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-neutral-400">
                            No business contacts found matching your filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CREATE / EDIT PORTFOLIO MONUMENT */}
      {/* ========================================================= */}
      {isPortfolioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#161619] rounded-xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200/80 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {editingPortfolioItem ? 'Edit Memorial Work' : 'Add New Memorial to Portfolio'}
              </h3>
              <button
                type="button"
                onClick={() => setIsPortfolioModalOpen(false)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePortfolio} className="p-5 overflow-y-auto space-y-4 text-xs">
              {portfolioError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{portfolioError}</span>
                </div>
              )}

              {/* Group 1: Basic info */}
              <div className="space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                  1. Monument Identification
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Memorial Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={portfolioFormData.title}
                      onChange={(e) => setPortfolioFormData({ ...portfolioFormData, title: e.target.value })}
                      placeholder="e.g. Monolithic Shanxi Black Granite Full Kerb Set"
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#8B7355]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Craft Category *
                    </label>
                    <select
                      value={portfolioFormData.category}
                      onChange={(e) => {
                        const cat = e.target.value as PortfolioItem['category'];
                        const labels: Record<string, string> = {
                          structures: 'Grave Structure',
                          monuments: 'Granite/Marble Monument',
                          engraving: 'Lettering & Engraving',
                          restoration: 'Grave Renovation',
                          masonry: 'Small Masonry',
                        };
                        setPortfolioFormData({
                          ...portfolioFormData,
                          category: cat,
                          categoryLabel: labels[cat] || 'Memorial Work',
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                    >
                      <option value="structures">Grave Structures & Kerbs</option>
                      <option value="monuments">Marble & Granite Monuments</option>
                      <option value="engraving">Lettering & Relief Engraving</option>
                      <option value="restoration">Grave Renovation & Restoration</option>
                      <option value="masonry">Nameplates & Boundary Masonry</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Material Spec *
                    </label>
                    <input
                      type="text"
                      required
                      value={portfolioFormData.material}
                      onChange={(e) => setPortfolioFormData({ ...portfolioFormData, material: e.target.value })}
                      placeholder="e.g. Shanxi Black Granite"
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={portfolioFormData.dimensions}
                      onChange={(e) => setPortfolioFormData({ ...portfolioFormData, dimensions: e.target.value })}
                      placeholder="e.g. 6ft 6in x 2ft 6in"
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Cemetery Section
                    </label>
                    <input
                      type="text"
                      value={portfolioFormData.cemeteryType}
                      onChange={(e) => setPortfolioFormData({ ...portfolioFormData, cemeteryType: e.target.value })}
                      placeholder="e.g. Traditional Kerbed Lawn"
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Photography */}
              <div className="space-y-3 pt-3 border-t border-neutral-200/80 dark:border-neutral-800">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                  2. Visual Asset & Presentation
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Photograph Path or URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={portfolioFormData.image}
                      onChange={(e) => setPortfolioFormData({ ...portfolioFormData, image: e.target.value })}
                      placeholder="/gallery/IMG_...jpg or https://..."
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono text-[11px] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Grid Aspect Ratio
                    </label>
                    <select
                      value={portfolioFormData.aspectRatio || 'standard'}
                      onChange={(e) => setPortfolioFormData({ ...portfolioFormData, aspectRatio: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                    >
                      <option value="standard">Standard (4:3)</option>
                      <option value="tall">Tall Portrait (3:4)</option>
                      <option value="wide">Wide Landscape (16:10)</option>
                      <option value="square">Square (1:1)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Image Caption
                  </label>
                  <input
                    type="text"
                    value={portfolioFormData.caption}
                    onChange={(e) => setPortfolioFormData({ ...portfolioFormData, caption: e.target.value })}
                    placeholder="Short architectural caption displayed in modal"
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Group 3: Narrative & Specifications */}
              <div className="space-y-3 pt-3 border-t border-neutral-200/80 dark:border-neutral-800">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                  3. Craftsmanship & Narrative
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Editorial Description
                  </label>
                  <textarea
                    rows={2}
                    value={portfolioFormData.description}
                    onChange={(e) => setPortfolioFormData({ ...portfolioFormData, description: e.target.value })}
                    placeholder="Narrative description of the monument and family commission..."
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Masonry & Foundation Anchor Notes
                  </label>
                  <textarea
                    rows={2}
                    value={portfolioFormData.craftsmanshipNotes}
                    onChange={(e) => setPortfolioFormData({ ...portfolioFormData, craftsmanshipNotes: e.target.value })}
                    placeholder="Laser leveling details, BRAMM ground piers, dowel specifications..."
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Group 4: Publication Status */}
              <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Catalog Status
                  </label>
                  <select
                    value={portfolioFormData.status}
                    onChange={(e) => setPortfolioFormData({ ...portfolioFormData, status: e.target.value as 'published' | 'draft' })}
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none font-medium"
                  >
                    <option value="published">Published (Visible on Public Website)</option>
                    <option value="draft">Draft (Hidden in CMS only)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Commission Era / Year
                  </label>
                  <input
                    type="text"
                    value={portfolioFormData.year}
                    onChange={(e) => setPortfolioFormData({ ...portfolioFormData, year: e.target.value })}
                    placeholder="e.g. 2026 Commission"
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPortfolioModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="px-4 py-1.5 rounded-md bg-[#8B7355] hover:bg-[#786348] text-white font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isActionLoading && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingPortfolioItem ? 'Save Changes' : 'Create Monument'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CREATE / EDIT BUSINESS CONTACT */}
      {/* ========================================================= */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#161619] rounded-xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200/80 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {editingContact ? 'Edit Trade Partner' : 'Add New Trade Partner'}
              </h3>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              {contactError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{contactError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Contact Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactFormData.name}
                    onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                    placeholder="e.g. Arthur Pendelton"
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactFormData.organization}
                    onChange={(e) => setContactFormData({ ...contactFormData, organization: e.target.value })}
                    placeholder="e.g. Cornish Silver Granite Quarries"
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Trade Category *
                  </label>
                  <select
                    value={contactFormData.category}
                    onChange={(e) => setContactFormData({ ...contactFormData, category: e.target.value as ContactCategory })}
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option value="Quarry & Stone">Quarry & Stone Supplier</option>
                    <option value="Cemetery Superintendent">Cemetery Superintendent</option>
                    <option value="Parish / Church Official">Parish / Church Official</option>
                    <option value="Gilding & Gold Leaf">Gilding & Gold Leaf</option>
                    <option value="Logistics & Crane">Logistics & Crane</option>
                    <option value="Architect / Representative">Architect / Representative</option>
                    <option value="Trade Association / NAMM">Trade Association / NAMM</option>
                    <option value="Other Partner">Other Partner</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={contactFormData.roleTitle}
                    onChange={(e) => setContactFormData({ ...contactFormData, roleTitle: e.target.value })}
                    placeholder="e.g. Master Mason / Superintendent"
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Telephone *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactFormData.phone}
                    onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                    placeholder="+44 20 7946 0912"
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactFormData.email}
                    onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                    placeholder="contact@quarry.co.uk"
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  value={contactFormData.address}
                  onChange={(e) => setContactFormData({ ...contactFormData, address: e.target.value })}
                  placeholder="Quarry Road, Cornwall..."
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Specialties (comma-separated)
                </label>
                <input
                  type="text"
                  value={contactFormData.specialties}
                  onChange={(e) => setContactFormData({ ...contactFormData, specialties: e.target.value })}
                  placeholder="Granite blocks, Honed slabs, 23k Gold Leaf"
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Internal Workshop Notes
                </label>
                <textarea
                  rows={2}
                  value={contactFormData.notes}
                  onChange={(e) => setContactFormData({ ...contactFormData, notes: e.target.value })}
                  placeholder="Order preferences, discount terms, contact hours..."
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="px-4 py-1.5 rounded-md bg-[#8B7355] hover:bg-[#786348] text-white font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isActionLoading && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingContact ? 'Save Changes' : 'Add Partner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: INQUIRY DETAILS & WORKSHOP NOTES DRAWER */}
      {/* ========================================================= */}
      {activeInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#161619] rounded-xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200/80 dark:border-neutral-800">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                  Consultation Request: {activeInquiryModal.name}
                </h3>
                {getStatusBadge(activeInquiryModal.status)}
              </div>
              <button
                type="button"
                onClick={() => setActiveInquiryModal(null)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Contact Card */}
              <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block mb-0.5">
                    Client Contact
                  </span>
                  <div className="font-semibold text-neutral-900 dark:text-white text-xs">
                    {activeInquiryModal.name}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <a
                      href={`tel:${activeInquiryModal.phone}`}
                      className="px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium flex items-center gap-1 text-[11px]"
                    >
                      <Phone size={10} />
                      <span>{activeInquiryModal.phone}</span>
                    </a>
                    <a
                      href={`mailto:${activeInquiryModal.email}`}
                      className="px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium flex items-center gap-1 text-[11px]"
                    >
                      <Mail size={10} />
                      <span>Email</span>
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block mb-0.5">
                    Target Cemetery Plot
                  </span>
                  <div className="text-neutral-800 dark:text-neutral-200 font-medium">
                    {activeInquiryModal.cemetery || 'Not specified'}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-1">
                    Received {new Date(activeInquiryModal.createdAt).toLocaleDateString()} via {activeInquiryModal.source}
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block mb-1">
                  Requested Service & Family Message
                </span>
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60">
                  <div className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {activeInquiryModal.serviceType}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                    {activeInquiryModal.message || 'No additional message was provided.'}
                  </p>
                </div>
              </div>

              {/* Stage & Priority Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg border border-neutral-200/80 dark:border-neutral-800">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Pipeline Stage
                  </label>
                  <select
                    value={activeInquiryModal.status}
                    onChange={(e) =>
                      handleUpdateInquiryStatus(activeInquiryModal._id, e.target.value as InquiryStatus)
                    }
                    className="w-full px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none font-medium"
                  >
                    <option value="new">New Entry</option>
                    <option value="contacted">Contacted Client</option>
                    <option value="site_visit">Site Visit</option>
                    <option value="quoted">Estimate Sent</option>
                    <option value="in_progress">In Workshop</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={activeInquiryModal.priority}
                    onChange={(e) =>
                      handleUpdateInquiryStatus(activeInquiryModal._id, activeInquiryModal.status, {
                        priority: e.target.value as InquiryPriority,
                      })
                    }
                    className="w-full px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Quote Estimate
                  </label>
                  <input
                    type="text"
                    defaultValue={activeInquiryModal.estimatedBudget || ''}
                    onBlur={(e) => {
                      if (e.target.value !== activeInquiryModal.estimatedBudget) {
                        handleUpdateInquiryStatus(activeInquiryModal._id, activeInquiryModal.status, {
                          estimatedBudget: e.target.value,
                        });
                      }
                    }}
                    placeholder="e.g. £3,500"
                    className="w-full px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Internal Workshop Notes */}
              <div className="space-y-2 pt-2 border-t border-neutral-200/80 dark:border-neutral-800">
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block">
                  Internal Workshop Notes History
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                  {activeInquiryModal.internalNotes?.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60"
                    >
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono mb-1">
                        <span className="font-semibold text-[#8B7355]">{note.author || 'Mason'}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-xs">
                        {note.note}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add new note input */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newInternalNote}
                    onChange={(e) => setNewInternalNote(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNoteToLead(activeInquiryModal._id);
                      }
                    }}
                    placeholder="Log site measurements, permit approvals, foundation requirements..."
                    className="flex-1 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddNoteToLead(activeInquiryModal._id)}
                    disabled={isActionLoading || !newInternalNote.trim()}
                    className="px-3 py-1.5 rounded-md bg-[#8B7355] hover:bg-[#786348] disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Send size={12} />
                    <span>Log</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: FULL-RESOLUTION GALLERY PREVIEW */}
      {/* ========================================================= */}
      {activeGalleryPreview && (
        <div
          onClick={() => setActiveGalleryPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-[#141416] text-white rounded-xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
          >
            <button
              type="button"
              onClick={() => setActiveGalleryPreview(null)}
              className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center border border-white/20 hover:bg-black"
            >
              <X size={14} />
            </button>

            <div className="relative w-full aspect-16/10 bg-neutral-900">
              <Image
                src={activeGalleryPreview.image}
                alt={activeGalleryPreview.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
              />
            </div>

            <div className="p-4 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-semibold text-white">{activeGalleryPreview.title}</h4>
                <p className="text-neutral-400 font-mono text-[11px] mt-0.5">
                  {activeGalleryPreview.image}
                </p>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(activeGalleryPreview.image, 'Image path')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 cursor-pointer"
              >
                <Copy size={12} />
                <span>Copy Path</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CONFIRMATION DIALOG (Accessible replacement for confirm()) */}
      {/* ========================================================= */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#161619] rounded-xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                {confirmDialog.title}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                {confirmDialog.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setConfirmDialog((d) => ({ ...d, isOpen: false }))}
                className="px-3.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setConfirmDialog((d) => ({ ...d, isOpen: false }));
                  await confirmDialog.onConfirm();
                }}
                className="px-3.5 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium cursor-pointer shadow-xs"
              >
                {confirmDialog.confirmLabel || 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOAST NOTIFICATION CONTAINER (Replacement for alert()) */}
      {/* ========================================================= */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-3.5 py-2 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 border animate-in slide-in-from-bottom-2 ${
              toast.type === 'error'
                ? 'bg-red-600 text-white border-red-700'
                : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-800 dark:border-neutral-200'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
