import { useEffect } from 'react';
import { Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { PAGE_TRANSITION_CONFIG, STAGGER_DELAY } from '@/utils/animations';

export const useAnimatedTransition = (
  index = 0,
  enabled = true,
  delay = 0
) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    if (!enabled) return;
    
    // Skip animations on web
    if (Platform.OS === 'web') {
      opacity.value = 1;
      scale.value = 1;
      return;
    }

    const staggerDelay = index * STAGGER_DELAY;
    const totalDelay = delay + staggerDelay;

    opacity.value = withDelay(
      totalDelay,
      withTiming(1, PAGE_TRANSITION_CONFIG)
    );

    scale.value = withDelay(
      totalDelay,
      withTiming(1, PAGE_TRANSITION_CONFIG)
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return style;
};