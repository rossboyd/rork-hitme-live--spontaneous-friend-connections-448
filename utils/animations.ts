import { Platform } from 'react-native';
import { 
  WithSpringConfig, 
  WithTimingConfig,
  Easing
} from 'react-native-reanimated';

export const SPRING_CONFIG: WithSpringConfig = {
  damping: 15,
  mass: 1,
  stiffness: 180,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

export const TIMING_CONFIG: WithTimingConfig = {
  duration: 300,
  easing: Easing.bezier(0.4, 0.0, 0.2, 1),
};

export const getAnimationConfig = (type: 'spring' | 'timing' = 'spring') => {
  if (Platform.OS === 'web') {
    return TIMING_CONFIG;
  }
  return type === 'spring' ? SPRING_CONFIG : TIMING_CONFIG;
};