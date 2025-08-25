import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { IconSymbol } from '../ui/IconSymbol';
import { useTheme } from '../../theme/ThemeContext';
import { authService } from '../../src/api';

interface SignInFormProps {
  onGoogleSignInSuccess: (userInfo: any) => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onGoogleSignInSuccess }) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      console.log('=== STARTING GOOGLE SIGN-IN ===');
      
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the user's ID token
      const userInfo = await GoogleSignin.signIn();
      
      console.log('=== GOOGLE SIGN-IN RESULT ===');
      console.log('Full userInfo:', JSON.stringify(userInfo, null, 2));
      console.log('userInfo type:', typeof userInfo);
      console.log('userInfo exists:', !!userInfo);
      
      // Check for successful sign-in (checking all possible response structures)
      const user = (userInfo as any)?.user || (userInfo as any)?.data?.user;
      const idToken = (userInfo as any)?.idToken || (userInfo as any)?.data?.idToken;
      
      if (userInfo && user && user.email && idToken) {
        console.log('✅ SIGN-IN SUCCESSFUL - CALLING SUCCESS CALLBACK');
        console.log('✅ User email:', user.email);
        console.log('✅ ID Token:', idToken?.substring(0, 50) + '...');
        
        // Call backend API for complete Google authentication flow
        try {
          console.log('📡 Starting complete Google authentication flow...');
          const authResult = await authService.googleSignIn(
            idToken,
            Platform.OS === 'ios' ? 'ios' : 'android',
            user
          );
          
          console.log('🎉 Complete authentication successful!');
          console.log('🔑 Access token received:', !!authResult.access_token);
          
          // Pass both Google user info and auth result to success handler
          onGoogleSignInSuccess({
            ...userInfo,
            user: authResult.user || user,
            authResult: authResult,
            access_token: authResult.access_token,
            is_new_user: authResult.is_new_user
          });
          
        } catch (apiError: any) {
          console.error('❌ Google authentication failed:', apiError);
          Alert.alert(
            'Authentication Failed',
            apiError.response?.data?.message || 'Failed to authenticate with server. Please try again.'
          );
          return;
        }
      } else {
        console.log('❌ SIGN-IN INCOMPLETE - NOT NAVIGATING');
        console.log('❌ user object:', !!user);
        console.log('❌ user.email:', !!user?.email);
        console.log('❌ idToken:', !!idToken);
      }
      
    } catch (error: any) {
      console.log('=== GOOGLE SIGN-IN ERROR ===');
      console.error('Full error:', error);
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);
      console.log('Error type:', typeof error);
      
      // Don't navigate on any error, especially cancellation
      console.log('❌ ERROR OCCURRED - NOT NAVIGATING');
      
      if (error.code === 'SIGN_IN_CANCELLED' || 
          error.code === '-5' || 
          error.message?.includes('cancelled') ||
          error.message?.includes('cancel')) {
        console.log('❌ CONFIRMED CANCELLATION - STAYING ON PAGE');
        return;
      }
      
      let errorMessage = 'Sign in failed. Please try again.';
      if (error.code === 'IN_PROGRESS') {
        errorMessage = 'Sign in is already in progress.';
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        errorMessage = 'Google Play services not available.';
      }
      
      Alert.alert('Sign In Error', errorMessage);
    } finally {
      setIsLoading(false);
      console.log('=== GOOGLE SIGN-IN COMPLETED ===');
    }
  };

  const handleAppleSignIn = () => {
    // Placeholder for Apple sign in
    Alert.alert('Apple Sign In', 'Apple Sign In is not implemented yet');
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Infographic Section */}
      <View style={styles.infographicSection}>
        <View style={[styles.mainLogoContainer, { 
          backgroundColor: theme.surface,
          shadowColor: theme.primary
        }]}>
          <IconSymbol name="music.note" size={80} color={theme.primary} />
        </View>
        
        {/* Decorative Music Elements */}
        <View style={styles.decorativeContainer}>
          <View style={[styles.musicNote, styles.note1, { backgroundColor: theme.surface + '80' }]}>
            <IconSymbol name="music.note" size={24} color={theme.primary} />
          </View>
          <View style={[styles.musicNote, styles.note2, { backgroundColor: theme.surface + '80' }]}>
            <IconSymbol name="music.note" size={20} color={theme.primary} />
          </View>
          <View style={[styles.musicNote, styles.note3, { backgroundColor: theme.surface + '80' }]}>
            <IconSymbol name="music.note" size={18} color={theme.primary} />
          </View>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Start Your Musical Journey</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Learn music through games with personalized lessons and track your progress
        </Text>
      </View>

      {/* Enhanced Social Login Buttons */}
      <View style={styles.socialButtonsContainer}>
        <Pressable 
          style={({ pressed }) => [
            styles.googleButton, 
            { 
              backgroundColor: theme.surface,
              borderColor: theme.border,
              transform: pressed ? [{ translateY: 2 }] : [{ translateY: 0 }],
              opacity: pressed ? 0.9 : 1
            }
          ]} 
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          <IconSymbol name="globe" size={24} color="#4285F4" />
          <Text style={[styles.googleButtonText, { color: theme.text }]}>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Text>
          <IconSymbol name="arrow.right" size={16} color="#4285F4" />
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.appleButton, 
            { 
              backgroundColor: theme.text,
              transform: pressed ? [{ translateY: 2 }] : [{ translateY: 0 }],
              opacity: pressed ? 0.9 : 1
            }
          ]} 
          onPress={handleAppleSignIn}
        >
          <IconSymbol name="apple.logo" size={24} color={theme.background} />
          <Text style={[styles.appleButtonText, { color: theme.background }]}>Continue with Apple</Text>
          <IconSymbol name="arrow.right" size={16} color={theme.background} />
        </Pressable>
      </View>

      {/* Features Preview */}
      <View style={[styles.featuresContainer, { backgroundColor: theme.surface }]}>
        <View style={styles.featureItem}>
          <IconSymbol name="gamecontroller.fill" size={20} color={theme.primary} />
          <Text style={[styles.featureText, { color: theme.textSecondary }]}>Interactive Games</Text>
        </View>
        <View style={styles.featureItem}>
          <IconSymbol name="person.3.fill" size={20} color={theme.primary} />
          <Text style={[styles.featureText, { color: theme.textSecondary }]}>Expert Teachers</Text>
        </View>
        <View style={styles.featureItem}>
          <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color={theme.primary} />
          <Text style={[styles.featureText, { color: theme.textSecondary }]}>Progress Tracking</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  infographicSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mainLogoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  decorativeContainer: {
    position: 'absolute',
    width: '100%',
    height: '60%',
    top: 0,
  },
  musicNote: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  note1: {
    top: '20%',
    right: '15%',
  },
  note2: {
    bottom: '30%',
    left: '10%',
  },
  note3: {
    top: '45%',
    left: '5%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  socialButtonsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  appleButtonText: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  featureItem: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});