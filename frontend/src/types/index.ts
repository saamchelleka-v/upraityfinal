export interface User {
  _id: string;
  name: string;
  username: string;
  email?: string;
  avatar: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  pinsCount?: number;
  boardsCount?: number;
  isFollowing?: boolean;
}

export interface Comment {
  _id: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface Pin {
  _id: string;
  title: string;
  description: string;
  destinationLink?: string;
  imageUrl: string;
  imagePublicId?: string;
  aspectRatio: number;
  tags: string[];
  user: User;
  likesCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  savesCount?: number;
  comments?: Comment[];
  createdAt: string;
}

export interface Board {
  _id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  user: User;
  pins: (Pin | string)[];
  coverImage?: string;
  createdAt?: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  token: string;
}
