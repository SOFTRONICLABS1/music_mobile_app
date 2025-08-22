import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/theme/ThemeContext';

interface SignUpFormProps {
  onSignInPress: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSignInPress }) => {
  const { theme } = useTheme();
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
        <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Join MusicApp today</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.input,
            borderColor: theme.inputBorder,
            color: theme.text
          }]}
          placeholder="Full Name"
          placeholderTextColor={theme.textTertiary}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
        />

        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.input,
            borderColor: theme.inputBorder,
            color: theme.text
          }]}
          placeholder="Email"
          placeholderTextColor={theme.textTertiary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.input,
            borderColor: theme.inputBorder,
            color: theme.text
          }]}
          placeholder="Password"
          placeholderTextColor={theme.textTertiary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.input,
            borderColor: theme.inputBorder,
            color: theme.text
          }]}
          placeholder="Confirm Password"
          placeholderTextColor={theme.textTertiary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={[styles.signUpButton, { backgroundColor: theme.primary }]} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.signInButton, { 
          backgroundColor: theme.surface,
          borderColor: theme.border
        }]} onPress={onSignInPress}>
          <Text style={[styles.signInButtonText, { color: theme.primary }]}>Already have an account? Sign In</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gap: 16,
  },
  input: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  signUpButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signInButton: {
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});