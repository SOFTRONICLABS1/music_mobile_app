// API Types for future integration

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  joinDate: string;
  followers: number;
  following: number;
  isVerified: boolean;
}

export interface GameData {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  route: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: User;
  tags: string[];
  category: string;
}

export interface UserStats {
  gamesPlayed: number;
  highScore: number;
  achievements: number;
  level: number;
  totalPlayTime: number;
  rank: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  plays: number;
  thumbnail?: string;
  audioUrl: string;
  genre: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  trackCount: number;
  totalDuration: string;
  tracks: MusicTrack[];
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  user: User;
  gameId: string;
  parentId?: string;
  likes: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'game_upload';
  title: string;
  message: string;
  userId: string;
  fromUser?: User;
  gameId?: string;
  isRead: boolean;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}