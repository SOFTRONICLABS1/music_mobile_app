import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { IconSymbol } from '../ui/IconSymbol';
import { AppColors } from '../../utils/colors';

interface UserProfileProps {
  username: string;
  email: string;
  gamesPlayed: number;
  highScore: number;
}

export default function UserProfile({ username, email, gamesPlayed, highScore }: UserProfileProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <IconSymbol name="person.circle.fill" size={80} color={AppColors.primary} />
        </View>
        <ThemedText style={styles.username}>{username}</ThemedText>
        <ThemedText style={styles.email}>{email}</ThemedText>
      </View>

      <View style={styles.statsContainer}>
        <ThemedText style={styles.sectionTitle}>Gaming Stats</ThemedText>
        
        <View style={styles.statItem}>
          <IconSymbol name="gamecontroller.fill" size={24} color={AppColors.primary} />
          <View style={styles.statContent}>
            <ThemedText style={styles.statLabel}>Games Played</ThemedText>
            <ThemedText style={styles.statValue}>{gamesPlayed}</ThemedText>
          </View>
        </View>

        <View style={styles.statItem}>
          <IconSymbol name="trophy.fill" size={24} color={AppColors.secondary} />
          <View style={styles.statContent}>
            <ThemedText style={styles.statLabel}>High Score</ThemedText>
            <ThemedText style={styles.statValue}>{highScore}</ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  statsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    marginBottom: 10,
  },
  statContent: {
    marginLeft: 15,
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});