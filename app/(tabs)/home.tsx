import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { useAppStore } from '@/store/useAppStore';

export default function HomeScreen() {
  const { setMode, colors } = useThemeStore();
  const { isHitMeModeActive } = useAppStore();
  
  useEffect(() => {
    setMode(isHitMeModeActive ? 'light' : 'dark');
  }, [isHitMeModeActive, setMode]);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Rest of your home screen content */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});