import { Platform } from 'react-native';

export const SPRING_CONFIG = {
  damping: 20,
  mass: 1,
  stiffness: 200,
  overshootClamping: false,
  useNativeDriver: true,
};

export const TIMING_CONFIG = {
  duration: 250,
  useNativeDriver: true,
};

export const PAGE_TRANSITION_CONFIG = {
  duration: 400,
  useNativeDriver: true,
};

export const STAGGER_DELAY = 50;

export const getAnimationConfig = (isSpring = true) => {
  if (Platform.OS === 'web') {
    return TIMING_CONFIG;
  }
  return isSpring ? SPRING_CONFIG : TIMING_CONFIG;
};