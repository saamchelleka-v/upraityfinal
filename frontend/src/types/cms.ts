export interface PortfolioItem {
  _id: string;
  title: string;
  category: 'structures' | 'monuments' | 'engraving' | 'restoration' | 'masonry';
  categoryLabel: string;
  material: string;
  dimensions?: string;
  cemeteryType?: string;
  image: string;
  caption?: string;
  description?: string;
  craftsmanshipNotes?: string;
  year?: string;
  aspectRatio?: 'tall' | 'wide' | 'square' | 'standard';
  featured?: boolean;
  status: 'published' | 'draft';
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ContactCategory =
  | 'Quarry & Stone'
  | 'Cemetery Superintendent'
  | 'Parish / Church Official'
  | 'Gilding & Gold Leaf'
  | 'Logistics & Crane'
  | 'Architect / Representative'
  | 'Trade Association / NAMM'
  | 'Other Partner';

export interface BusinessContact {
  _id: string;
  name: string;
  organization: string;
  category: ContactCategory;
  roleTitle?: string;
  phone: string;
  email?: string;
  address?: string;
  status: 'active' | 'preferred' | 'archived';
  notes?: string;
  specialties?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type InquiryStatus =
  | 'new'
  | 'contacted'
  | 'site_visit'
  | 'quoted'
  | 'in_progress'
  | 'completed'
  | 'archived';

export type InquiryPriority = 'normal' | 'high' | 'urgent';

export interface InternalNote {
  note: string;
  author: string;
  createdAt: string;
}

export interface InquiryLead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  cemetery?: string;
  serviceType: string;
  message?: string;
  status: InquiryStatus;
  priority: InquiryPriority;
  estimatedBudget?: string;
  assignedTo?: string;
  source?: 'contact_form' | 'quote_calculator' | 'phone' | 'direct';
  internalNotes?: InternalNote[];
  createdAt: string;
  updatedAt?: string;
}

export interface CRMStats {
  totalInquiries: number;
  newInquiries: number;
  activeInquiries: number;
  highPriorityCount: number;
  statusCounts: {
    new: number;
    contacted: number;
    site_visit: number;
    quoted: number;
    in_progress: number;
    completed: number;
    archived: number;
  };
  totalContacts: number;
  activeContacts: number;
  totalPortfolioWorks: number;
  publishedPortfolioWorks: number;
}
