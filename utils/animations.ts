import { Platform } from 'react-native';
import { 
  WithSpringConfig, 
  WithTimingConfig,
  Easing
} from 'react-native-reanimated';

// Spring animation for natural movement
export const SPRING_CONFIG: WithSpringConfig = {
  damping: 15,
  mass: 1,
  stiffness: 180,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

// Timing animation for controlled movement
export const TIMING_CONFIG: WithTimingConfig = {
  duration: 300,
  easing: Easing.bezier(0.4, 0.0, 0.2, 1), // Material Design easing
};

// Quick timing for micro-interactions
export const QUICK_TIMING: WithTimingConfig = {
  duration: 150,
  easing: Easing.bezier(0.4, 0.0, 0.2, 1),
};

// Slow spring for dramatic effects
export const DRAMATIC_SPRING: WithSpringConfig = {
  damping: 12,
  mass: 1,
  stiffness: 120,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

// Safe animation config for web
export const getAnimationConfig = (type: 'spring' | 'timing' | 'quick' | 'dramatic' = 'spring') => {
  if (Platform.OS === 'web') {
    return TIMING_CONFIG;
  }
  
  switch (type) {
    case 'timing':
      return TIMING_CONFIG;
    case 'quick':
      return QUICK_TIMING;
    case 'dramatic':
      return DRAMATIC_SPRING;
    default:
      return SPRING_CONFIG;
  }
};