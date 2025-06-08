import { useEffect } from 'react';
import { Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { darkTheme, lightTheme } from '@/constants/colors';

export const useThemeTransition = (isDark: boolean) => {
  const progress = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isDark ? 1 : 0, {
      duration: 400,
    });
  }, [isDark]);

  const style = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [lightTheme.background, darkTheme.background]
    ),
  }));

  return style;
};