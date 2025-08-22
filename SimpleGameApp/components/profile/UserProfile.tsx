import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { IconSymbol } from '../ui/IconSymbol';
import { useTheme } from '@/theme/ThemeContext';

interface UserProfileProps {
  username: string;
  email: string;
  gamesPlayed: number;
  highScore: number;
}

export default function UserProfile({ username, email, gamesPlayed, highScore }: UserProfileProps) {
  const { theme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  
  const handleSettings = () => {
    setShowMenu(false);
  };
  
  const handleHelp = () => {
    setShowMenu(false);
  };
  
  const handleLogout = () => {
    setShowMenu(false);
  };
  
  return (
    <View style={[styles.container, { 
      backgroundColor: theme.card,
      borderColor: theme.border
    }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
        >
          <IconSymbol name="line.horizontal.3" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <IconSymbol name="person.circle.fill" size={60} color={theme.primary} />
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.username, { color: theme.text }]}>{username}</Text>
          <Text style={[styles.userTitle, { color: theme.textSecondary }]}>Player</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>{gamesPlayed}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Games Played</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>{highScore}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>High Score</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={16} color={theme.success} />
            <Text style={[styles.statValue, { color: theme.text }]}>4.2</Text>
          </View>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Rating</Text>
        </View>
      </View>

      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowMenu(false)}
        >
          <View style={[styles.menuContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
              <IconSymbol name="gearshape.fill" size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
              <IconSymbol name="questionmark.circle.fill" size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Help & Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={theme.destructive} />
              <Text style={[styles.menuText, { color: theme.destructive }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  menuButton: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userTitle: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
});