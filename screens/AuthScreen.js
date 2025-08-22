import React from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { SignInForm } from '../components/auth/SignInForm';
import { useTheme } from '../theme/ThemeContext';

export default function AuthScreen({ navigation }) {
  const { theme } = useTheme();

  const handleGoogleSignInSuccess = (userInfo) => {
    // Log user data to terminal for debugging
    console.log('Google Sign-In Success:', JSON.stringify(userInfo, null, 2));
    
    // Skip response screen and navigate directly to welcome page
    navigation.navigate('WelcomeUser');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SignInForm onGoogleSignInSuccess={handleGoogleSignInSuccess} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});