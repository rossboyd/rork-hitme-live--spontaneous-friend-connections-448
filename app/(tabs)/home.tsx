import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

export default function HomeScreen() {
  const { colors = darkTheme } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Content */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});