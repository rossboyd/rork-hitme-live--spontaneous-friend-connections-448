import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Animated, { 
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

interface LiveActivitySimulatorProps {
  timeRemaining: number;
  onlineCount: number;
  userAvatar: string;
}

export const LiveActivitySimulator = ({ 
  timeRemaining,
  onlineCount,
  userAvatar
}: LiveActivitySimulatorProps) => {
  const router = useRouter();

  // Format time remaining as MM:SS
  const minutes = Math.floor(timeRemaining / 1000 / 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Calculate progress percentage
  const progress = timeRemaining / (30 * 60 * 1000); // Assuming 30 min total

  // Animated styles
  const pulseStyle = useAnimatedStyle(() => {
    if (Platform.OS === 'web') return {};
    
    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withTiming(1.1, { duration: 1000 }),
              withTiming(1, { duration: 1000 })
            ),
            -1,
            true
          ),
        },
      ],
    };
  });

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push('/(tabs)/home')}
      activeOpacity={0.9}
    >
      <View style={styles.widget}>
        <View style={styles.header}>
          <Text style={styles.appName}>HitMeApp</Text>
          <View style={styles.avatarStack}>
            <Image
              source={{ uri: userAvatar }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.avatarOverlay} />
            <View style={[styles.avatarOverlay, { right: 8 }]} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.onlineCount}>
            <Text style={styles.highlightText}>{onlineCount}</Text> friends online
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { width: `${progress * 100}%` },
                  Platform.OS !== 'web' && pulseStyle
                ]} 
              />
              <View style={[styles.progressDot, { left: `${progress * 100}%` }]} />
            </View>
          </View>

          <Text style={styles.timeRemaining}>
            {timeString} remaining
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  widget: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 24,
    padding: 16,
    backdropFilter: 'blur(20px)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarOverlay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    right: 16,
  },
  content: {
    gap: 12,
  },
  onlineCount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  highlightText: {
    color: '#00FF00',
  },
  progressContainer: {
    marginVertical: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00FF00',
    borderRadius: 2,
  },
  progressDot: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00FF00',
    marginLeft: -6,
  },
  timeRemaining: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans-Bold',
  },
});