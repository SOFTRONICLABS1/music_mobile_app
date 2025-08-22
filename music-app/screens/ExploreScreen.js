import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { GamesList } from '../components/games/GamesList';
import { AppColors } from '../theme/Colors';

export default function ExploreScreen({ navigation }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: AppColors.background }]}>
      <GamesList navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});