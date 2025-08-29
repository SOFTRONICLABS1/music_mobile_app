/**
 * API Configuration
 * Central configuration for all API endpoints and settings
 */

const API_CONFIG = {
  BASE_URL: 'https://24pw8gqd0i.execute-api.us-east-1.amazonaws.com/api/v1',
  TIMEOUT: 30000, // 60 seconds
  HEADERS: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE_VERIFY: '/auth/google-verify', 
    GOOGLE_VERIFIED: '/database/auth/sso',
    CHECK_USERNAME: '/auth/check-username',
    UPDATE_USERNAME: '/auth/update-username', 
    UPDATE_PHONE: '/auth/update-phone',
    UPDATE_PROFILE: '/auth/update-profile',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
    STATS: '/user/stats',
  },
  MUSIC: {
    LESSONS: '/music/lessons',
    LESSON_DETAILS: (id) => `/music/lessons/${id}`,
    SUBMIT_PROGRESS: (id) => `/music/lessons/${id}/progress`,
    USER_PROGRESS: '/music/progress',
  },
  GAMES: {
    LIST: '/games',
    GAME_DETAILS: (id) => `/games/${id}`,
    SUBMIT_SCORE: (id) => `/games/${id}/score`,
    LEADERBOARD: '/games/leaderboard',
  },
  PHONE: {
    VERIFY: '/phone/verify',
    SEND_OTP: '/phone/send-otp',
  },
  // Add more endpoints as needed
};

export default API_CONFIG;