import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface IconSymbolProps {
  name: string;
  size: number;
  color: string;
}

// Simple icon mapping using Unicode symbols
const iconMap: { [key: string]: string } = {
  'music.note': '♪',
  'gamecontroller.fill': '🎮',
  'person.3.fill': '👥',
  'chart.line.uptrend.xyaxis': '📈',
  'globe': '🌐',
  'apple.logo': '\uF8FF',
  'arrow.right': '→',
  'play.fill': '▶',
  'star.fill': '★',
  'heart.fill': '♥',
  'checkmark': '✓',
  'party.popper': '🎉',
  'sparkles': '✨',
  'person.badge.plus': '👤',
  'at': '@',
  'person.fill': '👤',
  'checkmark.circle.fill': '✅',
  'exclamationmark.circle.fill': '⚠️',
  'lightbulb.fill': '💡',
  'arrow.left': '←',
  'phone.fill': '📞',
  'chevron.down': '▼',
  'xmark': '✕',
  'chevron.right': '›',
  'safari.fill': '🧭',
  'line.horizontal.3': '☰',
  'gearshape.fill': '⚙️',
  'questionmark.circle.fill': '❓',
  'rectangle.portrait.and.arrow.right': '🚪',
  'clock.fill': '🕐',
  'play.circle.fill': '▶️',
  'ellipsis': '•••',
  'magnifyingglass': '🔍',
  'xmark.circle.fill': '✕',
  'bubble.right': '💬',
  'square.and.arrow.up': '📤',
  'bookmark': '🔖',
  'bookmark.fill': '🔖',
  'heart': '♡',
  'message': '💬',
  'exclamationmark.triangle': '⚠️',
};

export const IconSymbol: React.FC<IconSymbolProps> = ({ name, size, color }) => {
  const iconSymbol = iconMap[name] || '?';
  
  // Make Apple logo larger while keeping container size the same
  const fontSize = name === 'apple.logo' ? size * 0.972 : size * 0.7;
  
  // Move Apple logo up slightly
  const containerStyle = name === 'apple.logo' 
    ? [styles.container, { width: size, height: size, marginTop: -2 }]
    : [styles.container, { width: size, height: size }];

  return (
    <View style={containerStyle}>
      <Text style={[styles.icon, { fontSize, color }]}>
        {iconSymbol}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});