/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

class AuthService {
  /**
   * Verify Google Sign-In token with backend
   * @param {string} idToken - Google ID token
   * @param {object} additionalDetails - Optional additional user details
   * @returns {Promise} API response with user data and auth token
   */
  async verifyGoogleToken(idToken, additionalDetails = {}) {
    try {
      console.log('🔐 Verifying Google token...');
      console.log('📤 Sending ID Token:', idToken?.substring(0, 50) + '...');
      
      const response = await apiClient.post(API_ENDPOINTS.AUTH.GOOGLE_VERIFY, {
        id_token: idToken,
        additional_details: additionalDetails,
      });
      
      console.log('=== GOOGLE VERIFY API RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('===================================');
      
      return response.data;
    } catch (error) {
      console.error('=== GOOGLE VERIFY API ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('Error Message:', error.message);
      console.error('================================');
      
      throw error;
    }
  }
  
  /**
   * Refresh authentication token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} New auth token
   */
  async refreshToken(refreshToken) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
        refresh_token: refreshToken,
      });
      
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }
  
  /**
   * Logout user
   * @returns {Promise}
   */
  async logout() {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
}

export default new AuthService();