import React from 'react';
import Animated from 'react-native-reanimated';
import { useAnimatedTransition } from '@/hooks/useAnimatedTransition';

interface AnimatedViewProps {
  children: React.ReactNode;
  index?: number;
  delay?: number;
  enabled?: boolean;
  style?: any;
}

export const AnimatedView = ({
  children,
  index = 0,
  delay = 0,
  enabled = true,
  style,
}: AnimatedViewProps) => {
  const animatedStyle = useAnimatedTransition(index, enabled, delay);

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};