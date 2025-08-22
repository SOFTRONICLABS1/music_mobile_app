import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView, SafeAreaView, Modal, Alert } from 'react-native';
import { IconSymbol } from '../ui/IconSymbol';
import { useTheme } from '@/theme/ThemeContext';
import { router } from 'expo-router';

interface MusicNote {
  id: string;
  note: string;
  timing: number;
  duration: number;
  pitch?: number;
}

interface MusicVideo {
  id: string;
  title: string;
  artist: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl: string;
  musicNotes: MusicNote[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  genre: string;
  likes: number;
  plays: number;
  isGameEnabled: boolean;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  trackCount: number;
  musicVideos: MusicVideo[];
}

interface FeaturedTrack {
  id: string;
  title: string;
  duration: string;
  plays: number;
}

interface CreatorData {
  username: string;
  avatar?: string;
  bio: string;
  followers: number;
  following: number;
  totalPlaylists: number;
  totalPlays: number;
  playlists: Playlist[];
  featuredTracks: FeaturedTrack[];
}

interface MusicCreatorProfileProps {
  creatorName: string;
  avatar?: string;
  followers: number;
  following: number;
  bio?: string;
  featuredTracks?: FeaturedTrack[];
  playlists?: Playlist[];
  onFollowToggle?: () => void;
  onMessage?: () => void;
}

export default function MusicCreatorProfile({ 
  creatorName, 
  avatar,
  followers,
  following,
  bio,
  featuredTracks = [],
  playlists = [],
  onFollowToggle,
  onMessage
}: MusicCreatorProfileProps) {
  const { theme } = useTheme();
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const safePlaylist = playlists || [];
  const safeFeaturedTracks = featuredTracks || [];
  
  const userData: CreatorData = {
    username: creatorName || 'Unknown User',
    avatar,
    bio: bio || 'Music creator and content maker',
    followers: followers || 0,
    following: following || 0,
    totalPlaylists: safePlaylist.length,
    totalPlays: safePlaylist.reduce((total, playlist) => {
      const musicVideos = playlist?.musicVideos || [];
      return total + musicVideos.length * 1000;
    }, 0),
    playlists: safePlaylist,
    featuredTracks: safeFeaturedTracks
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    onFollowToggle?.();
  };

  const handleMessagePress = () => {
    onMessage?.();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      case 'Expert': return '#9C27B0';
      default: return '#666666';
    }
  };

  const handlePlaylistPress = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setShowPlaylistModal(true);
  };

  const handlePlayFeaturedTrack = (trackTitle: string) => {
    Alert.alert('Playing Track', trackTitle);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="arrow.left" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: theme.surface }]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.surfacePlus }]}>
                  <IconSymbol name="person.fill" size={40} color={theme.textSecondary} />
                </View>
              )}
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.fullName, { color: theme.text }]}>{userData.username}</Text>
              </View>
              <Text style={[styles.email, { color: theme.textSecondary }]}>@{userData.username}</Text>
              
              {/* Follow/Message Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.followButton, 
                    { 
                      backgroundColor: isFollowing ? theme.surface : theme.primary,
                      borderColor: theme.primary,
                      borderWidth: isFollowing ? 1 : 0
                    }
                  ]} 
                  onPress={handleFollowToggle}
                >
                  <Text style={[
                    styles.followButtonText, 
                    { color: isFollowing ? theme.primary : 'white' }
                  ]}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
                
                {isFollowing && (
                  <TouchableOpacity 
                    style={[styles.messageButton, { backgroundColor: theme.surface, borderColor: theme.border }]} 
                    onPress={handleMessagePress}
                  >
                    <IconSymbol name="message" size={16} color={theme.text} />
                    <Text style={[styles.messageButtonText, { color: theme.text }]}>Message</Text>
                  </TouchableOpacity>
                )}
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

        {/* Featured Tracks Section */}
        <View style={styles.featuredSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tracksScroll}>
            {userData.featuredTracks && userData.featuredTracks.length > 0 ? userData.featuredTracks.map((track) => (
              <TouchableOpacity 
                key={track.id}
                style={[styles.trackCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => handlePlayFeaturedTrack(track.title)}
              >
                <View style={styles.trackIconContainer}>
                  <View style={[styles.trackIcon, { backgroundColor: theme.surfacePlus }]}>
                    <IconSymbol name="music.note" size={20} color={theme.primary} />
                  </View>
                  
                  {/* Play Button */}
                  <View style={[styles.playBadge, { backgroundColor: theme.primary }]}>
                    <IconSymbol name="play.fill" size={12} color="white" />
                  </View>
                </View>
                
                <View style={styles.trackInfo}>
                  <Text style={[styles.trackTitle, { color: theme.text }]} numberOfLines={2}>
                    {track.title}
                  </Text>
                  <Text style={[styles.trackPlays, { color: theme.primary }]}>{track.plays.toLocaleString()}</Text>
                  <View style={styles.trackStats}>
                    <View style={styles.trackStat}>
                      <IconSymbol name="clock.fill" size={12} color={theme.textSecondary} />
                      <Text style={[styles.trackStatText, { color: theme.textSecondary }]}>
                        {track.duration}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No featured tracks yet</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Playlists Section */}
        <View style={styles.playlistsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Playlists</Text>
          
          {userData.playlists && userData.playlists.length > 0 ? userData.playlists.map((playlist) => (
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
                    <View style={[styles.playlistThumbnailPlaceholder, { backgroundColor: theme.surfacePlus }]}>
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
                  <Text style={[styles.playlistTrackCount, { color: theme.textTertiary }]}>
                    {playlist.trackCount} tracks
                  </Text>
                </View>

                <TouchableOpacity style={styles.playlistMenuButton}>
                  <IconSymbol name="ellipsis" size={16} color={theme.textTertiary} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No playlists yet</Text>
            </View>
          )}
        </View>

        {/* Playlist Modal */}
        <Modal
          visible={showPlaylistModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={[styles.modalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
              <TouchableOpacity 
                onPress={() => setShowPlaylistModal(false)} 
                style={styles.modalBackButton}
              >
                <IconSymbol name="xmark" size={20} color={theme.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {selectedPlaylist?.name}
              </Text>
              <View style={{ width: 40 }} />
            </View>

            {selectedPlaylist && (
              <ScrollView style={[styles.modalContent, { backgroundColor: theme.background }]}>
                <View style={[styles.playlistHeader, { backgroundColor: theme.surface }]}>
                  <Image 
                    source={{ uri: selectedPlaylist.thumbnail }} 
                    style={styles.modalPlaylistImage} 
                  />
                  <View style={styles.modalPlaylistInfo}>
                    <Text style={[styles.modalPlaylistName, { color: theme.text }]}>
                      {selectedPlaylist.name}
                    </Text>
                    <Text style={[styles.modalPlaylistDescription, { color: theme.textSecondary }]}>
                      {selectedPlaylist.description}
                    </Text>
                    <Text style={[styles.modalTrackCount, { color: theme.textSecondary }]}>
                      {selectedPlaylist.musicVideos.length} videos
                    </Text>
                  </View>
                </View>

                <View style={styles.tracksSection}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Music Videos</Text>
                  {selectedPlaylist.musicVideos.map((video, index) => (
                    <View 
                      key={video.id} 
                      style={[styles.trackItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    >
                      <View style={styles.trackNumber}>
                        <Text style={[styles.trackNumberText, { color: theme.textSecondary }]}>
                          {index + 1}
                        </Text>
                      </View>
                      
                      <View style={styles.videoThumbContainer}>
                        <Image source={{ uri: video.thumbnailUrl }} style={styles.trackThumbnail} />
                        <View style={styles.miniNoteOverlay}>
                          <IconSymbol name="music.note" size={10} color="white" />
                          <Text style={styles.miniNoteCount}>{video.musicNotes.length}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.trackItemInfo}>
                        <Text style={[styles.trackItemTitle, { color: theme.text }]}>{video.title}</Text>
                        <Text style={[styles.trackArtist, { color: theme.textSecondary }]}>{video.artist}</Text>
                        <View style={styles.videoMetadata}>
                          <Text style={[styles.trackDuration, { color: theme.textTertiary }]}>{video.duration}</Text>
                          <View style={[styles.miniDifficultyBadge, { backgroundColor: getDifficultyColor(video.difficulty) }]}>
                            <Text style={styles.miniDifficultyText}>{video.difficulty}</Text>
                          </View>
                        </View>
                      </View>

                      <TouchableOpacity 
                        style={[styles.trackPlayButton, { backgroundColor: video.isGameEnabled ? theme.error : theme.primary }]}
                        onPress={() => {
                          Alert.alert(`${video.isGameEnabled ? 'Playing Game' : 'Watching Video'}: ${video.title}`);
                        }}
                      >
                        <IconSymbol 
                          name={video.isGameEnabled ? "gamecontroller.fill" : "play.circle.fill"} 
                          size={20} 
                          color="white" 
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </SafeAreaView>
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
  backButton: {
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
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    gap: 8,
  },
  followButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  messageButtonText: {
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
  featuredSection: {
    padding: 20,
    paddingBottom: 12,
  },
  tracksScroll: {
    paddingRight: 20,
  },
  trackCard: {
    width: 140,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
  },
  trackIconContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  trackIcon: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfo: {
    minHeight: 60,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackPlays: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trackStats: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  trackStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trackStatText: {
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
  // Modal styles
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalBackButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },
  playlistHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  modalPlaylistImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  modalPlaylistInfo: {
    flex: 1,
  },
  modalPlaylistName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalPlaylistDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  modalTrackCount: {
    fontSize: 12,
  },
  tracksSection: {
    padding: 20,
    paddingTop: 0,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  trackNumber: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  trackNumberText: {
    fontSize: 14,
    fontWeight: '500',
  },
  trackThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  trackItemInfo: {
    flex: 1,
  },
  trackItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 12,
    marginBottom: 2,
  },
  trackDuration: {
    fontSize: 11,
  },
  videoThumbContainer: {
    position: 'relative',
  },
  miniNoteOverlay: {
    position: 'absolute',
    top: 2,
    right: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    gap: 1,
  },
  miniNoteCount: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  videoMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniDifficultyBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  miniDifficultyText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  trackPlayButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});