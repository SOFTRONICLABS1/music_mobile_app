import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { IconSymbol } from '../ui/IconSymbol';
import { GameSDK, GameLauncher } from '@softroniclabs_platforms/musical-game-sdk';

interface GameSDKWrapperProps {
  contentId: string;
  gameId: string;
  apiBaseUrl?: string;
  mode?: 'sdk' | 'player';
  onContentLoad?: (content: any) => void;
  onGameEnd?: (score: any, content: any) => void;
  onError?: (error: any) => void;
}

export const GameSDKWrapper: React.FC<GameSDKWrapperProps> = (props) => {
  const {
    contentId,
    gameId,
    apiBaseUrl = "https://api.softroniclabs.com",
    mode = 'sdk',
    onContentLoad,
    onGameEnd,
    onError
  } = props;
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [contentData, setContentData] = useState<any>(null);

  const createMockContentData = () => {
    // Create mock content data structure matching your database
    const mockContentData = {
      id: contentId,
      user_id: "mock-user-uuid",
      title: gameId === 'vocal-training' ? "Vocal Scale Exercise" : "Musical Game",
      description: gameId === 'vocal-training' 
        ? "Practice singing a C major scale" 
        : "Interactive musical game experience",
      notes_data: [
        {
          frequency: 261.63, // C4
          duration: 500,
          startTime: 0,
          pitch: "C4",
          octave: 4
        },
        {
          frequency: 293.66, // D4
          duration: 500,
          startTime: 500,
          pitch: "D4",
          octave: 4
        },
        {
          frequency: 329.63, // E4
          duration: 500,
          startTime: 1000,
          pitch: "E4",
          octave: 4
        },
      ],
      tempo: 80,
      is_public: true,
      access_type: "free",
      tags: ["vocal", "scale", "beginner"],
      play_count: 0,
      avg_score: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return mockContentData;
  };

  // Initialize SDK
  useEffect(() => {
    if (!contentId || !gameId) {
      const errorMessage = `Missing required parameters: ${!contentId ? 'contentId' : ''} ${!gameId ? 'gameId' : ''}`.trim();
      setError(errorMessage);
      setGameState('error');
      if (onError) {
        onError(new Error(errorMessage));
      }
      return;
    }

    const initializeSDK = async () => {
      try {
        setGameState('loading');
        
        // Initialize SDK with game configuration
        const sdk = new GameSDK({
          gameId,
          contentId,
          mode,
          apiBaseUrl
        });

        // Try to initialize and fetch content data
        await sdk.initialize();
        const content = sdk.getContentData();
        
        setContentData(content);
        setGameState('ready');
        
        if (onContentLoad) {
          onContentLoad(content);
        }
        
      } catch (err) {
        console.warn('SDK initialization failed, using mock data:', err);
        
        // Fallback to mock content data
        const mockContent = createMockContentData();
        
        setContentData(mockContent);
        setGameState('ready');
        
        if (onContentLoad) {
          onContentLoad(mockContent);
        }
      }
    };

    initializeSDK();
  }, [contentId, gameId, mode, apiBaseUrl]);

  const handleGameEnd = (score: number) => {
    console.log('Game ended with score:', score);
    
    if (onGameEnd && contentData) {
      onGameEnd(score, contentData);
    }
  };

  const handleRetry = () => {
    setGameState('loading');
    setError(null);
    // Re-initialize SDK
    const initializeSDK = async () => {
      try {
        const sdk = new GameSDK({
          gameId,
          contentId,
          mode,
          apiBaseUrl
        });

        await sdk.initialize();
        const content = sdk.getContentData();
        
        setContentData(content);
        setGameState('ready');
        
      } catch (err) {
        console.warn('SDK initialization failed on retry, using mock data:', err);
        
        // Fallback to mock content data
        const mockContent = createMockContentData();
        
        setContentData(mockContent);
        setGameState('ready');
      }
    };

    initializeSDK();
  };

  if (gameState === 'loading') {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading Game...</Text>
          <Text style={styles.subtitle}>Content ID: {contentId}</Text>
          <Text style={styles.subtitle}>Game ID: {gameId}</Text>
          <Text style={styles.subtitle}>Mode: {mode}</Text>
        </View>
      </View>
    );
  }

  if (gameState === 'error') {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={60} color="#FF3B30" />
          <Text style={styles.errorTitle}>Error Loading Game</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>🔄 Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (gameState === 'ready' && contentData) {
    console.log('Rendering GameLauncher with:', { 
      gameId, 
      mode, 
      contentData: contentData,
      hasGameLauncher: !!GameLauncher 
    });
    
    // Debug: Check if GameLauncher exists
    if (!GameLauncher) {
      console.error('GameLauncher component not found in SDK');
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>SDK Error</Text>
          <Text style={styles.errorMessage}>GameLauncher component not found</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.container}>
        <GameLauncher
          gameId={gameId}
          contentData={contentData}
          onGameEnd={handleGameEnd}
          mode={mode}
        />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 40,
  },
  loadingText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    marginVertical: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 40,
  },
  errorTitle: {
    color: '#FF3B30',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#CCC',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});