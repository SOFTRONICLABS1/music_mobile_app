import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions, 
  Animated, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import Video from 'react-native-video';
import { useFocusEffect } from '@react-navigation/native';
import { IconSymbol } from '../ui/IconSymbol';
import { formatNumber } from '../../utils/helpers';
import { useTheme } from '../../theme/ThemeContext';
import { AppColors } from '../../theme/Colors';
import contentService from '../../src/api/services/contentService';

const { height: screenHeight } = Dimensions.get('window');

export const GamePreview = ({ musicVideoReel, navigation, showFollowButton = true, isScreenFocused = true, isCurrentItem = true }) => {
  const { theme } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(musicVideoReel?.likes || 0);
  const [commentCount, setCommentCount] = useState(musicVideoReel?.comments || 0);
  const [following, setFollowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(musicVideoReel?.videoUrl);
  const [isRefreshingUrl, setIsRefreshingUrl] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  
  // Animation refs
  const likeScale = useRef(new Animated.Value(1)).current;
  const commentScale = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);

  // Function to extract URL parameters manually (React Native compatible)
  const getUrlParameter = (url, paramName) => {
    try {
      const urlParts = url.split('?');
      if (urlParts.length < 2) return null;
      
      const queryString = urlParts[1];
      const params = queryString.split('&');
      
      for (const param of params) {
        const [key, value] = param.split('=');
        if (decodeURIComponent(key) === paramName) {
          return decodeURIComponent(value);
        }
      }
      return null;
    } catch (error) {
      console.error('Error parsing URL parameter:', error);
      return null;
    }
  };

  // Function to check if S3 URL is expired
  const isUrlExpired = (url) => {
    if (!url || !url.includes('X-Amz-Expires')) return false;
    
    try {
      const expires = getUrlParameter(url, 'X-Amz-Expires');
      const dateParam = getUrlParameter(url, 'X-Amz-Date');
      
      if (!expires || !dateParam) return false;
      
      // Parse the X-Amz-Date parameter (format: YYYYMMDDTHHMMSSZ)
      const year = parseInt(dateParam.substr(0, 4));
      const month = parseInt(dateParam.substr(4, 2)) - 1; // Month is 0-indexed
      const day = parseInt(dateParam.substr(6, 2));
      const hour = parseInt(dateParam.substr(9, 2));
      const minute = parseInt(dateParam.substr(11, 2));
      const second = parseInt(dateParam.substr(13, 2));
      
      const signedDate = new Date(Date.UTC(year, month, day, hour, minute, second));
      const expiryDate = new Date(signedDate.getTime() + (parseInt(expires) * 1000));
      
      console.log('🕒 URL expiry check:', {
        expires: expires,
        dateParam: dateParam,
        signedDate: signedDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        now: new Date().toISOString(),
        isExpired: Date.now() >= expiryDate.getTime()
      });
      
      return Date.now() >= expiryDate.getTime();
    } catch (error) {
      console.error('Error checking URL expiry:', error);
      return false;
    }
  };

  // Function to refresh expired URL
  const refreshVideoUrl = async () => {
    if (!musicVideoReel?.contentId || isRefreshingUrl) return;
    
    try {
      setIsRefreshingUrl(true);
      console.log('🔄 Refreshing expired URL for content:', musicVideoReel.contentId);
      console.log('🔄 Current URL:', currentVideoUrl);
      
      const contentDetails = await contentService.getContentDetails(musicVideoReel.contentId);
      console.log('🔄 Content details response:', JSON.stringify(contentDetails, null, 2));
      
      const newUrl = contentDetails.download_url;
      console.log('🔄 New URL from API:', newUrl);
      
      if (newUrl && newUrl !== currentVideoUrl) {
        console.log('✅ New URL obtained, updating video source');
        setCurrentVideoUrl(newUrl);
      } else if (newUrl === currentVideoUrl) {
        console.log('⚠️ New URL is same as current URL - no change needed');
      } else {
        console.log('⚠️ No download_url in content details response');
      }
    } catch (error) {
      console.error('❌ Failed to refresh video URL:', error);
      if (error.response) {
        console.error('❌ API Error Response:', JSON.stringify(error.response.data, null, 2));
      }
    } finally {
      setIsRefreshingUrl(false);
    }
  };

  // Early return after all hooks
  if (!musicVideoReel) return null;

  // Reset video URL when content changes and check for expiry
  useEffect(() => {
    setCurrentVideoUrl(musicVideoReel?.videoUrl);
    
    // Reset video to beginning when content changes
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
    
    // Check if URL is expired and refresh if needed (only when screen focused and current item)
    if (musicVideoReel?.videoUrl && isScreenFocused && isCurrentItem && isUrlExpired(musicVideoReel.videoUrl)) {
      console.log('🕒 URL is expired, refreshing...');
      refreshVideoUrl();
    }
  }, [musicVideoReel?.contentId, musicVideoReel?.videoUrl, isScreenFocused, isCurrentItem]);

  // Handle screen focus/blur to manage video playback
  useFocusEffect(
    React.useCallback(() => {
      console.log('📱 Screen focused - starting video playback');
      setIsPlaying(true);
      setIsMuted(false); // Unmute when screen is focused
      
      return () => {
        console.log('📱 Screen blurred - stopping video playback');
        setIsPlaying(false);
        setIsMuted(true); // Mute when leaving screen
        // Force pause video when leaving screen
        if (videoRef.current) {
          console.log('🛑 Force stopping video via ref');
        }
      };
    }, [])
  );

  const handlePlayPress = () => {
    if (musicVideoReel.isGameEnabled) {
      // Navigate to Games screen to choose a game
      navigation.navigate('Games', {
        contentId: musicVideoReel.contentId,
        contentTitle: musicVideoReel.title,
        contentDescription: musicVideoReel.description
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
    const newMuteState = !isMuted;
    console.log('🎬 Video tap - toggling mute state to:', newMuteState);
    
    // Toggle mute/unmute
    setIsMuted(newMuteState);
    
    if (newMuteState) {
      console.log('🔇 Muting audio (video continues playing)');
    } else {
      console.log('🔊 Unmuting audio (video continues playing)');
    }
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


  return (
    <View style={[styles.container, { height: screenHeight - 150, backgroundColor: AppColors.background }]}>
      <View style={[styles.gamePreview, { backgroundColor: AppColors.background }]}>
        
        {/* Background video with fallback to image */}
        {currentVideoUrl && currentVideoUrl !== 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' ? (
          <Video
            key={`video-${musicVideoReel?.contentId}-${isMuted}`}
            ref={videoRef}
            source={{ uri: currentVideoUrl }}
            style={styles.backgroundVideo}
            resizeMode="cover"
            repeat={true}
            paused={!isPlaying || !isScreenFocused || !isCurrentItem}  // Only play when playing AND screen focused AND current item
            muted={isMuted || !isPlaying || !isScreenFocused || !isCurrentItem}  // Mute when not active
            volume={isMuted || !isPlaying || !isScreenFocused || !isCurrentItem ? 0.0 : 1.0}  // Volume control
            onError={(error) => {
              console.error('Video playback error:', error);
              // Check if error is due to expired URL, network issues, or 404 and refresh
              const errorCode = error?.error?.code;
              const errorDescription = error?.error?.localizedDescription || '';
              const errorDomain = error?.error?.domain || '';
              
              // Handle various error conditions that might benefit from URL refresh
              const shouldRefreshUrl = 
                errorCode === -1100 || // NSURLErrorFileDoesNotExist (404)
                errorCode === -1003 || // NSURLErrorCannotFindHost
                errorCode === -1001 || // NSURLErrorTimedOut
                errorDescription.toLowerCase().includes('not found') ||
                errorDescription.toLowerCase().includes('expired') ||
                errorDomain.includes('NSURLError');
              
              if (shouldRefreshUrl) {
                console.log('🔄 Video error possibly due to expired/invalid URL, refreshing...', { errorCode, errorDescription });
                refreshVideoUrl();
              }
            }}
            onLoadStart={() => {
              console.log('Video loading started:', currentVideoUrl);
              setIsLoaded(false);
              setIsBuffering(true);
              setLoadProgress(0);
            }}
            onLoad={(data) => {
              console.log('Video loaded successfully:', data);
              setIsLoaded(true);
              setIsBuffering(false);
              setLoadProgress(100);
              // Seek to beginning when new video loads
              if (videoRef.current) {
                videoRef.current.seek(0);
              }
            }}
            onProgress={(data) => {
              // Update load progress based on buffered duration
              const progress = (data.currentTime / data.seekableDuration) * 100;
              setLoadProgress(progress || 0);
            }}
            onBuffer={({ isBuffering: buffering }) => {
              console.log('Video buffering:', buffering);
              setIsBuffering(buffering);
            }}
            onReadyForDisplay={() => {
              console.log('Video ready for display');
              setIsLoaded(true);
              setIsBuffering(false);
            }}
            poster={musicVideoReel.thumbnailUrl}
            ignoreSilentSwitch="ignore"
            playInBackground={false}
            playWhenInactive={false}
            audioOnly={false}
            mixWithOthers="duck"
            allowsExternalPlayback={false}
            controls={false}
            disableFocus={true}
            bufferConfig={{
              minBufferMs: 15000,        // Minimum buffer before playback starts
              maxBufferMs: 50000,        // Maximum buffer size
              bufferForPlaybackMs: 2500, // Buffer needed to resume after rebuffering
              bufferForPlaybackAfterRebufferMs: 5000, // Buffer needed after initial rebuffer
            }}
            maxBitRate={2000000} // Limit bitrate for faster loading
            onPlaybackStateChanged={(state) => {
              console.log('Playback state changed:', state);
            }}
          />
        ) : (
          <Image 
            source={{ uri: musicVideoReel.thumbnailUrl }} 
            style={styles.backgroundVideo}
          />
        )}
        {/* Tap area for play/pause simulation */}
        <TouchableOpacity 
          style={styles.videoTapArea} 
          onPress={handleVideoTap}
          activeOpacity={1}
        >
          {/* Loading/Buffering indicator */}
          {(isBuffering || !isLoaded) && (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.loadingText}>
                {isBuffering ? 'Buffering...' : 'Loading...'}
              </Text>
              {loadProgress > 0 && loadProgress < 100 && (
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${loadProgress}%` }]} />
                </View>
              )}
            </View>
          )}
          
          {/* Mute indicator */}
          {isMuted && isLoaded && !isBuffering && (
            <View style={styles.muteIndicator}>
              <IconSymbol name="speaker.slash.fill" size={60} color="white" />
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
            
            {showFollowButton && (
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
            )}
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
  muteIndicator: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 40,
    padding: 20,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -60 }, { translateY: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  loadingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: 80,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 1.5,
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
  topGameTitle: {
    position: 'absolute',
    top: 50,
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
    bottom: 55,
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