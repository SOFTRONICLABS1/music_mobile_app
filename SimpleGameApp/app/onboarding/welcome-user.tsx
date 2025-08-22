import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useTheme } from '@/theme/ThemeContext';
import { ThemedText } from '../../components/ThemedText';

export default function WelcomeUserScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const handleContinue = () => {
    router.replace('/onboarding/username-picker');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Progress Indicator - Moved to Top */}
        <View style={styles.progressSection}>
          <ThemedText style={styles.progressText}>Step 1 of 3</ThemedText>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { width: '33%', backgroundColor: theme.primary }]} />
          </View>
        </View>
        {/* Celebration Animation Section */}
        <View style={styles.celebrationSection}>
          <View style={[styles.iconContainer, { backgroundColor: theme.surface, shadowColor: theme.primary }]}>
            <IconSymbol name="party.popper" size={80} color={theme.primary} />
          </View>
          
          <View style={styles.decorativeElements}>
            <View style={[styles.sparkle, styles.sparkle1]}>
              <IconSymbol name="sparkles" size={24} color={theme.primary} />
            </View>
            <View style={[styles.sparkle, styles.sparkle2]}>
              <IconSymbol name="sparkles" size={20} color={theme.primary} />
            </View>
            <View style={[styles.sparkle, styles.sparkle3]}>
              <IconSymbol name="sparkles" size={18} color={theme.primary} />
            </View>
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.textSection}>
          <Text style={[styles.welcomeTitle, { color: theme.text }]}>Welcome to the family! 🎉</Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
            You're about to embark on an amazing musical journey. Let's get you set up!
          </Text>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonSection}>
          <Pressable 
            style={({ pressed }) => [
              styles.continueButton, 
              { 
                backgroundColor: theme.primary,
                transform: pressed ? [{ translateY: 2 }] : [{ translateY: 0 }],
                opacity: pressed ? 0.9 : 1
              }
            ]} 
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Let's Get Started</Text>
            <IconSymbol name="arrow.right" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  celebrationSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '80%',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: '20%',
    right: '20%',
  },
  sparkle2: {
    bottom: '30%',
    left: '15%',
  },
  sparkle3: {
    top: '40%',
    left: '10%',
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 40,
  },
  welcomeSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  buttonSection: {
    marginBottom: 40,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 12,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});