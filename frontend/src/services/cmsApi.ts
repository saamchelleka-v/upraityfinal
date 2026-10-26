import { PortfolioItem, BusinessContact, InquiryLead, CRMStats } from '../types/cms';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('pinterest_token') || localStorage.getItem('upraity_token')
    : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ========================
// Portfolio CMS API
// ========================

export async function fetchPortfolioItems(params?: {
  category?: string;
  search?: string;
  status?: string;
}): Promise<PortfolioItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/portfolio`);
    if (params?.category && params.category !== 'all') {
      url.searchParams.set('category', params.category);
    }
    if (params?.search) {
      url.searchParams.set('search', params.search);
    }
    if (params?.status) {
      url.searchParams.set('status', params.status);
    }

    const res = await fetch(url.toString(), {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch portfolio items');
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.warn('fetchPortfolioItems fallback to local data:', error);
    return [];
  }
}

export async function createPortfolioItem(
  item: Omit<PortfolioItem, '_id' | 'createdAt' | 'updatedAt'>
): Promise<PortfolioItem> {
  const res = await fetch(`${API_BASE_URL}/portfolio`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create portfolio item');
  }
  const data = await res.json();
  return data.item;
}

export async function updatePortfolioItem(
  id: string,
  updates: Partial<PortfolioItem>
): Promise<PortfolioItem> {
  const res = await fetch(`${API_BASE_URL}/portfolio/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update portfolio item');
  }
  const data = await res.json();
  return data.item;
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/portfolio/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete portfolio item');
  return true;
}

// ========================
// Business Contacts API
// ========================

export async function fetchBusinessContacts(params?: {
  category?: string;
  search?: string;
  status?: string;
}): Promise<BusinessContact[]> {
  try {
    const url = new URL(`${API_BASE_URL}/contacts`);
    if (params?.category && params.category !== 'all') {
      url.searchParams.set('category', params.category);
    }
    if (params?.search) {
      url.searchParams.set('search', params.search);
    }
    if (params?.status) {
      url.searchParams.set('status', params.status);
    }

    const res = await fetch(url.toString(), {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch business contacts');
    const data = await res.json();
    return data.contacts || [];
  } catch (error) {
    console.warn('fetchBusinessContacts error:', error);
    return [];
  }
}

export async function createBusinessContact(
  contact: Omit<BusinessContact, '_id' | 'createdAt' | 'updatedAt'>
): Promise<BusinessContact> {
  const res = await fetch(`${API_BASE_URL}/contacts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(contact),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create business contact');
  }
  const data = await res.json();
  return data.contact;
}

export async function updateBusinessContact(
  id: string,
  updates: Partial<BusinessContact>
): Promise<BusinessContact> {
  const res = await fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update business contact');
  }
  const data = await res.json();
  return data.contact;
}

export async function deleteBusinessContact(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete business contact');
  return true;
}

// ========================
// CRM Leads & Inquiries API
// ========================

export async function fetchInquiries(params?: {
  status?: string;
  priority?: string;
  serviceType?: string;
  search?: string;
}): Promise<InquiryLead[]> {
  try {
    const url = new URL(`${API_BASE_URL}/crm/inquiries`);
    if (params?.status && params.status !== 'all') {
      url.searchParams.set('status', params.status);
    }
    if (params?.priority && params.priority !== 'all') {
      url.searchParams.set('priority', params.priority);
    }
    if (params?.serviceType && params.serviceType !== 'all') {
      url.searchParams.set('serviceType', params.serviceType);
    }
    if (params?.search) {
      url.searchParams.set('search', params.search);
    }

    const res = await fetch(url.toString(), {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch CRM inquiries');
    const data = await res.json();
    return data.inquiries || [];
  } catch (error) {
    console.warn('fetchInquiries error:', error);
    return [];
  }
}

export async function createInquiry(payload: {
  name: string;
  email: string;
  phone: string;
  cemetery?: string;
  serviceType: string;
  message?: string;
  estimatedBudget?: string;
  source?: 'contact_form' | 'quote_calculator' | 'phone' | 'direct';
}): Promise<{ success: boolean; message: string; inquiry?: InquiryLead }> {
  const res = await fetch(`${API_BASE_URL}/crm/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to submit inquiry');
  }
  return res.json();
}

export async function updateInquiry(
  id: string,
  payload: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    estimatedBudget?: string;
    note?: string;
    author?: string;
  }
): Promise<InquiryLead> {
  const res = await fetch(`${API_BASE_URL}/crm/inquiries/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update inquiry');
  }
  const data = await res.json();
  return data.inquiry;
}

export async function addInquiryNote(
  id: string,
  payload: { note: string; author?: string }
): Promise<{ success: boolean; note: any; inquiry: InquiryLead }> {
  const res = await fetch(`${API_BASE_URL}/crm/inquiries/${id}/notes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to add note to inquiry');
  }
  return res.json();
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/crm/inquiries/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete inquiry');
  return true;
}

export async function fetchCRMStats(): Promise<CRMStats | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/crm/stats`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch CRM stats');
    const data = await res.json();
    return data.stats;
  } catch (error) {
    console.warn('fetchCRMStats error:', error);
    return null;
  }
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  service: string;
  database: {
    connected: boolean;
    storageMode: 'mongodb' | 'in-memory-fallback';
    persistence: 'persistent' | 'temporary-in-memory';
  };
  version?: string;
}

export async function fetchHealthStatus(): Promise<HealthStatus | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn('fetchHealthStatus error:', error);
    return null;
  }
}

