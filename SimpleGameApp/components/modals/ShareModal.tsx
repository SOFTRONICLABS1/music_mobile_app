import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { IconSymbol } from '../ui/IconSymbol';
import { useTheme } from '@/theme/ThemeContext';

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isSelected: boolean;
}

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  gameTitle: string;
  onShare: (friends: string[]) => void;
}

// Mock friends data
const mockFriends: Friend[] = [
  { id: '1', name: 'Alex Johnson', username: 'alexj', isSelected: false },
  { id: '2', name: 'Sarah Wilson', username: 'sarahw', isSelected: false },
  { id: '3', name: 'Mike Brown', username: 'mikeb', isSelected: false },
  { id: '4', name: 'Emma Davis', username: 'emmad', isSelected: false },
  { id: '5', name: 'Chris Lee', username: 'chrisl', isSelected: false },
  { id: '6', name: 'Anna Smith', username: 'annas', isSelected: false },
  { id: '7', name: 'David Kim', username: 'davidk', isSelected: false },
  { id: '8', name: 'Lisa Chen', username: 'lisac', isSelected: false },
];

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  gameTitle,
  onShare,
}) => {
  const { theme } = useTheme();
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [searchText, setSearchText] = useState('');

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchText.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const selectedFriends = friends.filter(friend => friend.isSelected);

  const toggleFriendSelection = (friendId: string) => {
    setFriends(prev =>
      prev.map(friend =>
        friend.id === friendId
          ? { ...friend, isSelected: !friend.isSelected }
          : friend
      )
    );
  };

  const handleShare = () => {
    const selectedUsernames = selectedFriends.map(friend => friend.username);
    onShare(selectedUsernames);
    
    // Reset selections
    setFriends(prev =>
      prev.map(friend => ({ ...friend, isSelected: false }))
    );
    setSearchText('');
    onClose();
  };

  const handleClose = () => {
    setFriends(prev =>
      prev.map(friend => ({ ...friend, isSelected: false }))
    );
    setSearchText('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          {/* Handle Bar */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: theme.textSecondary }]} />
          </View>
          
          {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Share</Text>
          {selectedFriends.length > 0 && (
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Text style={[styles.shareButtonText, { color: theme.primary }]}>
                Send ({selectedFriends.length})
              </Text>
            </TouchableOpacity>
          )}
          {selectedFriends.length === 0 && <View style={styles.placeholder} />}
        </View>

        {/* Game Info */}
        <View style={[styles.gameInfo, { backgroundColor: theme.surface }]}>
          <IconSymbol name="gamecontroller.fill" size={20} color={theme.primary} />
          <Text style={[styles.gameTitle, { color: theme.text }]}>{gameTitle}</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <IconSymbol name="magnifyingglass" size={20} color={theme.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search friends..."
              placeholderTextColor={theme.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Quick Share Options */}
        <View style={styles.quickShareContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickShare}>
            <TouchableOpacity style={[styles.quickShareItem, { backgroundColor: theme.surface }]}>
              <View style={[styles.quickShareIcon, { backgroundColor: theme.primary }]}>
                <IconSymbol name="link" size={20} color="white" />
              </View>
              <Text style={[styles.quickShareText, { color: theme.text }]}>Copy Link</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickShareItem, { backgroundColor: theme.surface }]}>
              <View style={[styles.quickShareIcon, { backgroundColor: '#1DA1F2' }]}>
                <IconSymbol name="at" size={20} color="white" />
              </View>
              <Text style={[styles.quickShareText, { color: theme.text }]}>Twitter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickShareItem, { backgroundColor: theme.surface }]}>
              <View style={[styles.quickShareIcon, { backgroundColor: '#25D366' }]}>
                <IconSymbol name="message.fill" size={20} color="white" />
              </View>
              <Text style={[styles.quickShareText, { color: theme.text }]}>WhatsApp</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Friends List */}
        <View style={styles.friendsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Friends</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredFriends.map((friend) => (
              <TouchableOpacity
                key={friend.id}
                style={[
                  styles.friendItem,
                  friend.isSelected && { backgroundColor: theme.primary + '10' }
                ]}
                onPress={() => toggleFriendSelection(friend.id)}
              >
                <View style={[styles.friendAvatar, { backgroundColor: theme.surface }]}>
                  <IconSymbol name="person.fill" size={20} color={theme.textSecondary} />
                </View>
                <View style={styles.friendInfo}>
                  <Text style={[styles.friendName, { color: theme.text }]}>{friend.name}</Text>
                  <Text style={[styles.friendUsername, { color: theme.textSecondary }]}>
                    @{friend.username}
                  </Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: theme.border },
                    friend.isSelected && { backgroundColor: theme.primary, borderColor: theme.primary }
                  ]}
                >
                  {friend.isSelected && (
                    <IconSymbol name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  shareButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 80,
  },
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  quickShareContainer: {
    paddingVertical: 8,
  },
  quickShare: {
    paddingHorizontal: 16,
  },
  quickShareItem: {
    alignItems: 'center',
    marginRight: 16,
    padding: 12,
    borderRadius: 12,
    minWidth: 80,
  },
  quickShareIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickShareText: {
    fontSize: 12,
    fontWeight: '500',
  },
  friendsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  friendUsername: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});