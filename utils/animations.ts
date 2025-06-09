// Shared animation configurations
import { Platform } from 'react-native';
import {
  WithSpringConfig,
  WithTimingConfig
} from 'react-native-reanimated';

// Spring animation configuration
export const SPRING_CONFIG: WithSpringConfig = {
  damping: 20,
  mass: 1,
  stiffness: 200,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

// Timing animation configuration
export const TIMING_CONFIG: WithTimingConfig = {
  duration: 550,
};

// Config used for page transition animations
export const PAGE_TRANSITION_CONFIG: WithTimingConfig = {
  duration: 400,
};

// Delay between staggered item animations
export const STAGGER_DELAY = 50;

// Safe animation config for web
export const getAnimationConfig = (isSpring = true) => {
  if (Platform.OS === 'web') {
    return TIMING_CONFIG;
  }
  
  return isSpring ? SPRING_CONFIG : TIMING_CONFIG;
};