import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView, Text, Modal, Image } from 'react-native';
import { IconSymbol } from '../components/ui/IconSymbol';
import { useTheme } from '../theme/ThemeContext';

const dummyUserData = {
  username: 'MusicMaster2024',
  email: 'alex.music@example.com',
  userSince: 'March 2023',
  level: 42,
  bio: 'Music lover 🎵 Creating playlists and sharing musical experiences! Sing to play games 🎮',
  location: 'San Francisco, CA',
  followers: 1247,
  following: 382,
  totalPlaylists: 5,
  totalPlays: 45800,
  playlists: [
    {
      id: '1',
      name: 'Pop Hits Favorites',
      description: 'My favorite pop songs to sing along with',
      thumbnail: 'https://picsum.photos/200/200?random=1',
      trackCount: 8,
      musicVideos: [
        {
          id: '1',
          title: 'Shape of You',
          artist: 'Ed Sheeran',
          duration: '3:45',
          difficulty: 'Medium',
          genre: 'Pop',
          likes: 1250,
          plays: 15000,
          isGameEnabled: true
        },
        {
          id: '2',
          title: 'Blinding Lights',
          artist: 'The Weeknd',
          duration: '3:22',
          difficulty: 'Hard',
          genre: 'Synth-pop',
          likes: 980,
          plays: 12000,
          isGameEnabled: true
        }
      ]
    },
    {
      id: '2',
      name: 'Chill Vibes',
      description: 'Relaxing songs for peaceful moments',
      thumbnail: 'https://picsum.photos/200/200?random=2',
      trackCount: 6,
      musicVideos: []
    },
    {
      id: '3',
      name: 'Rock Anthems',
      description: 'Powerful rock songs to energize your day',
      thumbnail: 'https://picsum.photos/200/200?random=3',
      trackCount: 12,
      musicVideos: []
    }
  ],
  recentGames: [
    {
      id: '1',
      gameName: 'Vocal Training',
      score: 9850,
      date: '2 hours ago',
      duration: '5m 23s',
      difficulty: 'Hard',
      rank: 1,
      gameType: 'Voice'
    },
    {
      id: '2',
      gameName: 'Pitch Perfect',
      score: 2450,
      date: '1 day ago',
      duration: '3m 45s',
      difficulty: 'Medium',
      rank: 5,
      gameType: 'Challenge'
    },
    {
      id: '3',
      gameName: 'Rhythm Master',
      score: 5670,
      date: '2 days ago',
      duration: '8m 12s',
      difficulty: 'Hard',
      rank: 2,
      gameType: 'Rhythm'
    },
    {
      id: '4',
      gameName: 'Melody Match',
      score: 3200,
      date: '3 days ago',
      duration: '6m 30s',
      difficulty: 'Easy',
      rank: 8,
      gameType: 'Memory'
    }
  ]
};

export default function ProfileScreen() {
  const { theme } = useTheme();
  const userData = dummyUserData;
  const [showMenu, setShowMenu] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const handleLogout = () => {
    setShowMenu(false);
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Navigate back to login
            console.log('User logged out');
          },
        },
      ]
    );
  };

  const handleSettings = () => {
    setShowMenu(false);
    Alert.alert('Settings', 'Settings screen coming soon!');
  };

  const handleSupport = () => {
    setShowMenu(false);
    Alert.alert('Support', 'Contact support at support@musicapp.com');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      case 'Expert': return '#9C27B0';
      default: return '#666666';
    }
  };

  const handlePlaylistPress = (playlist) => {
    setSelectedPlaylist(playlist);
    setShowPlaylistModal(true);
  };

  const handlePlayGame = (gameName) => {
    Alert.alert('Game Launch', `Starting ${gameName}...`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header with hamburger menu */}
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <View style={{ width: 40 }} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setShowMenu(true)}
          >
            <IconSymbol name="line.horizontal.3" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: theme.surface }]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.surfacePlus || theme.border }]}>
                <IconSymbol name="person.fill" size={40} color={theme.textSecondary} />
              </View>
              <View style={[styles.levelBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.levelText}>{userData.level}</Text>
              </View>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.fullName, { color: theme.text }]}>{userData.username}</Text>
              </View>
              <Text style={[styles.email, { color: theme.textSecondary }]}>@{userData.email.split('@')[0]}</Text>
              
              {/* Edit Profile Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.editProfileButton, { backgroundColor: theme.surface, borderColor: theme.border }]} 
                  onPress={() => Alert.alert('Edit Profile', 'Edit profile functionality coming soon!')}
                >
                  <Text style={[styles.editProfileButtonText, { color: theme.text }]}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={[styles.bio, { color: theme.textSecondary }]}>{userData.bio}</Text>

          {/* Social Stats */}
          <View style={[styles.statsContainer, { borderTopColor: theme.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>{userData.followers.toLocaleString()}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>{userData.following.toLocaleString()}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Following</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>{userData.totalPlaylists}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Playlists</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>{(userData.totalPlays / 1000).toFixed(0)}K</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Plays</Text>
            </View>
          </View>
        </View>

        {/* Recent Games Section */}
        <View style={styles.recentGamesSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Games</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gamesScroll}>
            {userData.recentGames.map((game) => (
              <TouchableOpacity 
                key={game.id}
                style={[styles.gameReelCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => handlePlayGame(game.gameName)}
              >
                <View style={styles.gameIconContainer}>
                  <View style={[styles.gameIcon, { backgroundColor: theme.surfacePlus || theme.border }]}>
                    <IconSymbol name="gamecontroller.fill" size={20} color={theme.primary} />
                  </View>
                  
                  {/* Difficulty Badge */}
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(game.difficulty) }]}>
                    <Text style={styles.difficultyText}>{game.difficulty}</Text>
                  </View>
                  
                  {/* Rank Badge */}
                  <View style={[styles.rankBadge, { backgroundColor: theme.primary }]}>
                    <Text style={styles.rankText}>#{game.rank}</Text>
                  </View>
                </View>
                
                <View style={styles.gameInfo}>
                  <Text style={[styles.gameTitle, { color: theme.text }]} numberOfLines={2}>
                    {game.gameName}
                  </Text>
                  <Text style={[styles.gameScore, { color: theme.primary }]}>{game.score.toLocaleString()}</Text>
                  <View style={styles.gameStats}>
                    <View style={styles.gameStat}>
                      <IconSymbol name="clock.fill" size={12} color={theme.textSecondary} />
                      <Text style={[styles.gameStatText, { color: theme.textSecondary }]}>
                        {game.duration}
                      </Text>
                    </View>
                    <View style={styles.gameStat}>
                      <Text style={[styles.gameStatText, { color: theme.textTertiary || theme.textSecondary }]}>
                        {game.date}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* My Playlists Section */}
        <View style={styles.playlistsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>My Playlists</Text>
          
          {userData.playlists.map((playlist) => (
            <TouchableOpacity 
              key={playlist.id}
              style={[styles.playlistCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => handlePlaylistPress(playlist)}
            >
              <View style={styles.playlistCardContent}>
                <View style={styles.playlistImageContainer}>
                  {playlist.thumbnail ? (
                    <Image source={{ uri: playlist.thumbnail }} style={styles.playlistThumbnail} />
                  ) : (
                    <View style={[styles.playlistThumbnailPlaceholder, { backgroundColor: theme.surfacePlus || theme.border }]}>
                      <IconSymbol name="music.note" size={24} color={theme.primary} />
                    </View>
                  )}
                  <View style={[styles.playOverlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                    <IconSymbol name="play.circle.fill" size={20} color="white" />
                  </View>
                </View>
                
                <View style={styles.playlistInfo}>
                  <Text style={[styles.playlistName, { color: theme.text }]} numberOfLines={2}>
                    {playlist.name}
                  </Text>
                  <Text style={[styles.playlistDescription, { color: theme.textSecondary }]} numberOfLines={1}>
                    {playlist.description}
                  </Text>
                  <Text style={[styles.playlistTrackCount, { color: theme.textTertiary || theme.textSecondary }]}>
                    {playlist.trackCount} tracks
                  </Text>
                </View>

                <TouchableOpacity style={styles.playlistMenuButton}>
                  <IconSymbol name="ellipsis" size={16} color={theme.textTertiary || theme.textSecondary} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          visible={showMenu}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowMenu(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            onPress={() => setShowMenu(false)}
          >
            <View style={[styles.menuContainer, { backgroundColor: theme.card || theme.surface, borderColor: theme.border }]}>
              <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
                <IconSymbol name="gearshape.fill" size={20} color={theme.text} />
                <Text style={[styles.menuText, { color: theme.text }]}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={handleSupport}>
                <IconSymbol name="questionmark.circle.fill" size={20} color={theme.text} />
                <Text style={[styles.menuText, { color: theme.text }]}>Help & Support</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={theme.error || '#FF3B30'} />
                <Text style={[styles.menuText, { color: theme.error || '#FF3B30' }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
  },
  profileSection: {
    padding: 20,
    marginBottom: 12,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
    marginTop: 8,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 12,
    width: '100%',
  },
  editProfileButton: {
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  editProfileButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
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
  recentGamesSection: {
    padding: 20,
    paddingBottom: 12,
  },
  gamesScroll: {
    paddingRight: 20,
  },
  gameReelCard: {
    width: 140,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
  },
  gameIconContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  gameIcon: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  rankBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rankText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  gameInfo: {
    minHeight: 60,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  gameScore: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gameStats: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  gameStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  gameStatText: {
    fontSize: 10,
  },
  playlistsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  playlistCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  playlistCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playlistImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  playlistThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  playlistThumbnailPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  playlistInfo: {
    flex: 1,
    marginRight: 8,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  playlistDescription: {
    fontSize: 13,
    marginBottom: 2,
  },
  playlistTrackCount: {
    fontSize: 11,
  },
  playlistMenuButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
});