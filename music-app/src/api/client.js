/**
 * API Client
 * Base API client with error handling and request/response interceptors
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from './config';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Simple request logging
    console.log(`API Endpoint: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log(`Payload: ${JSON.stringify(config.data, null, 2) || 'No payload'}`);
    console.log('Getting Response...........');
    
    // Store request timestamp
    config.metadata = { startTime: Date.now() };
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Simple response logging
    console.log(`Raw Response: ${JSON.stringify(response.data, null, 2)}`);
    
    return response;
  },
  async (error) => {
    // Simple error response logging
    console.log(`Raw Response: ${JSON.stringify(error.response?.data || { error: error.message }, null, 2)}`);
    
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      console.log('🔒 Token cleared due to 401 Unauthorized');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;