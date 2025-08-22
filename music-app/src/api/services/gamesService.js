/**
 * Games Service
 * Handles all game-related API calls
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

class GamesService {
  /**
   * Get available games
   * @returns {Promise} List of games
   */
  async getGames() {
    try {
      console.log('🎮 Fetching available games...');
      
      const response = await apiClient.get(API_ENDPOINTS.GAMES.LIST);
      
      console.log('=== GAMES API RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('===========================');
      
      return response.data;
    } catch (error) {
      console.error('=== GAMES API ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('=======================');
      
      throw error;
    }
  }
  
  /**
   * Get game details
   * @param {string} gameId - Game ID
   * @returns {Promise} Game details
   */
  async getGameDetails(gameId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GAMES.GAME_DETAILS(gameId));
      return response.data;
    } catch (error) {
      console.error('Get game details failed:', error);
      throw error;
    }
  }
  
  /**
   * Submit game score
   * @param {string} gameId - Game ID
   * @param {object} scoreData - Score data
   * @returns {Promise} Score response
   */
  async submitScore(gameId, scoreData) {
    try {
      console.log(`🏆 Submitting score for game: ${gameId}`);
      console.log('Score data:', scoreData);
      
      const response = await apiClient.post(API_ENDPOINTS.GAMES.SUBMIT_SCORE(gameId), scoreData);
      
      console.log('=== SUBMIT SCORE API RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('==================================');
      
      return response.data;
    } catch (error) {
      console.error('=== SUBMIT SCORE API ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('==============================');
      
      throw error;
    }
  }
  
  /**
   * Get leaderboard
   * @returns {Promise} Leaderboard data
   */
  async getLeaderboard() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GAMES.LEADERBOARD);
      return response.data;
    } catch (error) {
      console.error('Get leaderboard failed:', error);
      throw error;
    }
  }
}

export default new GamesService();