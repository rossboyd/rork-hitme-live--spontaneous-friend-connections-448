import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';

interface LiveModeStatusProps {
  timeRemaining: number;
  onGoOffline: () => void;
}

export const LiveModeStatus = ({ timeRemaining, onGoOffline }: LiveModeStatusProps) => {
  const { colors } = useThemeStore();
  
  // Format time remaining as MM:SS
  const minutes = Math.floor(timeRemaining / 1000 / 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>You're Live!</Text>
      <View style={[styles.circle, { backgroundColor: colors.primary }]}>
        <Text style={styles.timeText}>{timeString}</Text>
      </View>
      
      <TouchableOpacity
        style={[styles.offlineButton, { backgroundColor: colors.accent }]}
        onPress={onGoOffline}
      >
        <Text style={styles.offlineButtonText}>Go Offline</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 40,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  timeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  offlineButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  offlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});