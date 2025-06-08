import React from "react";
import { Tabs } from "expo-router";
import { Home, ListChecks, Users, User } from "lucide-react-native";
import { useThemeStore } from "@/store/useThemeStore";
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  interpolateColor
} from 'react-native-reanimated';
import { SPRING_CONFIG, TIMING_CONFIG } from '@/utils/animations';

export default function TabLayout() {
  const { colors, theme } = useThemeStore();

  const tabBarStyle = useAnimatedStyle(() => ({
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: 1,
  }));

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.light,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text.primary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          fontFamily: 'PlusJakartaSans-SemiBold',
        },
        // Add smooth transition for tab press
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
      }}
    >
      {/* ... rest of the code ... */}
    </Tabs>
  );
}