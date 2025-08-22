// API Client for future integration

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.musicapp.com';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: { name: string; email: string; password: string }) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.makeRequest('/auth/logout', { method: 'POST' });
  }

  // Games endpoints
  async getGames(page: number = 1, limit: number = 10) {
    return this.makeRequest(`/games?page=${page}&limit=${limit}`);
  }

  async getGameById(id: string) {
    return this.makeRequest(`/games/${id}`);
  }

  async likeGame(gameId: string) {
    return this.makeRequest(`/games/${gameId}/like`, { method: 'POST' });
  }

  async commentOnGame(gameId: string, text: string) {
    return this.makeRequest(`/games/${gameId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async shareGame(gameId: string) {
    return this.makeRequest(`/games/${gameId}/share`, { method: 'POST' });
  }

  // User endpoints
  async getCurrentUser() {
    return this.makeRequest('/users/me');
  }

  async getUserByUsername(username: string) {
    return this.makeRequest(`/users/${username}`);
  }

  async getUserStats(userId: string) {
    return this.makeRequest(`/users/${userId}/stats`);
  }

  async followUser(userId: string) {
    return this.makeRequest(`/users/${userId}/follow`, { method: 'POST' });
  }

  async unfollowUser(userId: string) {
    return this.makeRequest(`/users/${userId}/follow`, { method: 'DELETE' });
  }

  // Playlists endpoints
  async getUserPlaylists(userId: string) {
    return this.makeRequest(`/users/${userId}/playlists`);
  }

  async getPlaylistById(id: string) {
    return this.makeRequest(`/playlists/${id}`);
  }

  async createPlaylist(playlistData: { title: string; description: string; isPublic: boolean }) {
    return this.makeRequest('/playlists', {
      method: 'POST',
      body: JSON.stringify(playlistData),
    });
  }

  // Music endpoints
  async searchMusic(query: string, page: number = 1) {
    return this.makeRequest(`/music/search?q=${encodeURIComponent(query)}&page=${page}`);
  }

  async getTrackById(id: string) {
    return this.makeRequest(`/music/tracks/${id}`);
  }

  // Notifications endpoints
  async getNotifications(page: number = 1) {
    return this.makeRequest(`/notifications?page=${page}`);
  }

  async markNotificationRead(id: string) {
    return this.makeRequest(`/notifications/${id}/read`, { method: 'PUT' });
  }
}

export const apiClient = new ApiClient();