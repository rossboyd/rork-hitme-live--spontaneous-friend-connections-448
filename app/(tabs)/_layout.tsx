import React from "react";
import { Tabs } from "expo-router";
import { Home, ListChecks, Users, User } from "lucide-react-native";
import { useThemeStore } from "@/store/useThemeStore";
import { darkTheme } from "@/constants/colors";
import Animated from 'react-native-reanimated';
import { useThemeTransition } from '@/hooks/useThemeTransition';

export default function TabLayout() {
  const { theme, colors = darkTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const themeStyle = useThemeTransition(isDark);

  return (
    <Animated.View style={[{ flex: 1 }, themeStyle]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text.light,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text.primary,
          animation: 'fade',
        }}
      >
        {/* Tab screens remain the same */}
      </Tabs>
    </Animated.View>
  );
}