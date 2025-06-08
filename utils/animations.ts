// Shared animation configurations
import { Platform } from 'react-native';
import { 
  WithSpringConfig, 
  WithTimingConfig 
} from 'react-native-reanimated';

export const SPRING_CONFIG: WithSpringConfig = {
  damping: 20,
  mass: 1,
  stiffness: 200,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

export const TIMING_CONFIG: WithTimingConfig = {
  duration: 250,
};

// Safe animation config for web
export const getAnimationConfig = (isSpring = true) => {
  if (Platform.OS === 'web') {
    return TIMING_CONFIG;
  }
  return isSpring ? SPRING_CONFIG : TIMING_CONFIG;
};