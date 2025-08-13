import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { AppColors } from '../../utils/colors';
import { router } from 'expo-router';

interface UserData {
  username: string;
  email: string;
  userSince: string;
  level: number;
  bio: string;
  location: string;
  gamesPlayed: number;
  highScore: number;
  totalScore: number;
  winRate: number;
  averageScore: number;
}

interface RecentGame {
  id: string;
  gameName: string;
  score: number;
  date: string;
  duration: string;
  difficulty: string;
  rank: number;
  gameType: string;
}

const dummyUserData: UserData = {
  username: 'GameMaster2024',
  email: 'alex.gaming@example.com',
  userSince: 'March 2023',
  level: 42,
  bio: '',
  location: 'San Francisco, CA',
  gamesPlayed: 47,
  highScore: 9850,
  totalScore: 125600,
  winRate: 73.4,
  averageScore: 2672,
};

const dummyRecentGames: RecentGame[] = [
  {
    id: '1',
    gameName: 'Flappy Bird',
    score: 9850,
    date: '2 hours ago',
    duration: '5m 23s',
    difficulty: 'Hard',
    rank: 1,
    gameType: 'Arcade'
  },
  {
    id: '2',
    gameName: 'Snake Game',
    score: 2450,
    date: '1 day ago',
    duration: '3m 45s',
    difficulty: 'Medium',
    rank: 5,
    gameType: 'Classic'
  },
  {
    id: '3',
    gameName: 'Tetris',
    score: 5670,
    date: '2 days ago',
    duration: '8m 12s',
    difficulty: 'Hard',
    rank: 2,
    gameType: 'Puzzle'
  },
  {
    id: '4',
    gameName: 'Space Invaders',
    score: 3200,
    date: '3 days ago',
    duration: '6m 30s',
    difficulty: 'Easy',
    rank: 8,
    gameType: 'Shooter'
  }
];

export default function ProfileScreen() {
  const userData = dummyUserData;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.circle.fill" size={80} color={AppColors.primary} />
            <View style={styles.levelBadge}>
              <ThemedText style={styles.levelText}>{userData.level}</ThemedText>
            </View>
          </View>
          
          <View style={styles.userInfo}>
            <ThemedText style={styles.username}>{userData.username}</ThemedText>
            <ThemedText style={styles.email}>{userData.email}</ThemedText>
            {userData.bio ? <ThemedText style={styles.bio}>{userData.bio}</ThemedText> : null}
            
            <View style={styles.userMeta}>
              <View style={styles.metaItem}>
                <IconSymbol name="location.fill" size={14} color={AppColors.secondary} />
                <ThemedText style={styles.metaText}>{userData.location}</ThemedText>
              </View>
              <View style={styles.metaItem}>
                <IconSymbol name="calendar" size={14} color={AppColors.secondary} />
                <ThemedText style={styles.metaText}>Since {userData.userSince}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <ThemedText style={styles.sectionTitle}>Game Stats</ThemedText>
          
          <View style={styles.statsGrid}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <IconSymbol name="gamecontroller.fill" size={16} color={AppColors.primary} />
                <View style={styles.statContent}>
                  <ThemedText style={styles.statValue}>{userData.gamesPlayed}</ThemedText>
                  <ThemedText style={styles.statLabel}>Games Played</ThemedText>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <IconSymbol name="trophy.fill" size={16} color={AppColors.secondary} />
                <View style={styles.statContent}>
                  <ThemedText style={styles.statValue}>{userData.highScore.toLocaleString()}</ThemedText>
                  <ThemedText style={styles.statLabel}>High Score</ThemedText>
                </View>
              </View>
            </View>
            
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <IconSymbol name="sum" size={16} color={AppColors.accent} />
                <View style={styles.statContent}>
                  <ThemedText style={styles.statValue}>{userData.totalScore.toLocaleString()}</ThemedText>
                  <ThemedText style={styles.statLabel}>Total Score</ThemedText>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <IconSymbol name="percent" size={16} color={AppColors.success} />
                <View style={styles.statContent}>
                  <ThemedText style={styles.statValue}>{userData.winRate}%</ThemedText>
                  <ThemedText style={styles.statLabel}>Win Rate</ThemedText>
                </View>
              </View>
            </View>
            
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <IconSymbol name="chart.bar.fill" size={16} color={AppColors.primary} />
                <View style={styles.statContent}>
                  <ThemedText style={styles.statValue}>{userData.averageScore.toLocaleString()}</ThemedText>
                  <ThemedText style={styles.statLabel}>Avg Score</ThemedText>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <IconSymbol name="clock.fill" size={16} color={AppColors.warning} />
                <View style={styles.statContent}>
                  <ThemedText style={styles.statValue}>2h 45m</ThemedText>
                  <ThemedText style={styles.statLabel}>Play Time</ThemedText>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.recentGamesContainer}>
          <ThemedText style={styles.sectionTitle}>Recent Games</ThemedText>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gamesScroll}>
            {dummyRecentGames.map((game) => (
              <View key={game.id} style={styles.gameCard}>
                <View style={styles.gameCardHeader}>
                  <View style={styles.gameIconSmall}>
                    <IconSymbol name="gamecontroller.fill" size={14} color={AppColors.primary} />
                  </View>
                  <View style={styles.gameRank}>
                    <ThemedText style={styles.gameRankText}>#{game.rank}</ThemedText>
                  </View>
                </View>
                
                <ThemedText style={styles.gameCardName}>{game.gameName}</ThemedText>
                <ThemedText style={styles.gameCardScore}>{game.score.toLocaleString()}</ThemedText>
                <ThemedText style={styles.gameCardDate}>{game.date}</ThemedText>
                
                <TouchableOpacity style={styles.playButton}>
                  <IconSymbol name="play.circle.fill" size={16} color={AppColors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="gearshape.fill" size={20} color={AppColors.primary} />
            <ThemedText style={styles.actionButtonText}>Settings</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="questionmark.circle.fill" size={20} color={AppColors.primary} />
            <ThemedText style={styles.actionButtonText}>Help & Support</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={AppColors.error} />
            <ThemedText style={[styles.actionButtonText, styles.logoutButtonText]}>Logout</ThemedText>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: AppColors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F5F5F5',
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#333333',
  },
  email: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  bio: {
    fontSize: 13,
    marginBottom: 8,
    color: '#666666',
  },
  userMeta: {
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    color: '#666666',
  },
  statsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  statsGrid: {
    gap: 4,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 6,
    backgroundColor: 'transparent',
    borderRadius: 6,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  statContent: {
    marginLeft: 6,
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 0,
    color: '#333333',
  },
  statLabel: {
    fontSize: 10,
    color: '#666666',
  },
  recentGamesContainer: {
    marginBottom: 16,
  },
  gamesScroll: {
    paddingRight: 20,
  },
  gameCard: {
    width: 110,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  gameCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  gameIconSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameRank: {
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  gameRankText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  gameCardName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#333333',
  },
  gameCardScore: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 2,
    textAlign: 'center',
  },
  gameCardDate: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 4,
    textAlign: 'center',
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  actionsContainer: {
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    marginBottom: 8,
  },
  actionButtonText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  logoutButton: {
    marginTop: 12,
  },
  logoutButtonText: {
    color: AppColors.error,
  },
});