import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { AppColors } from '../utils/colors';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [router]);

  return <View style={{ flex: 1, backgroundColor: AppColors.background }} />;
}