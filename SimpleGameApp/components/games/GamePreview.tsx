import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Animated, TextInput, ScrollView, Keyboard } from 'react-native';
import { Video, ResizeMode, Audio } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { IconSymbol } from '../ui/IconSymbol';
import { formatNumber } from '../../utils/helpers';
import { useTheme } from '@/theme/ThemeContext';
import { CommentModal } from '../modals/CommentModal';
import { ShareModal } from '../modals/ShareModal';
import { GameSDKModal } from '../modals/GameSDKModal';

interface MusicNote {
  id: string;
  note: string;
  timing: number;
  duration: number;
  pitch?: number;
}

interface GamePreviewProps {
  musicVideoReel?: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    audioUrl?: string;
    musicNotes: MusicNote[];
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    genre: string;
    likes: number;
    comments: number;
    shares: number;
    plays: number;
    isGameEnabled: boolean;
    contentId?: string;
    gameId?: string;
    user: {
      name: string;
      avatar?: string;
    };
  };
}

const { height: screenHeight } = Dimensions.get('window');

export const GamePreview: React.FC<GamePreviewProps> = ({ musicVideoReel }) => {
  const { theme } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(musicVideoReel?.likes || 0);
  const [commentCount, setCommentCount] = useState(musicVideoReel?.comments || 0);
  const [shareCount, setShareCount] = useState(musicVideoReel?.shares || 0);
  const [following, setFollowing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playPosition, setPlayPosition] = useState(0);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const videoRef = useRef<Video>(null);
  const audioRef = useRef<Audio.Sound>(null);
  const searchInputRef = useRef<TextInput>(null);
  
  // Modal states
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showGameSDKModal, setShowGameSDKModal] = useState(false);
  const [comments, setComments] = useState([
    {
      id: '1',
      user: 'musiclover123',
      text: 'This game is amazing! Really helps with rhythm training 🎵',
      timestamp: '2h ago'
    },
    {
      id: '2',
      user: 'pianoplayer',
      text: 'Love the graphics and sound quality!',
      timestamp: '5h ago'
    }
  ]);
  
  // Animation refs
  const likeScale = useRef(new Animated.Value(1)).current;
  const commentScale = useRef(new Animated.Value(1)).current;
  const shareScale = useRef(new Animated.Value(1)).current;
  const saveScale = useRef(new Animated.Value(1)).current;

  // Load and setup audio
  useEffect(() => {
    const setupAudio = async () => {
      if (musicVideoReel?.audioUrl) {
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });

          const { sound } = await Audio.Sound.createAsync(
            { uri: musicVideoReel.audioUrl },
            { 
              shouldPlay: isPlaying, 
              isLooping: true,
              volume: 0.8 
            }
          );
          
          audioRef.current = sound;
          
          // Set up position updates for notes sync
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.positionMillis !== undefined) {
              setPlayPosition(status.positionMillis);
              
            }
          });
        } catch (error) {
          console.log('Audio setup failed:', error);
        }
      }
    };

    setupAudio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.unloadAsync();
      }
    };
  }, [musicVideoReel?.audioUrl, isPlaying]);

  // Early return after all hooks
  if (!musicVideoReel) return null;

  // Handle screen focus/blur to manage video playback
  useFocusEffect(
    React.useCallback(() => {
      // Screen is focused - resume video and audio
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.playAsync();
      }
      
      return () => {
        // Screen is unfocused - pause and stop video and audio
        setIsPlaying(false);
        if (videoRef.current) {
          videoRef.current.pauseAsync();
        }
        if (audioRef.current) {
          audioRef.current.pauseAsync();
        }
      };
    }, [])
  );

  const handlePlayPress = () => {
    if (musicVideoReel.isGameEnabled) {
      // Validate required parameters before launching GameSDK
      if (!musicVideoReel.contentId || !musicVideoReel.gameId) {
        alert('Error: Missing contentId or gameId parameters required for game launch');
        return;
      }
      
      // Launch GameSDK modal
      setShowGameSDKModal(true);
    } else {
      alert(`Playing video: ${musicVideoReel.title}`);
    }
  };

  const handleLikePress = () => {
    // Instagram-like bounce animation
    Animated.sequence([
      Animated.timing(likeScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(likeScale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(likeScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleCommentPress = () => {
    // Comment bounce animation
    Animated.sequence([
      Animated.timing(commentScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(commentScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Open comment modal
    setShowCommentModal(true);
  };

  const handleSharePress = () => {
    // Share bounce animation
    Animated.sequence([
      Animated.timing(shareScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shareScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Open share modal
    setShowShareModal(true);
  };

  const handleSavePress = () => {
    // Save bounce animation
    Animated.sequence([
      Animated.timing(saveScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(saveScale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(saveScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setSaved(!saved);
  };

  const handleVideoTap = async () => {
    try {
      if (isPlaying) {
        // Pause both video and audio
        if (videoRef.current) {
          await videoRef.current.pauseAsync();
        }
        if (audioRef.current) {
          await audioRef.current.pauseAsync();
        }
        setIsPlaying(false);
      } else {
        // Play both video and audio
        if (videoRef.current) {
          await videoRef.current.playAsync();
        }
        if (audioRef.current) {
          await audioRef.current.playAsync();
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Error controlling playback:', error);
    }
  };


  const handleAddComment = (commentText: string) => {
    const newComment = {
      id: Date.now().toString(),
      user: 'currentuser',
      text: commentText,
      timestamp: 'now'
    };
    setComments(prev => [newComment, ...prev]);
    setCommentCount(prev => prev + 1);
  };

  const handleFollowPress = () => {
    setFollowing(!following);
  };

  const handleUserPress = () => {
    router.push(`/user/${musicVideoReel.user.name}` as any);
  };

  const handleShare = (friends: string[]) => {
    setShareCount(prev => prev + friends.length);
    console.log('Game shared with:', friends);
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

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Mock search results
    if (text.length > 0) {
      const mockResults = [
        { id: '1', type: 'account', name: '@musiclover', followers: '12.5K' },
        { id: '2', type: 'account', name: '@beatmaker', followers: '8.2K' },
        { id: '3', type: 'song', name: 'Summer Vibes', artist: 'DJ Cool' },
        { id: '4', type: 'song', name: 'Night Beats', artist: 'Producer X' },
      ].filter(item => 
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    if (searchQuery.length === 0) {
      setIsSearchFocused(false);
      setSearchResults([]);
    }
  };

  const handleResultPress = (result: any) => {
    console.log('Selected:', result);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, { height: screenHeight - 150, backgroundColor: theme.background }]}>
      <View style={[styles.gamePreview, { backgroundColor: theme.background }]}>
        
        {/* Auto-playing music video like Instagram reels */}
        {!videoError ? (
          <>
            <Video
              ref={videoRef}
              source={{ uri: musicVideoReel.videoUrl }}
              style={styles.backgroundVideo}
              shouldPlay={isPlaying}
              isLooping={true}
              isMuted={true}
              resizeMode={ResizeMode.COVER}
              volume={0.0}
              onError={() => setVideoError(true)}
            />
            {/* Tap area for play/pause */}
            <TouchableOpacity 
              style={styles.videoTapArea} 
              onPress={handleVideoTap}
              activeOpacity={1}
            >
              {/* Pause indicator */}
              {!isPlaying && (
                <View style={styles.pauseIndicator}>
                  <IconSymbol name="play.fill" size={60} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </>
        ) : (
          // Fallback to image if video fails to load
          <Image 
            source={{ uri: musicVideoReel.thumbnailUrl }} 
            style={styles.backgroundVideo}
          />
        )}
        
        {/* Dark overlay for better text readability */}
        <View style={styles.videoOverlay} />
        
        {/* Difficulty Badge - Top Right */}
        <View style={styles.topRightOverlay}>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(musicVideoReel.difficulty) }]}>
            <Text style={styles.difficultyText}>{musicVideoReel.difficulty}</Text>
          </View>
        </View>



        {/* Search Bar Overlay */}
        <View style={styles.searchOverlay}>
          <View style={[
            styles.searchContainer,
            { 
              backgroundColor: isSearchFocused ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.15)',
              borderColor: 'rgba(255,255,255,0.2)'
            }
          ]}>
            <IconSymbol 
              name="magnifyingglass" 
              size={18} 
              color="rgba(255,255,255,0.8)" 
            />
            <TextInput
              ref={searchInputRef}
              style={[styles.searchInput, { color: 'white' }]}
              placeholder="Search accounts, songs..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}>
                <IconSymbol name="xmark.circle.fill" size={18} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Search Results Dropdown */}
          {searchResults.length > 0 && isSearchFocused && (
            <ScrollView 
              style={[styles.searchResultsContainer, { backgroundColor: 'rgba(0,0,0,0.85)' }]}
              keyboardShouldPersistTaps="handled"
            >
              {searchResults.map((result) => (
                <TouchableOpacity
                  key={result.id}
                  style={styles.searchResultItem}
                  onPress={() => handleResultPress(result)}
                >
                  <View style={styles.resultIcon}>
                    <IconSymbol 
                      name={result.type === 'account' ? 'person.fill' : 'music.note'} 
                      size={16} 
                      color={theme.primary} 
                    />
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={[styles.resultName, { color: 'white' }]}>
                      {result.name}
                    </Text>
                    <Text style={[styles.resultSubtext, { color: 'rgba(255,255,255,0.6)' }]}>
                      {result.type === 'account' ? `${result.followers} followers` : result.artist}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.topGameTitle}>
          <Text style={[styles.topTitle, { color: 'white' }]}>{musicVideoReel.title}</Text>
          <Text style={[styles.genreText, { color: 'rgba(255,255,255,0.8)' }]}>{musicVideoReel.genre}</Text>
        </View>

        <View style={styles.bottomContent}>
          <View style={styles.userRow}>
            <TouchableOpacity style={styles.userInfo} onPress={handleUserPress}>
              <View style={styles.userAvatar}>
                {musicVideoReel.user.avatar ? (
                  <Image source={{ uri: musicVideoReel.user.avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <IconSymbol size={20} name="person.fill" color="white" />
                  </View>
                )}
              </View>
              <Text style={styles.username}>@{musicVideoReel.user.name}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.followButton, 
                { 
                  backgroundColor: following ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.9)',
                  borderColor: 'rgba(255,255,255,0.3)'
                }
              ]} 
              onPress={handleFollowPress}
            >
              <Text style={[
                styles.followButtonText, 
                { color: following ? 'white' : 'black' }
              ]}>
                {following ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.gameInfo}>
            {musicVideoReel.description.length > 80 ? (
              <TouchableOpacity 
                onPress={() => setCaptionExpanded(!captionExpanded)}
                activeOpacity={0.8}
              >
                <Text style={styles.gameDescription}>
                  {captionExpanded 
                    ? musicVideoReel.description 
                    : `${musicVideoReel.description.substring(0, 80)}...`
                  }
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.gameDescription}>
                {musicVideoReel.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.rightActions}>
          {/* Game Play Button - Top of side actions */}
          {musicVideoReel.isGameEnabled && (
            <TouchableOpacity style={styles.gameActionButton} onPress={handlePlayPress}>
              <View style={[styles.gameButtonCircle, { backgroundColor: 'rgba(255,50,50,0.9)' }]}>
                <IconSymbol 
                  size={32} 
                  name="gamecontroller.fill" 
                  color="white" 
                />
              </View>
              <Text style={[styles.actionText, { color: 'white', fontWeight: 'bold' }]}>
                PLAY
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={handleLikePress}>
            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
              <IconSymbol 
                size={28} 
                name={liked ? "heart.fill" : "heart"} 
                color={liked ? theme.error : 'white'} 
              />
            </Animated.View>
            <Text style={[styles.actionText, { color: 'white' }]}>
              {formatNumber(likeCount)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCommentPress}>
            <Animated.View style={{ transform: [{ scale: commentScale }] }}>
              <IconSymbol size={28} name="bubble.right" color="white" />
            </Animated.View>
            <Text style={[styles.actionText, { color: 'white' }]}>{formatNumber(commentCount)}</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* Comment Modal */}
      <CommentModal
        visible={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        gameTitle={musicVideoReel.title}
        comments={comments}
        onAddComment={handleAddComment}
      />

      {/* Share Modal */}
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        gameTitle={musicVideoReel.title}
        onShare={handleShare}
      />

      {/* GameSDK Modal */}
      <GameSDKModal
        visible={showGameSDKModal}
        onClose={() => setShowGameSDKModal(false)}
        contentId={musicVideoReel.contentId}
        gameId={musicVideoReel.gameId}
        gameTitle={musicVideoReel.title}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme color
  },
  gamePreview: {
    flex: 1,
    position: 'relative',
    width: '100%',
    // backgroundColor: theme color
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  videoTapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseIndicator: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    padding: 20,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    pointerEvents: 'none',
  },
  topRightOverlay: {
    position: 'absolute',
    top: 60,
    right: 16,
    alignItems: 'flex-end',
    gap: 8,
  },
  noteIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  musicVisualizerOverlay: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 8,
  },
  notesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  notesContainer: {
    width: '85%',
    maxHeight: '70%',
    borderRadius: 12,
    padding: 16,
  },
  notesHeader: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  notesTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notesList: {
    maxHeight: 300,
  },
  spotifyLyrics: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  lyricLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 2,
  },
  currentLyricLine: {
    backgroundColor: 'rgba(29, 185, 84, 0.15)', // Spotify green with transparency
  },
  lyricText: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    color: 'rgba(255,255,255,0.6)',
  },
  pastLyricText: {
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '400',
  },
  currentLyricText: {
    color: '#1DB954', // Spotify green
    fontWeight: '600',
    fontSize: 20,
  },
  upcomingLyricText: {
    color: 'rgba(255,255,255,0.6)',
  },
  lyricTiming: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '400',
    marginLeft: 12,
  },
  currentLyricTiming: {
    color: '#1DB954',
    fontWeight: '600',
  },
  progressContainer: {
    paddingTop: 16,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1DB954',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  closeButtonContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  noteNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  noteNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noteDetails: {
    flex: 1,
  },
  noteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  noteTimingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  noteDuration: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  noteDurationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  noteCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchOverlay: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backdropFilter: 'blur(10px)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  searchResultsContainer: {
    marginTop: 8,
    borderRadius: 12,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  resultIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  resultSubtext: {
    fontSize: 12,
  },
  topGameTitle: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 80,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    // color: theme color
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  genreText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    marginLeft: 12,
  },
  followButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  userAvatar: {
    marginRight: 8,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // backgroundColor: theme color
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  gameInfo: {
    marginTop: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    // color: theme color
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 14,
    color: 'white',
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  rightActions: {
    position: 'absolute',
    right: 8,
    bottom: 180,
    alignItems: 'center',
  },
  gameActionButton: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 6,
  },
  gameButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 12,
    padding: 4,
  },
  actionText: {
    fontSize: 12,
    // color: theme color
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});