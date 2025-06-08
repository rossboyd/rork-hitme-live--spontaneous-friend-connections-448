import { useEffect } from 'react';
import { Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { THEME_TRANSITION_CONFIG } from '@/utils/animations';
import { darkTheme, lightTheme } from '@/constants/colors';

export const useThemeTransition = (isDark: boolean) => {
  const progress = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    if (Platform.OS === 'web') {
      progress.value = isDark ? 1 : 0;
      return;
    }

    progress.value = withTiming(
      isDark ? 1 : 0,
      THEME_TRANSITION_CONFIG
    );
  }, [isDark]);

  const style = useAnimatedStyle(() => {
    const backgroundColor = {
      r: withTiming(
        isDark ? darkTheme.background : lightTheme.background,
        THEME_TRANSITION_CONFIG
      ),
      g: withTiming(
        isDark ? darkTheme.text.primary : lightTheme.text.primary,
        THEME_TRANSITION_CONFIG  
      ),
    };

    return {
      backgroundColor: backgroundColor.r,
      color: backgroundColor.g,
    };
  });

  return style;
};