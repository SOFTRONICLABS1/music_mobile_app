/**
 * Music Service
 * Handles all music-related API calls
 */

import apiClient from '../client';

class MusicService {
  /**
   * Get music lessons
   * @returns {Promise} List of music lessons
   */
  async getLessons() {
    try {
      console.log('🎵 Fetching music lessons...');
      
      const response = await apiClient.get('/music/lessons');
      
      console.log('=== MUSIC LESSONS API RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('===================================');
      
      return response.data;
    } catch (error) {
      console.error('=== MUSIC LESSONS API ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('===============================');
      
      throw error;
    }
  }
  
  /**
   * Get lesson details
   * @param {string} lessonId - Lesson ID
   * @returns {Promise} Lesson details
   */
  async getLessonDetails(lessonId) {
    try {
      console.log(`🎼 Fetching lesson details for ID: ${lessonId}`);
      
      const response = await apiClient.get(`/music/lessons/${lessonId}`);
      
      console.log('=== LESSON DETAILS API RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('====================================');
      
      return response.data;
    } catch (error) {
      console.error('=== LESSON DETAILS API ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('================================');
      
      throw error;
    }
  }
  
  /**
   * Submit lesson progress
   * @param {string} lessonId - Lesson ID
   * @param {object} progressData - Progress data
   * @returns {Promise} Progress response
   */
  async submitProgress(lessonId, progressData) {
    try {
      console.log(`📊 Submitting progress for lesson: ${lessonId}`);
      console.log('Progress data:', progressData);
      
      const response = await apiClient.post(`/music/lessons/${lessonId}/progress`, progressData);
      
      console.log('=== SUBMIT PROGRESS API RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('====================================');
      
      return response.data;
    } catch (error) {
      console.error('=== SUBMIT PROGRESS API ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('=================================');
      
      throw error;
    }
  }
  
  /**
   * Get user's music progress
   * @returns {Promise} Progress data
   */
  async getUserProgress() {
    try {
      const response = await apiClient.get('/music/progress');
      return response.data;
    } catch (error) {
      console.error('Get user progress failed:', error);
      throw error;
    }
  }
}

export default new MusicService();