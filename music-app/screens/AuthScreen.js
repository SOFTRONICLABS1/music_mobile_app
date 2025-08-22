import React from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { SignInForm } from '../components/auth/SignInForm';
import { useTheme } from '../theme/ThemeContext';

export default function AuthScreen({ navigation }) {
  const { theme } = useTheme();

  const handleGoogleSignInSuccess = (userInfo) => {
    console.log('🎉 AuthScreen: handleGoogleSignInSuccess called!');
    console.log('🎉 UserInfo received:', JSON.stringify(userInfo, null, 2));
    
    // Check if we have API response
    if (userInfo.apiResponse) {
      console.log('=== BACKEND API RESPONSE IN AUTHSCREEN ===');
      console.log(JSON.stringify(userInfo.apiResponse, null, 2));
      console.log('===========================================');
      
      // Store auth token if available
      if (userInfo.apiResponse.token || userInfo.apiResponse.access_token) {
        const token = userInfo.apiResponse.token || userInfo.apiResponse.access_token;
        // You can store this token in AsyncStorage or your auth context
        console.log('🔐 Auth token received:', token?.substring(0, 30) + '...');
      }
    }
    
    console.log('🎉 About to navigate to WelcomeUser...');
    // Skip response screen and navigate directly to welcome page
    navigation.navigate('WelcomeUser');
    
    console.log('🎉 Navigation.navigate called!');
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