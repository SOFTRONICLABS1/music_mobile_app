import React from 'react';
import { useRouter } from 'expo-router';
import WelcomeScreen from '../components/WelcomeScreen';

export default function Welcome() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace('/auth');
  };

  return <WelcomeScreen onGetStarted={handleGetStarted} />;
}