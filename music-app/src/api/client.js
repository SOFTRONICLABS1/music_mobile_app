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
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Generate unique request ID
    const requestId = Math.random().toString(36).substr(2, 9);
    config.requestId = requestId;
    
    // Detailed request logging
    console.log(`[${requestId}] API Endpoint: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log(`[${requestId}] Payload: ${JSON.stringify(config.data, null, 2) || 'No payload'}`);
    console.log(`[${requestId}] 🔍 DEBUG: Full headers:`, JSON.stringify(config.headers, null, 2));
    console.log(`[${requestId}] Getting Response...........`);
    
    // Store request timestamp
    config.metadata = { startTime: Date.now() };
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Track if we're currently refreshing to avoid multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Simple response logging
    const requestId = response.config?.requestId || 'unknown';
    console.log(`[${requestId}] ✅ Raw Response:`, JSON.stringify(response.data, null, 2));
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Simple error response logging
    const requestId = originalRequest?.requestId || 'unknown';
    console.log(`[${requestId}] ❌ Raw Response:`, JSON.stringify(error.response?.data || { error: error.message }, null, 2));
    
    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_data']);
          console.log('🔒 No refresh token available, clearing auth data');
          processQueue(new Error('No refresh token'), null);
          return Promise.reject(error);
        }

        console.log('🔄 Attempting token refresh...');
        
        // Call refresh token API using axios directly to avoid circular dependency
        const refreshResponse = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken
        }, {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        const { access_token, refresh_token: newRefreshToken } = refreshResponse.data;
        
        // Store new tokens
        await AsyncStorage.setItem('access_token', access_token);
        if (newRefreshToken) {
          await AsyncStorage.setItem('refresh_token', newRefreshToken);
        }

        console.log('✅ Tokens refreshed successfully');
        
        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        // Process queued requests
        processQueue(null, access_token);
        
        // Retry original request
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        
        // Clear all auth data
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_data']);
        
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;