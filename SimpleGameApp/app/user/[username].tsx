import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MusicCreatorProfile from '../../components/profile/MusicCreatorProfile';
import { CommonStyles } from '../../utils/styles';

const mockPlaylists = [
  {
    id: '1',
    title: 'Chill Gaming Vibes',
    description: 'Perfect background music for gaming sessions',
    thumbnail: 'https://picsum.photos/200/200?random=1',
    trackCount: 25,
    totalDuration: '1h 45m',
    tracks: [
      { id: '1', title: 'Neon Nights', duration: '3:45', plays: 12500 },
      { id: '2', title: 'Digital Dreams', duration: '4:12', plays: 8900 },
    ],
  },
  {
    id: '2',
    title: 'Electronic Beats',
    description: 'High-energy electronic music for intense gameplay',
    thumbnail: 'https://picsum.photos/200/200?random=2',
    trackCount: 18,
    totalDuration: '1h 12m',
    tracks: [
      { id: '3', title: 'Cyber Storm', duration: '3:28', plays: 15600 },
      { id: '4', title: 'Matrix Flow', duration: '4:05', plays: 11200 },
    ],
  },
  {
    id: '3',
    title: 'Ambient Soundscapes',
    description: 'Atmospheric sounds for puzzle and strategy games',
    thumbnail: 'https://picsum.photos/200/200?random=3',
    trackCount: 12,
    totalDuration: '55m',
    tracks: [
      { id: '5', title: 'Floating Particles', duration: '5:15', plays: 7800 },
      { id: '6', title: 'Deep Space', duration: '6:22', plays: 9300 },
    ],
  },
];

const mockFeaturedTracks = [
  {
    id: '1',
    title: 'Epic Battle Theme',
    duration: '4:32',
    plays: 125000,
  },
  {
    id: '2', 
    title: 'Ambient Exploration',
    duration: '3:45',
    plays: 89000,
  },
  {
    id: '3',
    title: 'Victory Celebration',
    duration: '2:18',
    plays: 156000,
  },
];

const mockUsers: { [key: string]: any } = {
  gamedev_pro: {
    name: 'gamedev_pro',
    avatar: 'https://i.pravatar.cc/150?img=1',
    followers: 12500,
    following: 340,
    bio: 'Game developer & music producer. Creating immersive gaming experiences with custom soundtracks.',
  },
  musicapp_official: {
    name: 'musicapp_official',
    avatar: 'https://i.pravatar.cc/150?img=2',
    followers: 45600,
    following: 120,
    bio: 'Official MusicApp account. Curating the best music for gamers worldwide.',
  },
  vocalgamer_pro: {
    name: 'vocalgamer_pro',
    avatar: 'https://i.pravatar.cc/150?img=1',
    followers: 8500,
    following: 245,
    bio: 'Voice gaming enthusiast. Creating vocal challenges and interactive music games.',
  },
  classical_master: {
    name: 'classical_master',
    avatar: 'https://i.pravatar.cc/150?img=3',
    followers: 15600,
    following: 180,
    bio: 'Classical music instructor. Teaching vocal techniques through gaming.',
  },
  rockstar_vocals: {
    name: 'rockstar_vocals',
    avatar: 'https://i.pravatar.cc/150?img=2',
    followers: 22100,
    following: 320,
    bio: 'Rock vocalist and game streamer. High-energy vocal gaming content.',
  },
};

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  
  const user = mockUsers[username] || {
    name: username,
    avatar: 'https://i.pravatar.cc/150?img=4',
    followers: 1250,
    following: 89,
    bio: 'Music enthusiast and content creator.',
  };

  const handleFollowToggle = () => {
    console.log('Follow toggled for user:', username);
  };

  const handleMessage = () => {
    console.log('Message user:', username);
  };

  return (
    <SafeAreaView style={[CommonStyles.container, styles.container]}>
      <MusicCreatorProfile 
        creatorName={user.name || 'Unknown User'}
        avatar={user.avatar}
        followers={user.followers || 0}
        following={user.following || 0}
        bio={user.bio || 'Music creator and content maker'}
        featuredTracks={mockFeaturedTracks || []}
        playlists={mockPlaylists || []}
        onFollowToggle={handleFollowToggle}
        onMessage={handleMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});