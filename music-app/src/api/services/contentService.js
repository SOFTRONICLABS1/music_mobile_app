/**
 * Content Service
 * Handles all content-related API calls for user posts
 */

import apiClient from '../client';

class ContentService {
  /**
   * Get user's content/posts with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} perPage - Items per page (default: 20)
   * @returns {Promise} User's content with pagination info
   */
  async getMyContent(page = 1, perPage = 20) {
    try {
      console.log('📱 Fetching user content...');
      console.log(`📄 Page: ${page}, Per Page: ${perPage}`);
      
      const response = await apiClient.get('/content/my-content', {
        params: {
          page,
          per_page: perPage
        }
      });
      
      console.log('=== CONTENT API RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('============================');
      
      return response.data;
    } catch (error) {
      console.error('=== CONTENT API ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('=========================');
      
      throw error;
    }
  }
  
  /**
   * Get content details by ID
   * @param {string} contentId - Content ID
   * @returns {Promise} Content details
   */
  async getContentDetails(contentId) {
    try {
      const response = await apiClient.get(`/content/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Get content details failed:', error);
      throw error;
    }
  }
  
  /**
   * Delete content by ID
   * @param {string} contentId - Content ID
   * @returns {Promise} Delete response
   */
  async deleteContent(contentId) {
    try {
      const response = await apiClient.delete(`/content/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Delete content failed:', error);
      throw error;
    }
  }
  
  /**
   * Get public content with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} perPage - Items per page (default: 20)
   * @returns {Promise} Public content with pagination info
   */
  async getPublicContent(page = 1, perPage = 20) {
    try {
      console.log('📱 Fetching public content...');
      console.log(`📄 Page: ${page}, Per Page: ${perPage}`);
      
      const response = await apiClient.get('/content/public', {
        params: {
          page,
          per_page: perPage
        }
      });
      
      console.log('=== PUBLIC CONTENT API RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('===================================');
      
      return response.data;
    } catch (error) {
      console.error('=== PUBLIC CONTENT API ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('===============================');
      
      throw error;
    }
  }
  
  /**
   * Get content for a specific user
   * @param {string} userId - User ID
   * @param {number} page - Page number (default: 1)
   * @param {number} perPage - Items per page (default: 20)
   * @returns {Promise} User's content with pagination info
   */
  async getUserContent(userId, page = 1, perPage = 20) {
    try {
      console.log(`📱 Fetching content for user ${userId}...`);
      console.log(`📄 Page: ${page}, Per Page: ${perPage}`);
      
      const response = await apiClient.get(`/content/user/${userId}`, {
        params: {
          page,
          per_page: perPage
        }
      });
      
      console.log('=== USER CONTENT API RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('==================================');
      
      return response.data;
    } catch (error) {
      console.error('=== USER CONTENT API ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('User ID:', userId);
      console.error('==============================');
      
      throw error;
    }
  }
}

export default new ContentService();