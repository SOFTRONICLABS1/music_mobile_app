import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { CommonStyles } from '../../utils/styles';
import { AuthColors, AppColors } from '../../utils/colors';

interface SignUpFormProps {
  onSignInPress: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSignInPress }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    // TODO: Implement actual registration
    console.log('Sign up attempt:', { name, email, password });
    
    // Navigate to main app
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join MusicApp today</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={CommonStyles.input}
          placeholder="Full Name"
          placeholderTextColor={AuthColors.inputPlaceholder}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
        />

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

        <TextInput
          style={CommonStyles.input}
          placeholder="Confirm Password"
          placeholderTextColor={AuthColors.inputPlaceholder}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton} onPress={onSignInPress}>
          <Text style={styles.signInButtonText}>Already have an account? Sign In</Text>
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
  signUpButton: {
    backgroundColor: AuthColors.signInButton,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
  },
  signUpButtonText: {
    color: AppColors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: AuthColors.signUpButton,
    borderColor: AuthColors.signUpButtonBorder,
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
  },
  signInButtonText: {
    color: AuthColors.signUpButtonBorder,
    fontSize: 16,
    fontWeight: '600',
  },
});