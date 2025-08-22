import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

interface MusicNote {
  id: string;
  note: string;
  timing: number;
  duration: number;
  pitch?: number;
}

interface MusicVisualizerProps {
  musicNotes: MusicNote[];
  currentPosition: number;
  isPlaying: boolean;
  height?: number;
  color?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const MusicVisualizer: React.FC<MusicVisualizerProps> = ({
  musicNotes,
  currentPosition,
  isPlaying,
  height = 60,
  color
}) => {
  const { theme } = useTheme();
  const animatedValues = useRef<Animated.Value[]>([]);
  const [bars, setBars] = useState<number[]>([]);
  
  const visualizerColor = color || theme.primary;
  const numBars = 20;

  useEffect(() => {
    // Initialize animated values
    if (animatedValues.current.length === 0) {
      animatedValues.current = Array.from({ length: numBars }, () => new Animated.Value(0.2));
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      // Stop all animations when paused
      animatedValues.current.forEach(animValue => {
        animValue.stopAnimation();
        Animated.timing(animValue, {
          toValue: 0.2,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
      return;
    }

    // Generate bars based on music notes and current position
    const generateBars = () => {
      const newBars: number[] = [];
      
      for (let i = 0; i < numBars; i++) {
        let barHeight = 0.2;
        
        // Find notes that should affect this bar
        musicNotes.forEach((note, noteIndex) => {
          const noteStart = note.timing;
          const noteEnd = note.timing + note.duration;
          
          // Check if current position is within this note's timeframe
          if (currentPosition >= noteStart && currentPosition <= noteEnd) {
            // Map bar index to frequency range
            const frequency = note.pitch || (noteIndex * 50 + 200);
            const barFrequency = (i / numBars) * 1000 + 200;
            
            // Create resonance effect based on frequency proximity
            const frequencyDiff = Math.abs(frequency - barFrequency);
            const resonance = Math.max(0, 1 - (frequencyDiff / 200));
            
            // Add some randomness for visual appeal
            const randomFactor = 0.5 + Math.random() * 0.5;
            
            barHeight = Math.max(barHeight, resonance * randomFactor);
          }
        });
        
        // Add ambient movement when no specific notes are playing
        if (barHeight <= 0.2) {
          barHeight = 0.1 + Math.random() * 0.3;
        }
        
        newBars.push(Math.min(1, barHeight));
      }
      
      setBars(newBars);
      
      // Animate bars
      newBars.forEach((barHeight, index) => {
        if (animatedValues.current[index]) {
          Animated.timing(animatedValues.current[index], {
            toValue: barHeight,
            duration: 150,
            useNativeDriver: false,
          }).start();
        }
      });
    };

    generateBars();
    
    // Update visualization frequently for smooth animation
    const interval = setInterval(generateBars, 100);
    
    return () => clearInterval(interval);
  }, [currentPosition, isPlaying, musicNotes]);

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.barsContainer}>
        {Array.from({ length: numBars }, (_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                backgroundColor: visualizerColor,
                height: animatedValues.current[index]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, height - 4],
                  extrapolate: 'clamp',
                }) || 2,
                opacity: animatedValues.current[index]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                  extrapolate: 'clamp',
                }) || 0.3,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  bar: {
    width: 3,
    borderRadius: 2,
    marginHorizontal: 1,
  },
});