import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { CommonStyles } from '../../utils/styles';
import { AuthColors, AppColors } from '../../utils/colors';

interface SignInFormProps {
  onSignUpPress: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSignUpPress }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // TODO: Implement actual authentication
    console.log('Sign in attempt:', { email, password });
    
    // Navigate to main app
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to MusicApp</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={CommonStyles.input}
          placeholder="Email"
          placeholderTextColor={AuthColors.inputPlaceholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={CommonStyles.input}
          placeholder="Password"
          placeholderTextColor={AuthColors.inputPlaceholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} onPress={onSignUpPress}>
          <Text style={styles.signUpButtonText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textSecondary,
  },
  form: {
    gap: 16,
  },
  signInButton: {
    backgroundColor: AuthColors.signInButton,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
  },
  signInButtonText: {
    color: AppColors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: AuthColors.signUpButton,
    borderColor: AuthColors.signUpButtonBorder,
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
  },
  signUpButtonText: {
    color: AuthColors.signUpButtonBorder,
    fontSize: 16,
    fontWeight: '600',
  },
});