# API Service Documentation

## 📁 Structure

```
src/api/
├── config.js           # API configuration and endpoints
├── client.js           # Axios client with interceptors
├── index.js            # Central export point
├── README.md           # This documentation
└── services/           # Individual service modules
    ├── authService.js  # Authentication APIs
    ├── userService.js  # User profile APIs
    ├── musicService.js # Music lessons APIs
    └── gamesService.js # Games APIs
```

## 🚀 Usage Examples

### Method 1: Import specific services
```javascript
import { authService, userService, musicService } from '../../src/api';

// Use the services
const profile = await userService.getProfile();
const lessons = await musicService.getLessons();
```

### Method 2: Import all as API object
```javascript
import API from '../../src/api';

// Use the services
const profile = await API.user.getProfile();
const lessons = await API.music.getLessons();
const games = await API.games.getGames();
```

## 📝 Available Services

### 🔐 Authentication Service
```javascript
// Google token verification (currently commented out)
await authService.verifyGoogleToken(idToken, additionalDetails);

// Refresh token
await authService.refreshToken(refreshToken);

// Logout
await authService.logout();
```

### 👤 User Service
```javascript
// Get user profile
const profile = await userService.getProfile();

// Update profile
await userService.updateProfile({
  name: 'John Doe',
  email: 'john@example.com'
});

// Get user stats
const stats = await userService.getStats();
```

### 🎵 Music Service
```javascript
// Get all lessons
const lessons = await musicService.getLessons();

// Get specific lesson
const lesson = await musicService.getLessonDetails('lesson123');

// Submit progress
await musicService.submitProgress('lesson123', {
  completed: true,
  score: 85,
  timeSpent: 300
});

// Get user's progress
const progress = await musicService.getUserProgress();
```

### 🎮 Games Service
```javascript
// Get available games
const games = await gamesService.getGames();

// Get game details
const gameDetails = await gamesService.getGameDetails('game123');

// Submit score
await gamesService.submitScore('game123', {
  score: 1500,
  level: 10,
  duration: 240
});

// Get leaderboard
const leaderboard = await gamesService.getLeaderboard();
```

## 🔧 Adding New APIs

### Step 1: Add endpoints to config.js
```javascript
export const API_ENDPOINTS = {
  // ... existing endpoints
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    SETTINGS: '/notifications/settings',
  },
};
```

### Step 2: Create new service file
```javascript
// services/notificationService.js
import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

class NotificationService {
  async getNotifications() {
    try {
      console.log('🔔 Fetching notifications...');
      
      const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST);
      
      console.log('=== NOTIFICATIONS API RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('===================================');
      
      return response.data;
    } catch (error) {
      console.error('=== NOTIFICATIONS API ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('===============================');
      
      throw error;
    }
  }
  
  async markAsRead(notificationId) {
    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId)
      );
      return response.data;
    } catch (error) {
      console.error('Mark notification as read failed:', error);
      throw error;
    }
  }
}

export default new NotificationService();
```

### Step 3: Export from index.js
```javascript
// Add to imports
import notificationService from './services/notificationService';

// Add to exports
export {
  // ... existing exports
  notificationService,
};

// Add to default export
const API = {
  // ... existing services
  notifications: notificationService,
};
```

### Step 4: Use in components
```javascript
import { notificationService } from '../../src/api';

const MyComponent = () => {
  const fetchNotifications = async () => {
    try {
      const notifications = await notificationService.getNotifications();
      console.log('Notifications:', notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };
};
```

## 📊 Console Logging

All API calls automatically log:

**Requests:**
```
🚀 API Request: {
  method: "GET",
  url: "/music/lessons",
  data: {...},
  headers: {...}
}
```

**Successful Responses:**
```
✅ API Response: {
  url: "/music/lessons",
  status: 200,
  data: {...}
}
```

**Formatted Service Responses:**
```
=== MUSIC LESSONS API RESPONSE ===
{
  "lessons": [
    {
      "id": "lesson1",
      "title": "Basic Chords"
    }
  ]
}
===================================
```

**Errors:**
```
❌ API Error: {
  url: "/music/lessons",
  status: 500,
  message: "Internal server error",
  data: {...}
}
```

## 🔒 Authentication

Auth tokens are automatically:
- Added to all requests
- Stored in AsyncStorage
- Removed on 401 errors

## 🎯 To Enable Google Verification

Uncomment the code in `components/auth/SignInForm.tsx` around line 39:

```javascript
// TODO: Call backend API to verify Google token (uncomment when ready)
// Remove the /* */ comments to enable the API call
```