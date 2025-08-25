/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  /**
   * Complete Google Sign-In authentication flow
   * @param {string} idToken - Google ID token
   * @param {string} platform - Platform (ios/android)
   * @param {object} userInfo - Google user information
   * @returns {Promise} API response with access token
   */
  async googleSignIn(idToken, platform = 'ios', userInfo) {
    try {
      console.log('=================== Starting Google Sign In ===================');
      const verifyResponse = await apiClient.post(API_ENDPOINTS.AUTH.GOOGLE_VERIFY, {
        id_token: idToken,
        platform: platform,
        additional_details: {
          user_info: userInfo,
          device_info: {
            platform: 'mobile',
            os: platform,
          }
        },
      });
      const authResponse = await apiClient.post(API_ENDPOINTS.AUTH.GOOGLE_VERIFIED, {
        google_user: {
          id: userInfo.id,
          email: userInfo.email,
          email_verified: true,
          name: userInfo.name,
          picture: userInfo.photo,
          given_name: userInfo.givenName,
          family_name: userInfo.familyName,
        }
      });
      
      // Store tokens and user data
      if (authResponse.data.access_token) {
        await AsyncStorage.setItem('authToken', authResponse.data.access_token);
      }
      
      if (authResponse.data.refresh_token) {
        await AsyncStorage.setItem('refreshToken', authResponse.data.refresh_token);
      }
      
      if (authResponse.data.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(authResponse.data.user));
      }
      
      console.log('=================== Google Sign In Completed ===================');
      
      return {
        verifyResponse: verifyResponse.data,
        authResponse: authResponse.data,
        access_token: authResponse.data.access_token,
        refresh_token: authResponse.data.refresh_token,
        user: authResponse.data.user,
        is_new_user: authResponse.data.is_new_user,
      };
    } catch (error) {
      console.log('=================== Google Sign In Failed ===================');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('Error Message:', error.message);
      console.log('=============================================================');
      
      throw error;
    }
  }

  /**
   * Legacy method - now calls the complete flow
   * @deprecated Use googleSignIn instead
   */
  async verifyGoogleToken(idToken, platform = 'ios', additionalDetails = {}) {
    console.warn('⚠️ verifyGoogleToken is deprecated. Use googleSignIn for complete auth flow.');
    const userInfo = additionalDetails.user_info || {};
    return this.googleSignIn(idToken, platform, userInfo);
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
   * Check username availability
   * @param {string} username - Username to check
   * @returns {Promise} Response indicating if username is available
   */
  async checkUsernameAvailability(username) {
    try {
      console.log('=================== Starting Username Check ===================');
      
      // Get the stored access token
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please sign in again.');
      }
      
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.CHECK_USERNAME,
        { username },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      console.log('=================== Username Check Completed ===================');
      return response.data;
    } catch (error) {
      console.log('=================== Username Check Failed ===================');
      console.error('Username check failed:', error);
      if (error.response) {
        console.error('❌ Username Check Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Username check failed');
      } else if (error.request) {
        console.error('❌ No response received:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        console.error('❌ Error setting up request:', error.message);
        throw new Error('Failed to check username. Please try again.');
      }
    }
  }

  /**
   * Update username for authenticated user
   * @param {string} username - New username to set
   * @returns {Promise} Response from update username API
   */
  async updateUsername(username) {
    try {
      console.log('=================== Starting Username Update ===================');
      
      // Get the stored access token
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please sign in again.');
      }

      console.log('📝 Updating username to:', username);
      
      const response = await apiClient.put(
        API_ENDPOINTS.AUTH.UPDATE_USERNAME,
        { username },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      console.log('✅ Username updated successfully:', response.data);
      console.log('=================== Username Update Completed ===================');
      return response.data;
    } catch (error) {
      console.log('=================== Username Update Failed ===================');
      console.error('Username update failed:', error);
      if (error.response) {
        console.error('❌ Username Update Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to update username');
      } else if (error.request) {
        console.error('❌ No response received:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        console.error('❌ Error setting up request:', error.message);
        throw new Error('Failed to update username. Please try again.');
      }
    }
  }

  /**
   * Update phone number for authenticated user
   * @param {string} countryCode - Country code (e.g., "91" for India)
   * @param {string} phoneNumber - Phone number without country code
   * @returns {Promise} Response from update phone API
   */
  async updatePhoneNumber(countryCode, phoneNumber) {
    try {
      console.log('=================== Starting Phone Update ===================');
      
      // Get the stored access token
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please sign in again.');
      }

      console.log('📱 Updating phone number:', `+${countryCode}${phoneNumber}`);
      
      const response = await apiClient.put(
        API_ENDPOINTS.AUTH.UPDATE_PHONE,
        { 
          country_code: countryCode,
          phone_number: phoneNumber 
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      console.log('✅ Phone number updated successfully:', response.data);
      console.log('=================== Phone Update Completed ===================');
      return response.data;
    } catch (error) {
      console.log('=================== Phone Update Failed ===================');
      console.error('Phone number update failed:', error);
      if (error.response) {
        console.error('❌ Phone Update Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to update phone number');
      } else if (error.request) {
        console.error('❌ No response received:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        console.error('❌ Error setting up request:', error.message);
        throw new Error('Failed to update phone number. Please try again.');
      }
    }
  }

  /**
   * Update user profile information (bio, profile_image_url, etc.)
   * @param {object} profileData - Profile data to update
   * @returns {Promise} Response from update profile API
   */
  async updateProfile(profileData) {
    try {
      console.log('=================== Starting Profile Update ===================');
      
      // Get the stored access token
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please sign in again.');
      }

      console.log('📝 Updating profile with data:', profileData);
      
      const response = await apiClient.put(
        API_ENDPOINTS.AUTH.UPDATE_PROFILE,
        profileData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      console.log('✅ Profile updated successfully:', response.data);
      console.log('=================== Profile Update Completed ===================');
      return response.data;
    } catch (error) {
      console.log('=================== Profile Update Failed ===================');
      console.error('Profile update failed:', error);
      if (error.response) {
        console.error('❌ Profile Update Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to update profile');
      } else if (error.request) {
        console.error('❌ No response received:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        console.error('❌ Error setting up request:', error.message);
        throw new Error('Failed to update profile. Please try again.');
      }
    }
  }

  /**
   * Get current user profile information
   * @returns {Promise} User profile data
   */
  async getCurrentUser() {
    try {
      console.log('=================== Starting Get User Profile ===================');
      
      // Get the stored access token
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please sign in again.');
      }

      console.log('👤 Fetching current user profile...');
      
      const response = await apiClient.get(
        API_ENDPOINTS.AUTH.ME,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      console.log('✅ User profile fetched successfully:', response.data);
      console.log('=================== Get User Profile Completed ===================');
      return response.data;
    } catch (error) {
      console.log('=================== Get User Profile Failed ===================');
      console.error('Failed to fetch user profile:', error);
      if (error.response) {
        console.error('❌ User Profile Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to fetch user profile');
      } else if (error.request) {
        console.error('❌ No response received:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        console.error('❌ Error setting up request:', error.message);
        throw new Error('Failed to fetch user profile. Please try again.');
      }
    }
  }

  /**
   * Logout user
   * @returns {Promise}
   */
  async logout() {
    try {
      console.log('=================== Starting Logout ===================');
      
      // Get token for logout API call
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        // Call logout API
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
      
      // Clear all stored authentication data
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');  
      await AsyncStorage.removeItem('userData');
      
      console.log('🗑️ Cleared all authentication data from storage');
      console.log('=================== Logout Completed ===================');
      
      return { success: true };
    } catch (error) {
      console.log('=================== Logout Failed ===================');
      console.error('Logout failed:', error);
      
      // Even if API call fails, still clear local storage
      try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('refreshToken');  
        await AsyncStorage.removeItem('userData');
        console.log('🗑️ Cleared local storage despite API failure');
      } catch (storageError) {
        console.error('Failed to clear storage:', storageError);
      }
      
      throw error;
    }
  }
}

export default new AuthService();