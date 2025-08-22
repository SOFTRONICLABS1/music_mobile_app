import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/theme/ThemeContext';
import { ThemeToggleWithLabel } from '@/components/ThemeToggle';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showArrow?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightComponent,
  showArrow = true,
}) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingIcon}>
        <IconSymbol name={icon as any} size={20} color={theme.primary} />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && onPress && (
          <IconSymbol name="chevron.right" size={16} color={theme.textTertiary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const { theme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [autoPlay, setAutoPlay] = React.useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleAbout = () => {
    Alert.alert(
      'About',
      'Simple Game App v1.0.0\nBuilt with React Native & Expo',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy content would go here.');
  };

  const handleTerms = () => {
    Alert.alert('Terms of Service', 'Terms of service content would go here.');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contact support at support@simplegameapp.com');
  };

  const handleRateApp = () => {
    Alert.alert('Rate App', 'Thank you for your feedback!');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <IconSymbol name="chevron.left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>APPEARANCE</Text>
          <View style={[styles.themeSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <ThemeToggleWithLabel />
          </View>
        </View>

        {/* Game Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>GAME SETTINGS</Text>
          
          <SettingItem
            icon="speaker.wave.2.fill"
            title="Sound Effects"
            subtitle="Enable game sounds and music"
            rightComponent={
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: theme.border, true: theme.primary + '40' }}
                thumbColor={soundEnabled ? theme.primary : theme.textTertiary}
              />
            }
            showArrow={false}
          />
          
          <SettingItem
            icon="play.circle.fill"
            title="Auto-play Next Game"
            subtitle="Automatically start next game"
            rightComponent={
              <Switch
                value={autoPlay}
                onValueChange={setAutoPlay}
                trackColor={{ false: theme.border, true: theme.primary + '40' }}
                thumbColor={autoPlay ? theme.primary : theme.textTertiary}
              />
            }
            showArrow={false}
          />
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>NOTIFICATIONS</Text>
          
          <SettingItem
            icon="bell.fill"
            title="Push Notifications"
            subtitle="Receive game updates and reminders"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: theme.border, true: theme.primary + '40' }}
                thumbColor={notificationsEnabled ? theme.primary : theme.textTertiary}
              />
            }
            showArrow={false}
          />
        </View>

        {/* Account & Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>SUPPORT</Text>
          
          <SettingItem
            icon="star.fill"
            title="Rate App"
            subtitle="Rate us on the App Store"
            onPress={handleRateApp}
          />
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>LEGAL</Text>
          
          <SettingItem
            icon="doc.text.fill"
            title="Privacy Policy"
            onPress={handlePrivacy}
          />
          
          <SettingItem
            icon="doc.text.fill"
            title="Terms of Service"
            onPress={handleTerms}
          />
          
          <SettingItem
            icon="info.circle.fill"
            title="About"
            subtitle="App version and info"
            onPress={handleAbout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 32,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  themeSection: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});