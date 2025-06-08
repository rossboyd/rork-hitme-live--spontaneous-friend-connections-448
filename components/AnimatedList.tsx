import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AnimatedView } from './AnimatedView';

interface AnimatedListProps {
  children: React.ReactNode[];
  delay?: number;
  enabled?: boolean;
}

export const AnimatedList = ({
  children,
  delay = 0,
  enabled = true,
}: AnimatedListProps) => {
  return (
    <View style={styles.container}>
      {React.Children.map(children, (child, index) => (
        <AnimatedView
          key={index}
          index={index}
          delay={delay}
          enabled={enabled}
        >
          {child}
        </AnimatedView>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});