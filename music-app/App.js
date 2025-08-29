/**
 * MusicApp - Musical Journey App
 * @format
 */

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeProvider } from './theme/ThemeContext';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import AuthScreen from './screens/AuthScreen';
import ResponseScreen from './screens/ResponseScreen';
import WelcomeUserScreen from './screens/WelcomeUserScreen';
import UsernamePickerScreen from './screens/UsernamePickerScreen';
import PhoneVerificationScreen from './screens/PhoneVerificationScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import GameScreen from './screens/GameScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import TabNavigator from './navigation/TabNavigator';

const Stack = createNativeStackNavigator();

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  useEffect(() => {
    // Configure Google Sign In
    GoogleSignin.configure({
      webClientId: '60455306259-ml12gn46kbaac5rmnsint4i88e0d7amj.apps.googleusercontent.com',
      iosClientId: '60455306259-c9erh3v8qcn6pvjcd45a4848siakqfrs.apps.googleusercontent.com',
      offlineAccess: true,
      scopes: ['profile', 'email'],
      forceCodeForRefreshToken: true, // Forces account picker on Android
    });

    // Firebase token service will be loaded on-demand during sign-in
    console.log('🔥 Firebase token service ready (on-demand loading)');
  }, []);

  // Check for existing authentication token
  const checkAuthStatus = async () => {
    try {
      setIsCheckingAuth(true);
      console.log('=================== Checking Authentication Status ===================');
      
      const token = await AsyncStorage.getItem('access_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      console.log('🔑 Stored token exists:', !!token);
      
      if (token && userData) {
        const user = JSON.parse(userData);
        console.log('👤 Stored user data:', user);
        console.log('👤 Has username:', !!user.username);
        
        if (user.username && user.username !== null) {
          // User is authenticated and has complete profile - go to main app
          console.log('✅ User authenticated with complete profile - navigating to Explore');
          console.log('=================== Auth Check Completed - Authenticated ===================');
          setCurrentScreen('authenticated');
          return;
        } else {
          console.log('⚠️ User authenticated but missing username - clearing auth');
          // Clear incomplete auth data
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('user_data');
        }
      }
      
      console.log('❌ No valid authentication found - showing welcome flow');
      console.log('=================== Auth Check Completed - Not Authenticated ===================');
      setCurrentScreen('welcome');
    } catch (error) {
      console.error('Error checking auth status:', error);
      setCurrentScreen('welcome');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Handle splash screen completion
  const handleSplashComplete = () => {
    checkAuthStatus();
  };

  // Handle welcome screen completion
  const handleWelcomeComplete = () => {
    setCurrentScreen('navigation');
  };

  if (currentScreen === 'splash') {
    return (
      <ThemeProvider>
        <StatusBar barStyle="light-content" />
        <SplashScreen onComplete={handleSplashComplete} />
      </ThemeProvider>
    );
  }

  if (currentScreen === 'welcome') {
    return (
      <ThemeProvider>
        <StatusBar barStyle="light-content" />
        <WelcomeScreen onGetStarted={handleWelcomeComplete} />
      </ThemeProvider>
    );
  }

  if (currentScreen === 'authenticated') {
    return (
      <ThemeProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" />
          <Stack.Navigator 
            screenOptions={{ 
              headerShown: false,
              animation: 'slide_from_right'
            }}
            initialRouteName="Tabs"
          >
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="ResponseScreen" component={ResponseScreen} />
            <Stack.Screen name="WelcomeUser" component={WelcomeUserScreen} />
            <Stack.Screen name="UsernamePicker" component={UsernamePickerScreen} />
            <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="Game" component={GameScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Tabs" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" />
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_right'
          }}
          initialRouteName="Auth"
        >
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="ResponseScreen" component={ResponseScreen} />
          <Stack.Screen name="WelcomeUser" component={WelcomeUserScreen} />
          <Stack.Screen name="UsernamePicker" component={UsernamePickerScreen} />
          <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Tabs" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
