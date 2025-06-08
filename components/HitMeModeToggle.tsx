import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';

interface HitMeModeToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

export const HitMeModeToggle = ({ isActive, onToggle }: HitMeModeToggleProps) => {
  const { colors } = useThemeStore();
  const animation = React.useRef(new Animated.Value(isActive ? 1 : 0)).current;
  
  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isActive, animation]);
  
  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E2E8F0', colors.primary]
  });
  
  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22]
  });
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={[styles.text, isActive && styles.activeText]}>
          {isActive ? 'HitMeMode Active' : 'Activate HitMeMode'}
        </Text>
        
        <Animated.View style={[styles.toggle, { backgroundColor }]}>
          <Animated.View 
            style={[
              styles.thumb,
              { 
                transform: [{ translateX }],
                backgroundColor: isActive ? '#fff' : colors.text.primary
              }
            ]} 
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  activeText: {
    color: colors.primary,
    fontWeight: '600',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});