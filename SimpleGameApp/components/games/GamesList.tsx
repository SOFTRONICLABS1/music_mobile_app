import React, { useState, useRef } from 'react';
import { FlatList, Dimensions, View } from 'react-native';
import { GamePreview } from './GamePreview';

interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  likes: number;
  comments: number;
  shares: number;
  route: string;
  user: {
    name: string;
    avatar?: string;
  };
}

const mockGames: Game[] = [
  {
    id: '1',
    title: 'Flappy Bird',
    description: 'Navigate through pipes in this classic arcade game. Test your reflexes and see how far you can go!',
    likes: 1250,
    comments: 89,
    shares: 45,
    route: '/flappybird',
    user: {
      name: 'gamedev_pro',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
  },
  {
    id: '2',
    title: 'Coming Soon',
    description: 'More exciting games are coming soon! Stay tuned for updates.',
    likes: 890,
    comments: 23,
    shares: 12,
    route: '/flappybird',
    user: {
      name: 'musicapp_official',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
  },
];

const { height: screenHeight } = Dimensions.get('window');

export const GamesList: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const renderGame = ({ item }: { item: Game }) => (
    <GamePreview game={item} />
  );

  const getItemLayout = (_: any, index: number) => ({
    length: screenHeight - 150,
    offset: (screenHeight - 150) * index,
    index,
  });

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={mockGames}
        renderItem={renderGame}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={screenHeight - 150}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        removeClippedSubviews
        maxToRenderPerBatch={2}
        windowSize={3}
      />
    </View>
  );
};