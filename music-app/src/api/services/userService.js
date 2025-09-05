/**
 * User Service
 * Handles all user-related API calls
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

class UserService {
  /**
   * Get user profile
   * @returns {Promise} User profile data
   */
  async getProfile() {
    try {
      console.log('👤 Fetching user profile...');
      
      const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE);
      
      console.log('=== USER PROFILE API RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('===================================');
      
      return response.data;
    } catch (error) {
      console.error('=== USER PROFILE API ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('==============================');
      
      throw error;
    }
  }
  
  /**
   * Update user profile
   * @param {object} profileData - Updated profile data
   * @returns {Promise} Updated profile data
   */
  async updateProfile(profileData) {
    try {
      console.log('📝 Updating user profile...');
      console.log('Profile data:', profileData);
      
      const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData);
      
      console.log('=== UPDATE PROFILE API RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('====================================');
      
      return response.data;
    } catch (error) {
      console.error('=== UPDATE PROFILE API ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('================================');
      
      throw error;
    }
  }
  
  /**
   * Get user statistics
   * @returns {Promise} User stats
   */
  async getStats() {
    try {
      const response = await apiClient.get('/user/stats');
      return response.data;
    } catch (error) {
      console.error('Get user stats failed:', error);
      throw error;
    }
  }
  
  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise} User data
   */
  async getUserById(userId) {
    try {
      console.log(`👤 Fetching user data for ID: ${userId}`);
      
      const response = await apiClient.get(`/auth/user/${userId}`);
      
      console.log('=== GET USER BY ID API RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('===================================');
      
      return response.data;
    } catch (error) {
      console.error('=== GET USER BY ID API ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('User ID:', userId);
      console.error('===============================');
      
      throw error;
    }
  }
}

export default new UserService();