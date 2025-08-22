// Example: Using the Musical Game SDK
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameSDKWrapper } from '../components/games/GameSDKWrapper';

// Example 1: SDK Mode - Integrate games into your app
export const SDKModeExample: React.FC = () => {
  const [gameResults, setGameResults] = useState<any>(null);

  const handleGameEnd = (score: number, content: any) => {
    console.log('Game ended with score:', score);
    console.log('Content data:', content);
    setGameResults({ score, content });
    // Send score to your backend, update user progress, etc.
  };

  const handleContentLoad = (content: any) => {
    console.log('Content loaded:', content);
  };

  const handleError = (error: any) => {
    console.error('SDK Error:', error);
  };

  return (
    <View style={styles.container}>
      <GameSDKWrapper
        gameId="vocal-training"
        contentId="550e8400-e29b-41d4-a716-446655440000"
        mode="sdk"
        apiBaseUrl="https://your-api.com"
        onGameEnd={handleGameEnd}
        onContentLoad={handleContentLoad}
        onError={handleError}
      />
      
      {gameResults && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            Last Score: {gameResults.score}
          </Text>
        </View>
      )}
    </View>
  );
};

// Example 2: Player Mode - Standalone game player
export const PlayerModeExample: React.FC = () => {
  return (
    <View style={styles.container}>
      <GameSDKWrapper
        gameId="flappy-bird"
        contentId="content-id-for-flappy-bird"
        mode="player"
        apiBaseUrl="https://your-api.com"
      />
    </View>
  );
};

// Example 3: Vocal Training Game with Custom Content
export const VocalTrainingExample: React.FC = () => {
  return (
    <View style={styles.container}>
      <GameSDKWrapper
        gameId="vocal-training"
        contentId="vocal-scale-c-major"
        mode="sdk"
        apiBaseUrl="https://api.softroniclabs.com"
        onGameEnd={(score, content) => {
          // Handle vocal training results
          console.log('Vocal training completed:', { score, content });
        }}
        onContentLoad={(content) => {
          console.log('Vocal exercise loaded:', content);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultsContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  resultsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});