import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { IconSymbol } from '../components/ui/IconSymbol';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();

  const musicGenres = [
    { id: 1, name: 'Pop', icon: 'star.fill', color: '#FF6B6B' },
    { id: 2, name: 'Rock', icon: 'music.note', color: '#4ECDC4' },
    { id: 3, name: 'Classical', icon: 'heart.fill', color: '#45B7D1' },
    { id: 4, name: 'Jazz', icon: 'play.fill', color: '#FFA726' },
  ];

  const featuredContent = [
    { id: 1, title: 'Voice Training Basics', description: 'Learn fundamental vocal techniques' },
    { id: 2, title: 'Pitch Perfect Challenge', description: 'Test your pitch accuracy' },
    { id: 3, title: 'Rhythm Master', description: 'Improve your timing skills' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: theme.text }]}>Welcome to</Text>
          <Text style={[styles.appTitle, { color: theme.primary }]}>MusicApp</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Your musical journey starts here
          </Text>
        </View>

        {/* Music Genres */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore Genres</Text>
          <View style={styles.genresGrid}>
            {musicGenres.map((genre) => (
              <TouchableOpacity
                key={genre.id}
                style={[
                  styles.genreCard,
                  { backgroundColor: theme.surface }
                ]}
                onPress={() => {
                  // Navigate to genre-specific content
                  console.log('Selected genre:', genre.name);
                }}
              >
                <View style={[styles.genreIcon, { backgroundColor: genre.color + '20' }]}>
                  <IconSymbol name={genre.icon} size={24} color={genre.color} />
                </View>
                <Text style={[styles.genreName, { color: theme.text }]}>{genre.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Content */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Lessons</Text>
          {featuredContent.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.featuredCard, { backgroundColor: theme.surface }]}
              onPress={() => {
                console.log('Selected lesson:', item.title);
              }}
            >
              <View style={styles.featuredContent}>
                <View style={[styles.featuredIcon, { backgroundColor: theme.primary + '20' }]}>
                  <IconSymbol name="music.note" size={32} color={theme.primary} />
                </View>
                <View style={styles.featuredInfo}>
                  <Text style={[styles.featuredTitle, { color: theme.text }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.featuredDescription, { color: theme.textSecondary }]}>
                    {item.description}
                  </Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color={theme.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.primary }]}
              onPress={() => console.log('Start practice session')}
            >
              <IconSymbol name="play.fill" size={28} color="white" />
              <Text style={styles.actionText}>Practice</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.surface }]}
              onPress={() => console.log('View progress')}
            >
              <IconSymbol name="star.fill" size={28} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>Progress</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '400',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  genresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  genreCard: {
    width: '47%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  genreIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  genreName: {
    fontSize: 16,
    fontWeight: '600',
  },
  featuredCard: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    color: 'white',
  },
});
