import React, { useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions,
  Platform,
  Pressable
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOGGLE_WIDTH = Math.min(SCREEN_WIDTH - 48, 400);
const THUMB_SIZE = 64;
const TRACK_HEIGHT = 80;
const SLIDE_THRESHOLD = 0.75;

interface Props {
  waitingCount: number;
  onSlideComplete: () => void;
  userName?: string;
  onPreviewQueue?: () => void;
}

export const SlideToLiveToggle = ({ 
  waitingCount, 
  onSlideComplete,
  userName = 'there',
  onPreviewQueue
}: Props) => {
  const { colors = darkTheme } = useThemeStore();
  const translateX = useSharedValue(0);
  const isSliding = useSharedValue(false);

  const maxTranslate = TOGGLE_WIDTH - THUMB_SIZE;

  const reset = useCallback(() => {
    translateX.value = withSpring(0);
    isSliding.value = false;
  }, [translateX]);

  const handleComplete = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onSlideComplete();
    reset();
  }, [onSlideComplete, reset]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      isSliding.value = true;
    },
    onActive: (event, ctx) => {
      const newTranslate = ctx.startX + event.translationX;
      translateX.value = Math.max(0, Math.min(newTranslate, maxTranslate));
    },
    onEnd: () => {
      const slidePercentage = translateX.value / maxTranslate;
      
      if (slidePercentage > SLIDE_THRESHOLD) {
        translateX.value = withSpring(maxTranslate, {}, () => {
          runOnJS(handleComplete)();
        });
      } else {
        translateX.value = withSpring(0);
      }
      isSliding.value = false;
    },
  });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, maxTranslate * 0.5],
      [1, 0]
    ),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text.primary }]}>
          Hi {userName}!
        </Text>
        {waitingCount > 0 && (
          <Pressable onPress={onPreviewQueue}>
            <Text style={[styles.waiting, { color: colors.text.secondary }]}>
              {waitingCount} {waitingCount === 1 ? 'person' : 'people'} waiting
            </Text>
          </Pressable>
        )}
      </View>

      <View style={[styles.toggle, { backgroundColor: colors.card }]}>
        <Animated.Text style={[styles.toggleText, textStyle, { color: colors.text.light }]}>
          Slide to go live
        </Animated.Text>

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <View style={[styles.thumbInner, { backgroundColor: '#F3F4F6' }]} />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  waiting: {
    fontSize: 16,
  },
  toggle: {
    width: TOGGLE_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  toggleText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  thumb: {
    position: 'absolute',
    left: (TRACK_HEIGHT - THUMB_SIZE) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbInner: {
    width: THUMB_SIZE - 8,
    height: THUMB_SIZE - 8,
    borderRadius: (THUMB_SIZE - 8) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
});