import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import SplashScreen from '../components/SplashScreen';
import { useTheme } from '@/theme/ThemeContext';

export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
    router.replace('/welcome');
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return <View style={{ flex: 1, backgroundColor: theme.background }} />;
}