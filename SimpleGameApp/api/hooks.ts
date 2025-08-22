// React hooks for API integration (using React Query would be ideal)

import { useState, useEffect } from 'react';
import { apiClient } from './client';
import { GameData, User, Playlist, UserStats, ApiResponse, PaginatedResponse } from './types';

// Custom hook for games data
export const useGames = (page: number = 1) => {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getGames(page) as ApiResponse<PaginatedResponse<GameData>>;
        setGames(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [page]);

  return { games, loading, error };
};

// Custom hook for user data
export const useUser = (username: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getUserByUsername(username) as ApiResponse<User>;
        setUser(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  return { user, loading, error };
};

// Custom hook for user playlists
export const useUserPlaylists = (userId: string) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getUserPlaylists(userId) as ApiResponse<Playlist[]>;
        setPlaylists(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch playlists');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPlaylists();
    }
  }, [userId]);

  return { playlists, loading, error };
};

// Custom hook for user stats
export const useUserStats = (userId: string) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getUserStats(userId) as ApiResponse<UserStats>;
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  return { stats, loading, error };
};

// Hook for game interactions
export const useGameInteractions = () => {
  const [loading, setLoading] = useState(false);

  const likeGame = async (gameId: string) => {
    try {
      setLoading(true);
      await apiClient.likeGame(gameId);
      return true;
    } catch (error) {
      console.error('Failed to like game:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const commentOnGame = async (gameId: string, text: string) => {
    try {
      setLoading(true);
      await apiClient.commentOnGame(gameId, text);
      return true;
    } catch (error) {
      console.error('Failed to comment on game:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const shareGame = async (gameId: string) => {
    try {
      setLoading(true);
      await apiClient.shareGame(gameId);
      return true;
    } catch (error) {
      console.error('Failed to share game:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { likeGame, commentOnGame, shareGame, loading };
};

// Hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.login(email, password) as ApiResponse<{token: string, user: User}>;
      apiClient.setToken(response.data.token);
      setUser(response.data.user);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.register(userData) as ApiResponse<{token: string, user: User}>;
      apiClient.setToken(response.data.token);
      setUser(response.data.user);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      apiClient.setToken('');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { user, login, register, logout, loading, error };
};