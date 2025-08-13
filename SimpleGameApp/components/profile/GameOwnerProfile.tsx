import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { IconSymbol } from '../ui/IconSymbol';
import { AppColors } from '../../utils/colors';

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
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <IconSymbol name="person.circle.fill" size={60} color={AppColors.primary} />
        </View>
        <View style={styles.ownerInfo}>
          <ThemedText style={styles.ownerName}>{ownerName}</ThemedText>
          <ThemedText style={styles.ownerTitle}>Game Developer</ThemedText>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{gamesCreated}</ThemedText>
          <ThemedText style={styles.statLabel}>Games</ThemedText>
        </View>
        
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{totalPlays}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Plays</ThemedText>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={16} color={AppColors.secondary} />
            <ThemedText style={styles.statValue}>{rating.toFixed(1)}</ThemedText>
          </View>
          <ThemedText style={styles.statLabel}>Rating</ThemedText>
        </View>
      </View>

      {onContactOwner && (
        <TouchableOpacity style={styles.contactButton} onPress={onContactOwner}>
          <IconSymbol name="message.fill" size={16} color="white" />
          <ThemedText style={styles.contactButtonText}>Contact Developer</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    opacity: 0.7,
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
    opacity: 0.7,
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
    backgroundColor: AppColors.primary,
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