/**
 * Search Service
 * Handles all search-related API calls
 */

import apiClient from '../client';

class SearchService {
  /**
   * Search for users, content, and games
   * @param {string} query - Search query
   * @param {number} page - Page number (default: 1)
   * @param {number} perPage - Items per page (default: 20)
   * @param {boolean} includeUsers - Include users in search (default: true)
   * @param {boolean} includeContent - Include content in search (default: true)
   * @param {boolean} includeGames - Include games in search (default: true)
   * @returns {Promise} Search results
   */
  async search(query, page = 1, perPage = 20, includeUsers = true, includeContent = true, includeGames = true) {
    try {
      console.log('🔍 Performing search...');
      console.log(`Query: "${query}", Page: ${page}, Per Page: ${perPage}`);
      
      const response = await apiClient.get('/search/', {
        params: {
          q: query,
          page,
          per_page: perPage,
          include_users: includeUsers,
          include_content: includeContent,
          include_games: includeGames
        }
      });
      
      console.log('=== SEARCH API RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('===========================');
      
      return response.data;
    } catch (error) {
      console.error('=== SEARCH API ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('========================');
      
      throw error;
    }
  }

  /**
   * Search for users only
   * @param {string} query - Search query
   * @param {number} page - Page number (default: 1)
   * @param {number} perPage - Items per page (default: 20)
   * @returns {Promise} User search results
   */
  async searchUsers(query, page = 1, perPage = 20) {
    return this.search(query, page, perPage, true, false, false);
  }

  /**
   * Search for content only
   * @param {string} query - Search query
   * @param {number} page - Page number (default: 1)
   * @param {number} perPage - Items per page (default: 20)
   * @returns {Promise} Content search results
   */
  async searchContent(query, page = 1, perPage = 20) {
    return this.search(query, page, perPage, false, true, false);
  }

  /**
   * Search for games only
   * @param {string} query - Search query
   * @param {number} page - Page number (default: 1)
   * @param {number} perPage - Items per page (default: 20)
   * @returns {Promise} Game search results
   */
  async searchGames(query, page = 1, perPage = 20) {
    return this.search(query, page, perPage, false, false, true);
  }
}

export default new SearchService();