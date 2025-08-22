import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert,
  Text
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useTheme } from '@/theme/ThemeContext';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function UsernamePickerScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  // Mock user data from sign-in (in real app, this would come from auth context)
  const userEmail = 'user@example.com';
  const userEmailPrefix = userEmail.split('@')[0];

  useEffect(() => {
    // Generate username suggestions based on email
    const baseSuggestions = [
      userEmailPrefix,
      `${userEmailPrefix}123`,
      `${userEmailPrefix}_music`,
      `music_${userEmailPrefix}`,
      `${userEmailPrefix}_player`,
      `beat_${userEmailPrefix}`,
    ];
    setSuggestions(baseSuggestions);
  }, []);

  useEffect(() => {
    // Validate username (basic validation)
    const isValid = username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
    setIsUsernameValid(isValid);
  }, [username]);

  const handleSuggestionPress = (suggestion: string) => {
    setUsername(suggestion);
  };

  const handleContinue = () => {
    if (!isUsernameValid) {
      Alert.alert('Invalid Username', 'Username must be at least 3 characters and contain only letters, numbers, and underscores.');
      return;
    }
    
    // Store username (in real app, save to user profile)
    console.log('Selected username:', username);
    router.push('/onboarding/phone-verification');
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedView style={styles.content}>
        {/* Header - No back button */}
        <View style={styles.header}>
        </View>
        
        {/* Progress Indicator - Below Back Button */}
        <View style={styles.progressSection}>
          <ThemedText style={styles.progressText}>Step 2 of 3</ThemedText>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { width: '66%', backgroundColor: theme.primary }]} />
          </View>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Enhanced Title Section */}
          <View style={styles.titleSection}>
          <View style={[styles.iconContainer, { backgroundColor: theme.surface, shadowColor: theme.primary }]}>
            <IconSymbol name="person.badge.plus" size={80} color={theme.primary} />
          </View>
          
          {/* Decorative elements */}
          <View style={styles.decorativeElements}>
            <View style={[styles.decorativeCircle, styles.circle1, { backgroundColor: theme.primary + '20', shadowColor: theme.primary }]}>
              <IconSymbol name="at" size={20} color={theme.primary} />
            </View>
            <View style={[styles.decorativeCircle, styles.circle2, { backgroundColor: theme.primary + '20', shadowColor: theme.primary }]}>
              <IconSymbol name="person.fill" size={18} color={theme.primary} />
            </View>
          </View>

          <ThemedText style={styles.title}>Pick your username</ThemedText>
          <ThemedText style={styles.subtitle}>
            Your username is how other musicians will find and connect with you
          </ThemedText>
        </View>

        {/* Username Input Section */}
        <View style={styles.inputSection}>
          <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <IconSymbol name="at" size={20} color={theme.primary} />
            <TextInput
              style={[styles.usernameInput, { color: theme.text }]}
              placeholder="Enter your username"
              placeholderTextColor={theme.textSecondary}
              
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
            />
            {username.length > 0 && (
              <IconSymbol 
                name={isUsernameValid ? "checkmark.circle.fill" : "exclamationmark.circle.fill"} 
                size={20} 
                color={isUsernameValid ? theme.success : theme.error} 
              />
            )}
          </View>
          
          {username.length > 0 && (
            <View style={styles.usernameStatus}>
              <ThemedText style={[
                styles.statusText,
                { color: isUsernameValid ? theme.success : theme.error }
              ]}>
                {isUsernameValid ? '✓ Username looks good!' : '⚠ Username must be 3+ characters, letters, numbers, and underscores only'}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Professional Suggestions Section */}
        <View style={[styles.suggestionsSection, { backgroundColor: theme.surface }]}>
          <View style={styles.suggestionsHeader}>
            <IconSymbol name="lightbulb.fill" size={20} color={theme.primary} />
            <ThemedText style={styles.suggestionsTitle}>Suggested usernames</ThemedText>
          </View>
          <ThemedText style={styles.suggestionsSubtitle}>
            Tap any suggestion to use it instantly
          </ThemedText>
          <View style={styles.suggestionsGrid}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionChip,
                  { backgroundColor: username === suggestion ? theme.primary : theme.background, borderColor: theme.border },
                  username === suggestion ? { borderColor: theme.primary } : null
                ]}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <ThemedText style={[
                  styles.suggestionText,
                  { color: username === suggestion ? 'white' : theme.text }
                ]}>
                  @{suggestion}
                </ThemedText>
                {username === suggestion && (
                  <IconSymbol name="checkmark" size={12} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              { backgroundColor: !isUsernameValid ? theme.border : theme.primary }
            ]} 
            onPress={handleContinue}
            disabled={!isUsernameValid}
          >
            <ThemedText style={[
              styles.continueButtonText,
              { color: !isUsernameValid ? theme.textSecondary : 'white' }
            ]}>
              Continue
            </ThemedText>
            <IconSymbol 
              name="arrow.right" 
              size={20} 
              color={!isUsernameValid ? theme.textSecondary : "white"} 
            />
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme color
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 20,
    position: 'relative',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '60%',
    top: 20,
  },
  decorativeCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    // backgroundColor: theme color + '80',
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: theme color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  circle1: {
    top: '30%',
    right: '10%',
  },
  circle2: {
    bottom: '25%',
    left: '5%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    // color: theme color
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    // color: theme color
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  inputSection: {
    paddingHorizontal: 24,
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
    
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 4,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  usernameInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    
    fontWeight: '500',
  },
  validInput: {
    // borderColor: theme color
  },
  invalidInput: {
    // borderColor: theme color
  },
  usernameStatus: {
    marginTop: 12,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  suggestionsSection: {
    marginBottom: 20,
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // color: theme color
  },
  suggestionsSubtitle: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '500',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  suggestionChip: {
    // backgroundColor: theme color
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    // borderColor: theme color
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedChip: {
    // backgroundColor: theme color
    // borderColor: theme color
    // shadowColor: theme color
    shadowOpacity: 0.3,
  },
  suggestionText: {
    fontSize: 13,
    // color: theme color
    fontWeight: '600',
  },
  selectedChipText: {
    color: 'white',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    // backgroundColor: theme color
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButtonText: {
    // color: theme color
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 24,
  },
  progressText: {
    fontSize: 14,
    // color: theme color
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    // backgroundColor: theme color
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    // backgroundColor: theme color
    borderRadius: 2,
  },
});