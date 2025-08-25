import React from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { SignInForm } from '../components/auth/SignInForm';
import { useTheme } from '../theme/ThemeContext';

export default function AuthScreen({ navigation }) {
  const { theme } = useTheme();

  const handleGoogleSignInSuccess = (userInfo) => {
    console.log('🎉 AuthScreen: handleGoogleSignInSuccess called!');
    console.log('🎉 UserInfo received:', JSON.stringify(userInfo, null, 2));
    
    // Check if we have auth result
    const authData = userInfo.authResult || userInfo.apiResponse;
    
    if (authData) {
      console.log('=== BACKEND API RESPONSE IN AUTHSCREEN ===');
      console.log(JSON.stringify(authData, null, 2));
      console.log('===========================================');
      
      // Check if user is new or existing
      const isNewUser = userInfo.is_new_user !== undefined ? userInfo.is_new_user : authData.is_new_user;
      const user = authData.user || userInfo.user;
      const hasUsername = user && user.username && user.username !== null;
      
      console.log('🆕 Is new user:', isNewUser);
      console.log('👤 Has username:', hasUsername, 'Username:', user?.username);
      
      if (isNewUser === false && hasUsername) {
        // Existing user with complete profile - go directly to main app
        console.log('📱 Existing user with complete profile - navigating directly to Explore page...');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        });
        return;
      }
    }
    
    // New user or incomplete profile - go through onboarding
    console.log('🎉 New user or incomplete profile - starting onboarding flow...');
    navigation.navigate('WelcomeUser');
    
    console.log('🎉 Navigation completed!');
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