import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Always provide default colors to prevent undefined errors
  const { colors = darkTheme } = useThemeStore();
  const { hasCompletedOnboarding } = useAppStore();
  const segments = useSegments();
  const router = useRouter();
  
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Handle authentication and onboarding routing
  useEffect(() => {
    if (!fontsLoaded) return;

    const currentSegment = segments[0] as string | undefined;
    const inOnboardingGroup = currentSegment === 'onboarding';
    
    // Auth-related routes that should bypass onboarding redirect
    const isAuthRoute = 
      currentSegment === 'verify' || 
      currentSegment === undefined; // root/index (login)

    // If user hasn't completed onboarding and isn't in the onboarding flow or auth flow
    if (!hasCompletedOnboarding && !inOnboardingGroup && !isAuthRoute) {
      router.replace('/onboarding/welcome' as any);
    }
    
    // If user has completed onboarding but is still in the onboarding flow
    if (hasCompletedOnboarding && (inOnboardingGroup || currentSegment === 'verify')) {
      router.replace('/(tabs)/home' as any);
    }
  }, [fontsLoaded, hasCompletedOnboarding, segments, router]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: colors.text.primary,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="verify"
        options={{
          headerTitle: '',
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
    </GestureHandlerRootView>
  );
}