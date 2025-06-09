import React from 'react';
import { Stack } from 'expo-router';
import { darkTheme } from '@/constants/colors';

export default function OnboardingLayout() {
  // Use static theme to prevent infinite loop
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