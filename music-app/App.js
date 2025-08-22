/**
 * MusicApp - Musical Journey App
 * @format
 */

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
import TabNavigator from './navigation/TabNavigator';

const Stack = createNativeStackNavigator();

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');

  useEffect(() => {
    // Configure Google Sign In
    GoogleSignin.configure({
      webClientId: '215325519739-mqhrsub07bllp648iistum7qap3v2t5l.apps.googleusercontent.com',
      iosClientId: '215325519739-mqhrsub07bllp648iistum7qap3v2t5l.apps.googleusercontent.com',
      offlineAccess: true,
      scopes: ['profile', 'email'],
    });
  }, []);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setCurrentScreen('welcome');
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
          <Stack.Screen name="Tabs" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
