import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '../ui/IconSymbol';
import { GameStyles } from '../../utils/styles';
import { AppColors, GameColors } from '../../utils/colors';
import { formatNumber } from '../../utils/helpers';

interface GamePreviewProps {
  game: {
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
  };
}

const { height: screenHeight } = Dimensions.get('window');

export const GamePreview: React.FC<GamePreviewProps> = ({ game }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(game.likes);

  const handlePlayPress = () => {
    router.push(game.route as any);
  };

  const handleLikePress = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleCommentPress = () => {
    console.log('Comment pressed for game:', game.id);
  };

  const handleSharePress = () => {
    console.log('Share pressed for game:', game.id);
  };

  return (
    <View style={[styles.container, { height: screenHeight - 150 }]}>
      <View style={styles.gamePreview}>
        {game.thumbnail && (
          <Image source={{ uri: game.thumbnail }} style={styles.thumbnail} />
        )}
        
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
          <IconSymbol size={40} name="play.fill" color={AppColors.text} />
        </TouchableOpacity>

        <View style={styles.topGameTitle}>
          <Text style={styles.topTitle}>{game.title}</Text>
        </View>

        <View style={styles.bottomContent}>
          <TouchableOpacity style={styles.userInfo} onPress={() => router.push(`/user/${game.user.name}` as any)}>
            <View style={styles.userAvatar}>
              {game.user.avatar ? (
                <Image source={{ uri: game.user.avatar }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <IconSymbol size={20} name="person.fill" color={AppColors.textSecondary} />
                </View>
              )}
            </View>
            <Text style={styles.username}>@{game.user.name}</Text>
          </TouchableOpacity>
          
          <View style={styles.gameInfo}>
            <Text style={styles.gameDescription}>{game.description}</Text>
          </View>
        </View>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLikePress}>
            <IconSymbol 
              size={30} 
              name={liked ? "heart.fill" : "heart"} 
              color={liked ? AppColors.like : AppColors.text} 
            />
            <Text style={[styles.actionText, { color: liked ? AppColors.like : AppColors.text }]}>
              {formatNumber(likeCount)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCommentPress}>
            <IconSymbol size={30} name="bubble.right" color={AppColors.text} />
            <Text style={styles.actionText}>{formatNumber(game.comments)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleSharePress}>
            <IconSymbol size={30} name="paperplane" color={AppColors.text} />
            <Text style={styles.actionText}>{formatNumber(game.shares)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  gamePreview: {
    flex: 1,
    position: 'relative',
    width: '100%',
    backgroundColor: AppColors.surface,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -35 }, { translateY: -35 }],
    backgroundColor: AppColors.primary,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  topGameTitle: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 80,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.text,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 80,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    color: AppColors.text,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  gameInfo: {
    marginTop: 4,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  gameDescription: {
    fontSize: 14,
    color: AppColors.text,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    color: AppColors.text,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});