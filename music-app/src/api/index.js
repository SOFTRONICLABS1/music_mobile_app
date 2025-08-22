/**
 * API Module Export
 * Central export point for all API services
 */

import authService from './services/authService';
import userService from './services/userService';
import musicService from './services/musicService';
import apiClient from './client';
import API_CONFIG, { API_ENDPOINTS } from './config';

// Export all services and utilities
export {
  authService,
  userService,
  musicService,
  apiClient,
  API_CONFIG,
  API_ENDPOINTS,
};

// Default export with all services
const API = {
  auth: authService,
  user: userService,
  music: musicService,
  // Add more services as you create them
  // games: gamesService,
  // phone: phoneService,
};

export default API;