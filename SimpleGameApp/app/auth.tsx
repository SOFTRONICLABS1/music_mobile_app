import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { SignInForm } from '../components/auth/SignInForm';
import { SignUpForm } from '../components/auth/SignUpForm';
import { CommonStyles } from '../utils/styles';

export default function AuthScreen() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <SafeAreaView style={[CommonStyles.container, styles.container]}>
      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {isSignIn ? (
          <SignInForm onSignUpPress={() => setIsSignIn(false)} />
        ) : (
          <SignUpForm onSignInPress={() => setIsSignIn(true)} />
        )}
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