import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  useSharedValue,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { SPRING_CONFIG, TIMING_CONFIG } from '@/utils/animations';

interface LiveModeStatusProps {
  timeRemaining: number;
  onGoOffline: () => void;
}

export const LiveModeStatus = ({ timeRemaining, onGoOffline }: LiveModeStatusProps) => {
  const { colors } = useThemeStore();
  const pulseValue = useSharedValue(1);
  const rotateValue = useSharedValue(0);
  
  // Format time remaining as MM:SS
  const minutes = Math.floor(timeRemaining / 1000 / 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  useEffect(() => {
    // Continuous pulse animation
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Slow rotation animation
    rotateValue.value = withRepeat(
      withTiming(360, { 
        duration: 10000,
        easing: Easing.linear 
      }),
      -1,
      true
    );
  }, []);

  const circleStyle = useAnimatedStyle(() => {
    const scale = Platform.OS === 'web' ? 1 : pulseValue.value;
    return {
      transform: [{ scale }],
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const rotate = Platform.OS === 'web' ? '0deg' : `${rotateValue.value}deg`;
    return {
      transform: [{ rotate }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, backgroundStyle]}>
        <View style={[styles.gradient, { backgroundColor: colors.primary }]} />
      </Animated.View>

      <Text style={[styles.title, { color: colors.primary }]}>You're Live!</Text>

      <Animated.View 
        style={[
          styles.circle, 
          { backgroundColor: colors.primary },
          circleStyle
        ]}
      >
        <Text style={styles.timeText}>{timeString}</Text>
      </Animated.View>
      
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
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    position: 'absolute',
    top: '40%',
    left: '-50%',
    right: '-50%',
    bottom: '-50%',
    borderRadius: 1000,
    opacity: 0.05,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 40,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  timeText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  offlineButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  offlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});