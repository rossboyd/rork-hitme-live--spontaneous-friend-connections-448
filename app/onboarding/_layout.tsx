import React from 'react';
import { Stack } from 'expo-router';
import { darkTheme } from '@/constants/colors';

export default function OnboardingLayout() {
  // Remove the useThemeStore hook to prevent infinite loop
  // We'll use a static theme for onboarding
  const colors = darkTheme;
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    />
  );
}