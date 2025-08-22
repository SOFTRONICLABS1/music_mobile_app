import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { IconSymbol } from './ui/IconSymbol';

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  showLabel = false,
  size = 'medium'
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'large': return 32;
      default: return 24;
    }
  };

  const getContainerSize = () => {
    switch (size) {
      case 'small': return 32;
      case 'large': return 48;
      default: return 40;
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          width: getContainerSize(),
          height: getContainerSize(),
        }
      ]}
      activeOpacity={0.8}
    >
      <IconSymbol
        name={isDark ? 'sun.max.fill' : 'moon.fill'}
        size={getSize()}
        color={theme.primary}
      />
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            {isDark ? 'Light' : 'Dark'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const ThemeToggleWithLabel: React.FC = () => {
  const { theme, isDark, mode, setThemeMode } = useTheme();

  return (
    <View style={styles.toggleWithLabelContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Theme</Text>
      
      <View style={styles.optionsContainer}>
        {(['light', 'dark', 'system'] as const).map((themeMode) => (
          <TouchableOpacity
            key={themeMode}
            onPress={() => setThemeMode(themeMode)}
            style={[
              styles.option,
              {
                backgroundColor: mode === themeMode ? theme.primary : theme.surface,
                borderColor: theme.border,
              }
            ]}
            activeOpacity={0.8}
          >
            <IconSymbol
              name={
                themeMode === 'light' 
                  ? 'sun.max.fill' 
                  : themeMode === 'dark' 
                  ? 'moon.fill' 
                  : 'gear'
              }
              size={20}
              color={mode === themeMode ? '#FFFFFF' : theme.text}
            />
            <Text style={[
              styles.optionText,
              { 
                color: mode === themeMode ? '#FFFFFF' : theme.text,
                fontWeight: mode === themeMode ? '600' : 'normal'
              }
            ]}>
              {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {mode === 'system' 
          ? 'Follows your device setting'
          : mode === 'dark'
          ? 'Dark theme active'
          : 'Light theme active'
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  labelContainer: {
    position: 'absolute',
    bottom: -20,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  toggleWithLabelContainer: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  optionText: {
    fontSize: 14,
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
  },
});