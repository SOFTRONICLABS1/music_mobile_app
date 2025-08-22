import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions, 
  Animated, 
  TextInput, 
  ScrollView, 
  Keyboard, 
  Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { IconSymbol } from '../ui/IconSymbol';
import { formatNumber } from '../../utils/helpers';
import { useTheme } from '../../theme/ThemeContext';
import { AppColors } from '../../theme/Colors';

const { height: screenHeight } = Dimensions.get('window');

export const GamePreview = ({ musicVideoReel, navigation }) => {
  const { theme } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(musicVideoReel?.likes || 0);
  const [commentCount, setCommentCount] = useState(musicVideoReel?.comments || 0);
  const [following, setFollowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  
  // Animation refs
  const likeScale = useRef(new Animated.Value(1)).current;
  const commentScale = useRef(new Animated.Value(1)).current;

  // Early return after all hooks
  if (!musicVideoReel) return null;

  // Handle screen focus/blur to manage video playback
  useFocusEffect(
    React.useCallback(() => {
      setIsPlaying(true);
      
      return () => {
        setIsPlaying(false);
      };
    }, [])
  );

  const handlePlayPress = () => {
    if (musicVideoReel.isGameEnabled) {
      if (!musicVideoReel.contentId || !musicVideoReel.gameId) {
        Alert.alert('Error', 'Missing contentId or gameId parameters required for game launch');
        return;
      }
      
      // Navigate to Game screen
      navigation.navigate('Game', {
        contentId: musicVideoReel.contentId,
        gameId: musicVideoReel.gameId,
        gameTitle: musicVideoReel.title
      });
    } else {
      Alert.alert('Playing', `Playing video: ${musicVideoReel.title}`);
    }
  };

  const handleLikePress = () => {
    // Instagram-style double-tap animation
    Animated.sequence([
      Animated.timing(likeScale, {
        toValue: 0.7,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(likeScale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(likeScale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleCommentPress = () => {
    // Instagram-style tap animation
    Animated.sequence([
      Animated.timing(commentScale, {
        toValue: 0.85,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(commentScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(commentScale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    Alert.alert('Comments', 'Comment functionality coming soon!');
  };


  const handleVideoTap = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFollowPress = () => {
    setFollowing(!following);
  };

  const handleUserPress = () => {
    // Navigate to User Profile screen
    navigation.navigate('UserProfile', {
      username: musicVideoReel.user.name
    });
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

  const handleSearch = (text) => {
    setSearchQuery(text);
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

  const handleResultPress = (result) => {
    console.log('Selected:', result);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, { height: screenHeight - 150, backgroundColor: AppColors.background }]}>
      <View style={[styles.gamePreview, { backgroundColor: AppColors.background }]}>
        
        {/* Background image (replacing video for now) */}
        <Image 
          source={{ uri: musicVideoReel.thumbnailUrl }} 
          style={styles.backgroundVideo}
        />
        {/* Tap area for play/pause simulation */}
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
                      color={AppColors.primary} 
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
              <View style={[styles.gameButtonCircle, { backgroundColor: '#FF4757' }]}>
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

          <TouchableOpacity style={styles.instagramActionButton} onPress={handleLikePress}>
            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
              <IconSymbol 
                size={40} 
                name={liked ? "heart.fill" : "heart"} 
                color={liked ? '#FF3040' : 'white'} 
              />
            </Animated.View>
            <Text style={[styles.instagramActionText, { color: 'white' }]}>
              {formatNumber(likeCount)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.instagramActionButton} onPress={handleCommentPress}>
            <Animated.View style={{ transform: [{ scale: commentScale }] }}>
              <IconSymbol size={32} name="bubble.right" color="white" />
            </Animated.View>
            <Text style={[styles.instagramActionText, { color: 'white' }]}>{formatNumber(commentCount)}</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gamePreview: {
    flex: 1,
    position: 'relative',
    width: '100%',
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
    backgroundColor: AppColors.surface,
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
    marginBottom: 8,
    padding: 4,
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
  instagramActionButton: {
    alignItems: 'center',
    marginBottom: 12,
    padding: 6,
    minWidth: 52,
    minHeight: 52,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  instagramActionText: {
    fontSize: 13,
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 0.3,
  },
});