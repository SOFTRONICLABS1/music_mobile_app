import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { GamesList } from '../components/games/GamesList';
import { useTheme } from '../theme/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <GamesList navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
