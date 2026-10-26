import { Pin, User, Board, AuthResponse } from '../types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Fallback initial pins in case backend is offline or empty
export const FALLBACK_PINS: Pin[] = [
  {
    _id: 'fallback-pin-1',
    title: 'Polished Black Granite Memorial Canopy & Obelisk',
    description: 'Master-carved monolithic black granite obelisk monument with polished canopy and incised cross finial.',
    imageUrl: '/gallery/data-9-7-2021-1172.jpg',
    aspectRatio: 1.5,
    destinationLink: '/gallery',
    tags: ['memorial', 'granite', 'obelisk', 'heritage'],
    user: {
      _id: 'user-upraity',
      name: 'Upraity And Son',
      username: 'upraitymasonry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    likesCount: 142,
    savesCount: 68,
    isLiked: false,
    isSaved: false,
    createdAt: new Date().toISOString(),
    comments: [
      {
        _id: 'c1',
        user: {
          _id: 'user-demo',
          name: 'Master Mason',
          username: 'stonemason',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        text: 'Precision leveling and high-polish mirror finish on deep granite.',
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    _id: 'fallback-pin-2',
    title: 'Tiered Full Kerb Grave Structure',
    description: 'Multi-tiered pink and black granite grave surround with reinforced concrete foundation piers.',
    imageUrl: '/gallery/20170711_122547.jpg',
    aspectRatio: 1.33,
    destinationLink: '/gallery',
    tags: ['kerb set', 'granite', 'foundation', 'stonemasonry'],
    user: {
      _id: 'user-upraity',
      name: 'Upraity And Son',
      username: 'upraitymasonry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    likesCount: 230,
    savesCount: 114,
    isLiked: false,
    isSaved: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-pin-3',
    title: 'Carrara Marble Stepped Ledger Memorial',
    description: 'Fine Carrara marble ledger with hand-carved Latin cross and chamfered moisture wash.',
    imageUrl: '/gallery/2626.jpg',
    aspectRatio: 1.33,
    destinationLink: '/gallery',
    tags: ['marble', 'carrara', 'cross', 'headstone'],
    user: {
      _id: 'user-upraity',
      name: 'Upraity And Son',
      username: 'upraitymasonry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    likesCount: 89,
    savesCount: 42,
    isLiked: false,
    isSaved: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-pin-4',
    title: 'Intricate Celtic Gold Cross Engraving',
    description: 'Triple-coated 23.5k English gold leaf applied to precision deep sandblast Celtic knot relief.',
    imageUrl: '/gallery/data-9-7-2021-4928.jpg',
    aspectRatio: 1.45,
    destinationLink: '/gallery',
    tags: ['gold leaf', 'celtic cross', 'engraving', 'handcrafted'],
    user: {
      _id: 'user-upraity',
      name: 'Upraity And Son',
      username: 'upraitymasonry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    likesCount: 380,
    savesCount: 195,
    isLiked: false,
    isSaved: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-pin-5',
    title: 'Hand-Etched Shield & Floral Rose Relief',
    description: 'Detailed memorial shield headpiece with personalized portrait etching and gilded floral accents.',
    imageUrl: '/gallery/data-9-7-2021-6701.jpg',
    aspectRatio: 1.5,
    destinationLink: '/gallery',
    tags: ['portrait etching', 'rose relief', 'granite', 'memorial'],
    user: {
      _id: 'user-upraity',
      name: 'Upraity And Son',
      username: 'upraitymasonry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    likesCount: 512,
    savesCount: 280,
    isLiked: false,
    isSaved: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-pin-6',
    title: 'Polished Black Granite Tiered Monument',
    description: 'Monolithic tiered black granite monument with freestanding cross and gold lettering.',
    imageUrl: '/gallery/data-9-7-2021-1524.jpg',
    aspectRatio: 1.4,
    destinationLink: '/gallery',
    tags: ['crucifix', 'black granite', 'monument', 'memorial'],
    user: {
      _id: 'user-upraity',
      name: 'Upraity And Son',
      username: 'upraitymasonry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    likesCount: 175,
    savesCount: 92,
    isLiked: false,
    isSaved: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-pin-7',
    title: 'Double Kerb Family Enclosure on Concrete Foundation',
    description: 'Full double grave enclosure constructed with BRAMM-compliant reinforced concrete ground beams.',
    imageUrl: '/gallery/data-9-7-2021-3318.jpg',
    aspectRatio: 1.5,
    destinationLink: '/gallery',
    tags: ['double kerb', 'grave enclosure', 'restoration', 'foundation'],
    user: {
      _id: 'user-upraity',
      name: 'Upraity And Son',
      username: 'upraitymasonry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    likesCount: 204,
    savesCount: 77,
    isLiked: false,
    isSaved: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-pin-8',
    title: 'Gold Ribbon Border & Inscribed Epitaph',
    description: 'High-gloss black granite memorial slab featuring inlaid gold leaf borders and classical serif typography.',
    imageUrl: '/gallery/data-9-7-2021-3322.jpg',
    aspectRatio: 1.35,
    destinationLink: '/gallery',
    tags: ['gold lettering', 'gilding', 'granite', 'stonemasonry'],
    user: {
      _id: 'user-upraity',
      name: 'Upraity And Son',
      username: 'upraitymasonry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    likesCount: 165,
    savesCount: 88,
    isLiked: false,
    isSaved: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-pin-9',
    title: 'Honored Veteran Memorial with Cross Finial',
    description: 'Architectural cemetery monument with military regimental insignia and bronze cross accent.',
    imageUrl: '/gallery/data-9-7-2021-5838.jpg',
    aspectRatio: 1.55,
    destinationLink: '/gallery',
    tags: ['veteran', 'obelisk', 'cross finial', 'cemetery'],
    user: {
      _id: 'user-upraity',
      name: 'Upraity And Son',
      username: 'upraitymasonry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    likesCount: 310,
    savesCount: 160,
    isLiked: false,
    isSaved: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-pin-10',
    title: 'Polished Black Granite Ledger on Concrete Footing',
    description: 'Full-length stone ledger set over damp-proof foundation footing with laser-checked elevation.',
    imageUrl: '/gallery/20180914_141137.jpg',
    aspectRatio: 1.6,
    destinationLink: '/gallery',
    tags: ['ledger', 'concrete footing', 'leveling', 'bramm'],
    user: {
      _id: 'user-upraity',
      name: 'Upraity And Son',
      username: 'upraitymasonry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    likesCount: 420,
    savesCount: 215,
    isLiked: false,
    isSaved: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-pin-11',
    title: 'Stepped Imperial Red & Carrara Grave Marker',
    description: 'Contrasting ruby granite headpiece with white stepped tier base and customized portrait plaque.',
    imageUrl: '/gallery/20170911_160857.jpg',
    aspectRatio: 1.4,
    destinationLink: '/gallery',
    tags: ['red granite', 'stepped memorial', 'portrait', 'craft'],
    user: {
      _id: 'user-upraity',
      name: 'Upraity And Son',
      username: 'upraitymasonry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    likesCount: 133,
    savesCount: 54,
    isLiked: false,
    isSaved: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-pin-12',
    title: 'Dove of Peace Etching & Inscribed Headstone',
    description: 'Symbolic peace dove carving with deep shadow relief on fine-grain jet black granite.',
    imageUrl: '/gallery/data-9-7-2021-209.jpg',
    aspectRatio: 1.5,
    destinationLink: '/gallery',
    tags: ['dove', 'peace', 'hand tooling', 'memorial'],
    user: {
      _id: 'user-upraity',
      name: 'Upraity And Son',
      username: 'upraitymasonry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    likesCount: 260,
    savesCount: 140,
    isLiked: false,
    isSaved: false,
    createdAt: new Date().toISOString(),
  },
];

// Helper to get auth headers
const getAuthHeaders = (token?: string | null) => {
  const headers: Record<string, string> = {};
  const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('pinterest_token') : null);
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }
  return headers;
};

// API Functions
export const fetchPins = async (params?: { search?: string; tag?: string; sort?: string; page?: number; limit?: number }) => {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.tag && params.tag !== 'all') query.append('tag', params.tag);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const res = await fetch(`${API_BASE_URL}/pins?${query.toString()}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch from backend');
    const data = await res.json();
    if (data.pins && data.pins.length > 0) return data;
    return { pins: FALLBACK_PINS, page: 1, pages: 1, total: FALLBACK_PINS.length };
  } catch (err) {
    console.warn('Backend API unavailable, using fallback mock pins:', err);
    // Filter fallback pins locally
    let filtered = [...FALLBACK_PINS];
    if (params?.tag && params.tag !== 'all') {
      filtered = filtered.filter((p) => p.tags.includes(params.tag!.toLowerCase()));
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return { pins: filtered, page: 1, pages: 1, total: filtered.length };
  }
};

export const fetchPinById = async (id: string): Promise<Pin> => {
  try {
    const res = await fetch(`${API_BASE_URL}/pins/${id}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Pin not found');
    return await res.json();
  } catch (err) {
    const fallback = FALLBACK_PINS.find((p) => p._id === id) || FALLBACK_PINS[0];
    return fallback;
  }
};

export const createPin = async (formData: FormData, token: string) => {
  const res = await fetch(`${API_BASE_URL}/pins`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to create pin');
  }
  return await res.json();
};

export const toggleLikePin = async (pinId: string, token: string) => {
  const res = await fetch(`${API_BASE_URL}/pins/${pinId}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to toggle like');
  return await res.json();
};

export const toggleSavePin = async (pinId: string, token: string) => {
  const res = await fetch(`${API_BASE_URL}/pins/${pinId}/save`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to toggle save');
  return await res.json();
};

export const addCommentToPin = async (pinId: string, text: string, token: string) => {
  const res = await fetch(`${API_BASE_URL}/pins/${pinId}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to post comment');
  return await res.json();
};

export const fetchUserBoards = async (userId: string, token?: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/boards/user/${userId}`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch boards');
    return await res.json();
  } catch {
    return [
      {
        _id: 'default-board-1',
        name: 'My Inspiration',
        description: 'Ideas and visual references',
        isPrivate: false,
        pins: [],
      },
    ];
  }
};

export const createBoard = async (data: { name: string; description?: string; isPrivate?: boolean }, token: string) => {
  const res = await fetch(`${API_BASE_URL}/boards`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create board');
  return await res.json();
};

export const addPinToBoard = async (boardId: string, pinId: string, token: string) => {
  const res = await fetch(`${API_BASE_URL}/boards/${boardId}/pins`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pinId }),
  });
  if (!res.ok) throw new Error('Failed to save pin to board');
  return await res.json();
};

export const fetchUserProfile = async (identifier: string, token?: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${identifier}`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return await res.json();
  } catch {
    return {
      _id: 'user-demo',
      name: 'Demo Creator',
      username: 'democreator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Visual curator, UI/UX enthusiast & coffee connoisseur. Collecting inspirations from around the globe.',
      followersCount: 1420,
      followingCount: 382,
      pinsCount: 12,
      boardsCount: 4,
    };
  }
};

export const fetchUserCreatedPins = async (identifier: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${identifier}/pins`);
    if (!res.ok) throw new Error('Failed to fetch created pins');
    return await res.json();
  } catch {
    return FALLBACK_PINS.slice(0, 4);
  }
};

export const fetchUserSavedPins = async (identifier: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${identifier}/saved`);
    if (!res.ok) throw new Error('Failed to fetch saved pins');
    return await res.json();
  } catch {
    return FALLBACK_PINS.slice(4, 9);
  }
};

export const toggleFollowUser = async (userId: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('pinterest_token') : null;
  const res = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to toggle follow status');
  return await res.json();
};

