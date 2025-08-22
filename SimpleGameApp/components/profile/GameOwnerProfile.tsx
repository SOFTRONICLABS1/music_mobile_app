import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { IconSymbol } from '../ui/IconSymbol';
import { useTheme } from '@/theme/ThemeContext';

interface GameOwnerProfileProps {
  ownerName: string;
  gamesCreated: number;
  totalPlays: number;
  rating: number;
  onContactOwner?: () => void;
}

export default function GameOwnerProfile({ 
  ownerName, 
  gamesCreated, 
  totalPlays, 
  rating,
  onContactOwner 
}: GameOwnerProfileProps) {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { 
      backgroundColor: theme.card,
      borderColor: theme.border
    }]}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <IconSymbol name="person.circle.fill" size={60} color={theme.primary} />
        </View>
        <View style={styles.ownerInfo}>
          <Text style={[styles.ownerName, { color: theme.text }]}>{ownerName}</Text>
          <Text style={[styles.ownerTitle, { color: theme.textSecondary }]}>Game Developer</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>{gamesCreated}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Games</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>{totalPlays}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Plays</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={16} color={theme.success} />
            <Text style={[styles.statValue, { color: theme.text }]}>{rating.toFixed(1)}</Text>
          </View>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Rating</Text>
        </View>
      </View>

      {onContactOwner && (
        <TouchableOpacity style={[styles.contactButton, { backgroundColor: theme.primary }]} onPress={onContactOwner}>
          <IconSymbol name="message.fill" size={16} color="white" />
          <Text style={styles.contactButtonText}>Contact Developer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  ownerTitle: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});