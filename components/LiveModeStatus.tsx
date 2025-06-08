import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';

interface LiveModeStatusProps {
  timeRemaining: number;
  onGoOffline: () => void;
}

export const LiveModeStatus = ({ timeRemaining, onGoOffline }: LiveModeStatusProps) => {
  const { colors } = useThemeStore();
  
  // Format remaining time
  const minutes = Math.floor(timeRemaining / 1000 / 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.title}>You're Live!</Text>
      
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.pulseCircle]} />
        <View style={styles.circle}>
          <Text style={styles.timeText}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.offlineButton, { backgroundColor: colors.card }]}
        onPress={onGoOffline}
      >
        <Text style={[styles.offlineText, { color: colors.text.primary }]}>Go Offline</Text>
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
    color: '#00FF00',
    marginBottom: 40,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#00FF00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#00FF0033',
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
  offlineText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});