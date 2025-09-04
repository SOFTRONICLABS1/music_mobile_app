import React, { useState } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  View, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Text,
  Image,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { IconSymbol } from '../components/ui/IconSymbol';
import searchService from '../src/api/services/searchService';

// Mock data for search results
const mockAccounts = [
  { id: 1, username: 'pianoplayer123', name: 'Sarah Johnson', avatar: 'https://picsum.photos/50/50?random=101', followers: 12500, isVerified: true },
  { id: 2, username: 'guitarmaster', name: 'Mike Rodriguez', avatar: 'https://picsum.photos/50/50?random=102', followers: 8900, isVerified: false },
  { id: 3, username: 'musicteacher_anna', name: 'Anna Wilson', avatar: 'https://picsum.photos/50/50?random=103', followers: 15200, isVerified: true },
  { id: 4, username: 'beatmaker_pro', name: 'DJ Marcus', avatar: 'https://picsum.photos/50/50?random=104', followers: 22100, isVerified: true },
];

const mockMusicVideos = [
  { id: 1, title: 'Piano Melody Tutorial', thumbnail: 'https://picsum.photos/200/200?random=1', creator: 'pianoplayer123', duration: '2:45', likes: 1200, views: 45600 },
  { id: 2, title: 'Guitar Solo Masterclass', thumbnail: 'https://picsum.photos/200/200?random=2', creator: 'guitarmaster', duration: '3:20', likes: 890, views: 23400 },
  { id: 3, title: 'Vocal Training Basics', thumbnail: 'https://picsum.photos/200/200?random=3', creator: 'musicteacher_anna', duration: '10:15', likes: 2100, views: 67800 },
  { id: 4, title: 'Jazz Improvisation', thumbnail: 'https://picsum.photos/200/200?random=4', creator: 'jazzmaster_tom', duration: '4:30', likes: 756, views: 18900 },
  { id: 5, title: 'Beat Making Session', thumbnail: 'https://picsum.photos/200/200?random=5', creator: 'beatmaker_pro', duration: '8:45', likes: 1800, views: 89200 },
];

const mockTags = [
  { id: 1, name: 'piano', count: 125000 },
  { id: 2, name: 'tutorial', count: 89000 },
  { id: 3, name: 'classical', count: 56700 },
  { id: 4, name: 'jazz', count: 34500 },
  { id: 5, name: 'beginner', count: 78900 },
  { id: 6, name: 'advanced', count: 23400 },
];

// Dummy content data for the grid (when not searching)
const dummyContent = [
  { id: 1, title: 'Piano Melody', thumbnail: 'https://picsum.photos/200/200?random=1', type: 'audio', duration: '2:45', likes: 1200 },
  { id: 2, title: 'Guitar Solo', thumbnail: 'https://picsum.photos/200/200?random=2', type: 'video', duration: '3:20', likes: 890 },
  { id: 3, title: 'Vocal Training', thumbnail: 'https://picsum.photos/200/200?random=3', type: 'lesson', duration: '10:15', likes: 2100 },
  { id: 4, title: 'Jazz Improvisation', thumbnail: 'https://picsum.photos/200/200?random=4', type: 'video', duration: '4:30', likes: 756 },
  { id: 5, title: 'Beat Making', thumbnail: 'https://picsum.photos/200/200?random=5', type: 'tutorial', duration: '8:45', likes: 1800 },
  { id: 6, title: 'Classical Symphony', thumbnail: 'https://picsum.photos/200/200?random=6', type: 'audio', duration: '12:30', likes: 623 },
  { id: 7, title: 'Harmony Basics', thumbnail: 'https://picsum.photos/200/200?random=7', type: 'lesson', duration: '6:20', likes: 1500 },
  { id: 8, title: 'Drum Patterns', thumbnail: 'https://picsum.photos/200/200?random=8', type: 'tutorial', duration: '5:10', likes: 987 },
  { id: 9, title: 'Melody Composition', thumbnail: 'https://picsum.photos/200/200?random=9', type: 'video', duration: '7:35', likes: 2300 },
  { id: 10, title: 'Sound Design', thumbnail: 'https://picsum.photos/200/200?random=10', type: 'tutorial', duration: '9:15', likes: 1100 },
  { id: 11, title: 'Bass Lines', thumbnail: 'https://picsum.photos/200/200?random=11', type: 'audio', duration: '3:50', likes: 834 },
  { id: 12, title: 'Music Theory', thumbnail: 'https://picsum.photos/200/200?random=12', type: 'lesson', duration: '15:20', likes: 1700 },
];

export default function ExploreScreen({ navigation }) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContent, setFilteredContent] = useState(dummyContent);
  const [activeSearchTab, setActiveSearchTab] = useState('All');
  const [searchResults, setSearchResults] = useState({
    users: [],
    content: [],
    tags: [],
    games: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const handleSearch = async (text) => {
    setSearchQuery(text);
    setSearchError(null);
    
    if (text.trim() === '') {
      setFilteredContent(dummyContent);
      setSearchResults({ users: [], content: [], tags: [], games: [] });
      return;
    }

    setIsSearching(true);
    
    try {
      // Call real search API
      const results = await searchService.search(text.trim(), 1, 20);
      
      setSearchResults({
        users: results.users || [],
        content: results.content || [],
        tags: mockTags.filter(tag => 
          tag.name.toLowerCase().includes(text.toLowerCase())
        ), // For now using mock tags since API doesn't return tags
        games: results.games || []
      });
      
      // Also filter dummy content for grid view when not searching
      const filtered = dummyContent.filter(content => 
        content.title.toLowerCase().includes(text.toLowerCase()) ||
        content.type.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredContent(filtered);
      
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError('Search failed. Please try again.');
      // Fallback to mock data
      const query = text.toLowerCase();
      const filteredAccounts = mockAccounts.filter(account => 
        account.username.toLowerCase().includes(query) ||
        account.name.toLowerCase().includes(query)
      );
      const filteredVideos = mockMusicVideos.filter(video => 
        video.title.toLowerCase().includes(query) ||
        video.creator.toLowerCase().includes(query)
      );
      const filteredTags = mockTags.filter(tag => 
        tag.name.toLowerCase().includes(query)
      );
      
      setSearchResults({
        users: filteredAccounts.map(user => ({
          id: user.id,
          username: user.username,
          signup_username: user.name,
          profile_image_url: user.avatar,
          total_subscribers: user.followers,
          is_verified: user.isVerified
        })),
        content: filteredVideos.map(video => ({
          id: video.id,
          title: video.title,
          description: `Video by @${video.creator}`,
        })),
        tags: filteredTags,
        games: [] // No mock games for fallback
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'video': return '📹';
      case 'audio': return '🎵';
      case 'lesson': return '📚';
      case 'tutorial': return '🎓';
      default: return '🎼';
    }
  };

  const renderContentItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.contentCard, { backgroundColor: theme.surface }]}
      onPress={() => {
        console.log('Navigate to content:', item.title);
      }}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.contentThumbnail} />
      <View style={styles.contentOverlay}>
        <Text style={styles.contentIcon}>{getContentIcon(item.type)}</Text>
        <Text style={[styles.duration, { color: 'white' }]}>{item.duration}</Text>
      </View>
      <View style={styles.contentInfo}>
        <Text style={[styles.contentTitle, { color: theme.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.contentStats}>
          <Text style={[styles.contentType, { color: theme.primary }]}>
            {item.type ? item.type.toUpperCase() : 'VIDEO'}
          </Text>
          <Text style={[styles.likes, { color: theme.textSecondary }]}>
            ❤️ {item.likes > 1000 ? `${(item.likes/1000).toFixed(1)}K` : item.likes}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderAccountItem = ({ item }) => {
    const avatarUrl = item.profile_image_url || `https://picsum.photos/50/50?random=${item.id}`;
    const displayName = item.signup_username || item.username;
    const followerCount = item.total_subscribers || 0;
    
    return (
      <TouchableOpacity 
        style={styles.accountItem}
        onPress={() => console.log('Navigate to account:', item.username)}
      >
        <Image source={{ uri: avatarUrl }} style={styles.accountAvatar} />
        <View style={styles.accountInfo}>
          <View style={styles.accountHeader}>
            <Text style={[styles.accountName, { color: theme.text }]}>{displayName}</Text>
            {item.is_verified && <Text style={styles.verifiedBadge}>✓</Text>}
          </View>
          <Text style={[styles.accountUsername, { color: theme.textSecondary }]}>@{item.username}</Text>
          <Text style={[styles.accountFollowers, { color: theme.textTertiary }]}>
            {followerCount > 1000 ? `${(followerCount/1000).toFixed(1)}K` : followerCount} followers
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderMusicVideoItem = ({ item }) => {
    const thumbnailUrl = `https://picsum.photos/200/200?random=${item.id}`;
    const playCount = item.play_count || 0;
    const isVideo = item.media_type === 'video';
    
    return (
      <TouchableOpacity 
        style={styles.musicVideoItem}
        onPress={() => console.log('Navigate to content:', item.title)}
      >
        <View style={styles.musicVideoThumbnailContainer}>
          <Image source={{ uri: thumbnailUrl }} style={styles.musicVideoThumbnail} />
          <View style={styles.musicVideoOverlay}>
            <Text style={styles.musicVideoDuration}>{isVideo ? '🎬' : '🎵'}</Text>
          </View>
        </View>
        <View style={styles.musicVideoInfo}>
          <Text style={[styles.musicVideoTitle, { color: theme.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.musicVideoCreator, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.description}
          </Text>
          <View style={styles.musicVideoStats}>
            <Text style={[styles.musicVideoStat, { color: theme.textTertiary }]}>
              👁 {playCount > 1000 ? `${(playCount/1000).toFixed(1)}K` : playCount} plays
            </Text>
            {item.tempo && (
              <Text style={[styles.musicVideoStat, { color: theme.textTertiary }]}>
                🎵 {item.tempo} BPM
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderTagItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.tagItem}
      onPress={() => console.log('Navigate to tag:', item.name)}
    >
      <View style={styles.tagIconContainer}>
        <Text style={styles.tagIcon}>#</Text>
      </View>
      <View style={styles.tagInfo}>
        <Text style={[styles.tagName, { color: theme.text }]}>#{item.name}</Text>
        <Text style={[styles.tagCount, { color: theme.textSecondary }]}>
          {item.count > 1000 ? `${(item.count/1000).toFixed(0)}K` : item.count} posts
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderGameItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.tagItem}
      onPress={() => console.log('Navigate to game:', item.title)}
    >
      <View style={styles.tagIconContainer}>
        <Text style={styles.tagIcon}>🎮</Text>
      </View>
      <View style={styles.tagInfo}>
        <Text style={[styles.tagName, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.tagCount, { color: theme.textSecondary }]}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderSearchTabs = () => {
    const tabs = ['All', 'Accounts', 'Music Videos', 'Tags', 'Games'];
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.searchTabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.searchTab,
              {
                backgroundColor: activeSearchTab === tab ? theme.primary : theme.surface,
              }
            ]}
            onPress={() => setActiveSearchTab(tab)}
          >
            <Text
              style={[
                styles.searchTabText,
                {
                  color: activeSearchTab === tab ? 'white' : theme.text
                }
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  
  const renderAllResults = () => {
    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Searching...</Text>
        </View>
      );
    }

    if (searchError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.textSecondary }]}>{searchError}</Text>
        </View>
      );
    }

    const hasResults = searchResults.users.length > 0 || 
                      searchResults.content.length > 0 || 
                      searchResults.tags.length > 0 || 
                      searchResults.games.length > 0;

    if (!hasResults) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No results found for "{searchQuery}"
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.allResultsContainer}>
        {/* Accounts Section */}
        {searchResults.users.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Accounts</Text>
            {searchResults.users.slice(0, 3).map((item) => (
              <View key={`account_${item.id}`}>
                {renderAccountItem({ item })}
              </View>
            ))}
          </View>
        )}

        {/* Music Videos Section */}
        {searchResults.content.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Music Videos</Text>
            {searchResults.content.slice(0, 3).map((item) => (
              <View key={`video_${item.id}`}>
                {renderMusicVideoItem({ item })}
              </View>
            ))}
          </View>
        )}

        {/* Tags Section */}
        {searchResults.tags.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Tags</Text>
            {searchResults.tags.slice(0, 3).map((item) => (
              <View key={`tag_${item.id}`}>
                {renderTagItem({ item })}
              </View>
            ))}
          </View>
        )}

        {/* Games Section */}
        {searchResults.games.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Games</Text>
            {searchResults.games.slice(0, 3).map((item) => (
              <View key={`game_${item.id}`}>
                {renderGameItem({ item })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  const renderSearchResults = () => {
    if (searchQuery.trim() === '') return null;
    
    let data = [];
    let renderItem = null;
    
    switch (activeSearchTab) {
      case 'All':
        // For All tab, we'll show all results in sections
        return renderAllResults();
      case 'Accounts':
        data = searchResults.users;
        renderItem = renderAccountItem;
        break;
      case 'Music Videos':
        data = searchResults.content;
        renderItem = renderMusicVideoItem;
        break;
      case 'Tags':
        data = searchResults.tags;
        renderItem = renderTagItem;
        break;
      case 'Games':
        data = searchResults.games;
        renderItem = renderGameItem;
        break;
      default:
        data = searchResults.users;
        renderItem = renderAccountItem;
    }

    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Searching...</Text>
        </View>
      );
    }

    if (searchError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.textSecondary }]}>{searchError}</Text>
        </View>
      );
    }

    if (data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No {activeSearchTab.toLowerCase()} found for "{searchQuery}"
          </Text>
        </View>
      );
    }
    
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => `${activeSearchTab}_${item.id}`}
        contentContainerStyle={styles.searchResultsContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with Search */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Explore</Text>
        <View style={[styles.searchContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <IconSymbol name="magnifyingglass" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search content..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results or Content Grid */}
      {searchQuery.trim() !== '' ? (
        <View style={{ flex: 1 }}>
          {renderSearchTabs()}
          {renderSearchResults()}
        </View>
      ) : (
        <FlatList
          data={filteredContent}
          renderItem={renderContentItem}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  gridContainer: {
    padding: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  contentCard: {
    width: '48%',
    borderRadius: 12,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  contentThumbnail: {
    width: '100%',
    height: 120,
  },
  contentOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  contentIcon: {
    fontSize: 12,
  },
  duration: {
    fontSize: 10,
    fontWeight: '600',
  },
  contentInfo: {
    padding: 12,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 18,
  },
  contentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentType: {
    fontSize: 10,
    fontWeight: '700',
  },
  likes: {
    fontSize: 11,
    fontWeight: '500',
  },
  // Search Tabs Styles
  searchTabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  searchTab: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
    alignSelf: 'flex-start',
  },
  searchTabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  searchResultsContainer: {
    paddingTop: 24,
    paddingBottom: 20,
  },
  // Account Item Styles - Instagram-like clean list
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  accountAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  verifiedBadge: {
    color: '#1DA1F2',
    fontSize: 14,
    fontWeight: 'bold',
  },
  accountUsername: {
    fontSize: 13,
    marginBottom: 2,
  },
  accountFollowers: {
    fontSize: 13,
  },
  // Music Video Item Styles - Instagram-like clean list
  musicVideoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  musicVideoThumbnailContainer: {
    position: 'relative',
    marginRight: 12,
  },
  musicVideoThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  musicVideoOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  musicVideoDuration: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  musicVideoInfo: {
    flex: 1,
  },
  musicVideoTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
    lineHeight: 18,
  },
  musicVideoCreator: {
    fontSize: 13,
    marginBottom: 2,
  },
  musicVideoStats: {
    flexDirection: 'row',
    gap: 8,
  },
  musicVideoStat: {
    fontSize: 12,
  },
  // Tag Item Styles - Instagram-like clean list
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tagIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tagIcon: {
    fontSize: 18,
    color: '#1DA1F2',
    fontWeight: 'bold',
  },
  tagInfo: {
    flex: 1,
  },
  tagName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 1,
  },
  tagCount: {
    fontSize: 13,
  },
  // All Results Styles
  allResultsContainer: {
    flex: 1,
  },
  resultSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  // Loading, Error, and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});