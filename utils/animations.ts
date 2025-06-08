import { Platform } from 'react-native';
import Animated, {
  withTiming,
  withSpring,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';

// Shared animation configs
export const SPRING_CONFIG: WithSpringConfig = {
  damping: 20,
  mass: 1,
  stiffness: 200,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

export const TIMING_CONFIG: WithTimingConfig = {
  duration: 300,
};

// Safe animation config for web
export const getAnimationConfig = (isSpring = true) => {
  if (Platform.OS === 'web') {
    return TIMING_CONFIG;
  }
  return isSpring ? SPRING_CONFIG : TIMING_CONFIG;
};

// Theme transition animation
export const THEME_TRANSITION_CONFIG: WithTimingConfig = {
  duration: 400,
};

// Page transition animation
export const PAGE_TRANSITION_CONFIG: WithTimingConfig = {
  duration: 300,
};

// Stagger delay for list items
export const STAGGER_DELAY = 50; // ms between items

// Scale animation values
export const SCALE_UP = 1.02;
export const SCALE_DOWN = 0.98;