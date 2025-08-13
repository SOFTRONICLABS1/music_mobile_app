// API Module Entry Point

export * from './types';
export * from './client';
export * from './hooks';

// Configuration
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.musicapp.com',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  
  // Games
  GAMES: {
    LIST: '/games',
    BY_ID: (id: string) => `/games/${id}`,
    LIKE: (id: string) => `/games/${id}/like`,
    COMMENT: (id: string) => `/games/${id}/comments`,
    SHARE: (id: string) => `/games/${id}/share`,
  },
  
  // Users
  USERS: {
    ME: '/users/me',
    BY_USERNAME: (username: string) => `/users/${username}`,
    STATS: (id: string) => `/users/${id}/stats`,
    FOLLOW: (id: string) => `/users/${id}/follow`,
    PLAYLISTS: (id: string) => `/users/${id}/playlists`,
  },
  
  // Music
  MUSIC: {
    SEARCH: '/music/search',
    TRACKS: '/music/tracks',
    BY_ID: (id: string) => `/music/tracks/${id}`,
  },
  
  // Playlists
  PLAYLISTS: {
    LIST: '/playlists',
    BY_ID: (id: string) => `/playlists/${id}`,
    CREATE: '/playlists',
    UPDATE: (id: string) => `/playlists/${id}`,
    DELETE: (id: string) => `/playlists/${id}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    READ: (id: string) => `/notifications/${id}/read`,
  },
};

// Error handling utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};