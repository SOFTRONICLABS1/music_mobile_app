import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Alert, Text } from 'react-native';
import { IconSymbol } from '../ui/IconSymbol';
import { GameSDKWrapper } from '../games/GameSDKWrapper';
import { useTheme } from '@/theme/ThemeContext';

interface GameSDKModalProps {
  visible: boolean;
  onClose: () => void;
  contentId?: string;
  gameId?: string;
  gameTitle: string;
}

export const GameSDKModal: React.FC<GameSDKModalProps> = ({
  visible,
  onClose,
  contentId,
  gameId,
  gameTitle
}) => {
  const { theme } = useTheme();
  const [gameStarted, setGameStarted] = useState(false);

  const handleContentLoad = (content: any) => {
    console.log('Game content loaded:', content);
    setGameStarted(true);
  };

  const handleGameEnd = (score: any, content: any) => {
    console.log('Game ended:', { score, content });
    Alert.alert(
      'Game Finished!',
      `Your score: ${score}\nGame: ${content.title}`,
      [
        { text: 'Play Again', onPress: () => setGameStarted(false) },
        { text: 'Close', onPress: onClose }
      ]
    );
  };

  const handleError = (error: any) => {
    console.error('GameSDK Error:', error);
    Alert.alert(
      'Game Error',
      error.message || 'Failed to load game',
      [{ text: 'OK', onPress: onClose }]
    );
  };

  const handleClose = () => {
    setGameStarted(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Close button */}
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={handleClose}
        >
          <IconSymbol name="xmark" size={24} color={theme.text} />
        </TouchableOpacity>

        {/* Game SDK Content */}
        <View style={styles.gameContainer}>
          {contentId && gameId ? (
            <GameSDKWrapper
              contentId={contentId}
              gameId={gameId}
              onContentLoad={handleContentLoad}
              onGameEnd={handleGameEnd}
              onError={handleError}
            />
          ) : (
            <View style={styles.errorContainer}>
              <IconSymbol name="exclamationmark.triangle" size={48} color={theme.error} />
              <Text style={[styles.errorText, { color: theme.error }]}>
                Missing required parameters: contentId or gameId
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 44, // Safe area padding for iOS
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  gameContainer: {
    flex: 1,
    marginTop: 60,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});