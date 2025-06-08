import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme, lightTheme } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/useAuthStore';
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';

export default function RootLayout() {
  const { isDarkMode, colors = darkTheme } = useThemeStore();
  const { isAuthenticated, isOnboarded } = useAuthStore();
  
  // Load fonts
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
  });
  
  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontFamily: 'PlusJakartaSans-SemiBold',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(onboarding)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: 'Edit Profile',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="contact-detail"
          options={{
            title: 'Contact Details',
          }}
        />
        <Stack.Screen
          name="live-activity-preview"
          options={{
            title: 'Live Activity Preview',
          }}
        />
      </Stack>
    </>
  );
}