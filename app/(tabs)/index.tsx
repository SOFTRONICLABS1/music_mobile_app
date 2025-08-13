import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { GamesList } from '../../components/games/GamesList';
import { CommonStyles } from '../../utils/styles';

export default function GamesScreen() {
  return (
    <SafeAreaView style={[CommonStyles.container, styles.container]}>
      <GamesList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
