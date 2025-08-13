import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 200;
const GRAVITY = 3;
const JUMP_STRENGTH = -12;

export default function FlappyBirdGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameOver'>('ready');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(42);
  
  const birdY = useRef(new Animated.Value(SCREEN_HEIGHT / 2)).current;
  const birdVelocity = useRef(0);
  const pipeX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const pipeHeight = useRef(Math.random() * (SCREEN_HEIGHT * 0.4) + 50).current;
  
  const gameLoop = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    birdY.setValue(SCREEN_HEIGHT / 2);
    birdVelocity.current = 0;
    pipeX.setValue(SCREEN_WIDTH);
    
    // Start pipe animation
    Animated.loop(
      Animated.timing(pipeX, {
        toValue: -PIPE_WIDTH,
        duration: 3000,
        useNativeDriver: false,
      })
    ).start();

    // Start game physics
    gameLoop.current = setInterval(() => {
      updateGame();
    }, 16) as NodeJS.Timeout;
  };

  const updateGame = () => {
    if (gameState !== 'playing') return;
    
    // Update bird physics
    birdVelocity.current += GRAVITY;
    const currentY = (birdY as any)._value + birdVelocity.current;
    
    // Check bounds
    if (currentY < 0 || currentY > SCREEN_HEIGHT - 100) {
      gameOver();
      return;
    }
    
    birdY.setValue(currentY);
    
    // Check pipe collision (simplified)
    const pipeXValue = (pipeX as any)._value;
    if (pipeXValue < 100 && pipeXValue > -PIPE_WIDTH) {
      if (currentY < pipeHeight || currentY + BIRD_SIZE > pipeHeight + PIPE_GAP) {
        gameOver();
        return;
      }
    }
    
    // Score when passing pipe
    if (pipeXValue < 50 && pipeXValue > 40) {
      setScore(prev => prev + 1);
    }
    
    // Reset pipe position
    if (pipeXValue < -PIPE_WIDTH) {
      pipeX.setValue(SCREEN_WIDTH);
      (pipeHeight as any).current = Math.random() * (SCREEN_HEIGHT * 0.4) + 50;
    }
  };

  const jump = () => {
    if (gameState === 'ready') {
      startGame();
      return;
    }
    
    if (gameState === 'playing') {
      birdVelocity.current = JUMP_STRENGTH;
    }
    
    if (gameState === 'gameOver') {
      resetGame();
    }
  };

  const gameOver = () => {
    setGameState('gameOver');
    if (gameLoop.current) {
      clearInterval(gameLoop.current);
    }
    pipeX.stopAnimation();
    
    if (score > highScore) {
      setHighScore(score);
      Alert.alert('New High Score!', `Amazing! You scored ${score} points!`);
    }
  };

  const resetGame = () => {
    setGameState('ready');
    setScore(0);
    birdY.setValue(SCREEN_HEIGHT / 2);
    birdVelocity.current = 0;
    pipeX.setValue(SCREEN_WIDTH);
    if (gameLoop.current) {
      clearInterval(gameLoop.current);
    }
  };

  const goBack = () => {
    if (gameLoop.current) {
      clearInterval(gameLoop.current);
    }
    pipeX.stopAnimation();
    router.back();
  };

  useEffect(() => {
    return () => {
      if (gameLoop.current) {
        clearInterval(gameLoop.current);
      }
      pipeX.stopAnimation();
    };
  }, [pipeX]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.gameArea} 
        onPress={jump}
        activeOpacity={1}
      >
        {/* Sky background */}
        <View style={styles.sky} />
        
        {/* Ground */}
        <View style={styles.ground} />
        
        {/* Bird */}
        <Animated.View 
          style={[
            styles.bird,
            {
              left: 80,
              top: birdY,
            }
          ]}
        >
          <Text style={styles.birdEmoji}>🐦</Text>
        </Animated.View>
        
        {/* Pipes */}
        <Animated.View
          style={[
            styles.pipeContainer,
            { left: pipeX }
          ]}
        >
          {/* Top pipe */}
          <View 
            style={[
              styles.pipe,
              styles.topPipe,
              { height: pipeHeight }
            ]} 
          />
          {/* Bottom pipe */}
          <View 
            style={[
              styles.pipe,
              styles.bottomPipe,
              { 
                height: SCREEN_HEIGHT - pipeHeight - PIPE_GAP - 100,
                top: pipeHeight + PIPE_GAP
              }
            ]} 
          />
        </Animated.View>
        
        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{score}</Text>
        </View>
        
        {/* Game State Overlays */}
        {gameState === 'ready' && (
          <View style={styles.overlay}>
            <Text style={styles.title}>🐦 Flappy Bird</Text>
            <Text style={styles.instruction}>Tap to start!</Text>
          </View>
        )}
        
        {gameState === 'gameOver' && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverTitle}>Game Over!</Text>
            <Text style={styles.finalScore}>Score: {score} • Best: {highScore}</Text>
            <TouchableOpacity style={styles.playAgainButton} onPress={jump}>
              <Text style={styles.playAgainText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
      
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 100,
    backgroundColor: '#87CEEB',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#DEB887',
    borderTopWidth: 3,
    borderTopColor: '#CD853F',
  },
  bird: {
    position: 'absolute',
    width: BIRD_SIZE,
    height: BIRD_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  birdEmoji: {
    fontSize: 25,
  },
  pipeContainer: {
    position: 'absolute',
    width: PIPE_WIDTH,
    height: SCREEN_HEIGHT,
  },
  pipe: {
    position: 'absolute',
    width: PIPE_WIDTH,
    backgroundColor: '#228B22',
    borderWidth: 2,
    borderColor: '#006400',
  },
  topPipe: {
    top: 0,
    borderBottomWidth: 4,
    borderBottomColor: '#006400',
  },
  bottomPipe: {
    borderTopWidth: 4,
    borderTopColor: '#006400',
  },
  scoreContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
  },
  instruction: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 16,
  },
  finalScore: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  playAgainButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 40,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});