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
  FlatList
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { IconSymbol } from '../components/ui/IconSymbol';

// Dummy content data for the grid
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

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredContent(dummyContent);
    } else {
      const filtered = dummyContent.filter(content => 
        content.title.toLowerCase().includes(text.toLowerCase()) ||
        content.type.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredContent(filtered);
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
        // Navigate to content detail
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
            {item.type.toUpperCase()}
          </Text>
          <Text style={[styles.likes, { color: theme.textSecondary }]}>
            ❤️ {item.likes > 1000 ? `${(item.likes/1000).toFixed(1)}K` : item.likes}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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

      {/* Content Grid */}
      <FlatList
        data={filteredContent}
        renderItem={renderContentItem}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
      />
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
});