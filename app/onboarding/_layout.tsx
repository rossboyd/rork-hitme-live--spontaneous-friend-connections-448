import React from 'react';
import { Stack } from 'expo-router';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

export default function OnboardingLayout() {
  const { colors = darkTheme } = useThemeStore();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="welcome" 
        options={{
          title: "Welcome",
        }}
      />
      <Stack.Screen 
        name="profile" 
        options={{
          title: "Your Profile",
        }}
      />
      <Stack.Screen 
        name="notifications" 
        options={{
          title: "Notifications",
        }}
      />
    </Stack>
  );
}