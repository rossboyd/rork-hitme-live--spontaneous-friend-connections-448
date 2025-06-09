import React, { useRef, useState } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  PanResponder,
  Platform,
  TouchableOpacity
} from 'react-native';
import { Phone } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

interface SlideToLiveToggleProps {
  waitingCount: number;
  onSlideComplete: () => void;
  userName?: string;
  onPreviewQueue?: () => void;
}

const TOGGLE_HEIGHT = 240;
const THUMB_SIZE = 80;
const ACTIVATION_THRESHOLD = 0.8;

export const SlideToLiveToggle = ({ 
  waitingCount, 
  onSlideComplete,
  userName = 'You',
  onPreviewQueue
}: SlideToLiveToggleProps) => {
  const { colors = darkTheme } = useThemeStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isThresholdReached, setIsThresholdReached] = useState(false);
  
  const dragY = useRef(new Animated.Value(0)).current;
  const trackColorInterpolation = dragY.interpolate({
    inputRange: [-(TOGGLE_HEIGHT - THUMB_SIZE), 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  
  const trackBackgroundColor = trackColorInterpolation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, '#4ADE80']
  });
  
  const thumbScale = trackColorInterpolation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1.15],
    extrapolate: 'clamp'
  });
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = Math.max(-(TOGGLE_HEIGHT - THUMB_SIZE), Math.min(0, gestureState.dy));
        dragY.setValue(newY);
        
        const threshold = -(TOGGLE_HEIGHT - THUMB_SIZE) * ACTIVATION_THRESHOLD;
        const thresholdReached = newY <= threshold;
        
        if (thresholdReached !== isThresholdReached) {
          setIsThresholdReached(thresholdReached);
          if (Platform.OS !== 'web' && thresholdReached) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsDragging(false);
        
        const threshold = -(TOGGLE_HEIGHT - THUMB_SIZE) * ACTIVATION_THRESHOLD;
        if (gestureState.dy <= threshold) {
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          onSlideComplete();
        }
        
        Animated.spring(dragY, {
          toValue: 0,
          useNativeDriver: false,
          friction: 7,
          tension: 40
        }).start();
        
        setIsThresholdReached(false);
      }
    })
  ).current;

  const handlePreviewQueue = () => {
    if (waitingCount > 0 && onPreviewQueue) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPreviewQueue();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Hey {userName}, You're Offline</Text>
        <TouchableOpacity 
          onPress={handlePreviewQueue}
          disabled={waitingCount === 0 || !onPreviewQueue}
          activeOpacity={waitingCount > 0 ? 0.7 : 1}
        >
          <Text style={[
            styles.subtitle,
            { color: colors.text.secondary },
            waitingCount > 0 && [styles.clickableSubtitle, { color: colors.primary }]
          ]}>
            {waitingCount > 0 
              ? `${waitingCount} ${waitingCount === 1 ? 'person is' : 'people are'} waiting to chat`
              : 'No one is waiting to chat with you'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Animated.View 
        style={[
          styles.track,
          { backgroundColor: trackBackgroundColor }
        ]}
      >
        <Animated.View 
          style={[
            styles.thumb,
            {
              transform: [
                { translateY: dragY },
                { scale: thumbScale }
              ],
              borderColor: isThresholdReached ? colors.primary : 'transparent',
              backgroundColor: '#F3F4F6' // Light grey color for thumb
            }
          ]}
          {...panResponder.panHandlers}
        >
          <Phone 
            size={32} 
            color={isThresholdReached ? colors.primary : '#6B7280'} 
          />
        </Animated.View>
      </Animated.View>
      
      <Text style={[styles.instructionText, { color: colors.text.secondary }]}>
        {isDragging 
          ? isThresholdReached 
            ? "Release to switch" 
            : "Keep sliding up"
          : "Slide up to go live"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  clickableSubtitle: {
    textDecorationLine: 'underline',
  },
  track: {
    width: 80,
    height: TOGGLE_HEIGHT,
    borderRadius: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionText: {
    fontSize: 16,
    marginTop: 8,
  },
});