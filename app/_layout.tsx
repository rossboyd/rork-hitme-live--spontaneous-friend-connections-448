import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Always provide default colors to prevent undefined errors
  const { theme, colors = darkTheme } = useThemeStore();
  const { hasCompletedOnboarding, user } = useAppStore();
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

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inTabsGroup = segments[0] === '(tabs)';
    const isSignInScreen = segments[0] === '' || segments[0] === 'index';
    const isVerifyScreen = segments[0] === 'verify';

    // If no user is set, redirect to sign-in screen unless already there or in verify
    if (!user && !isSignInScreen && !isVerifyScreen) {
      router.replace('/');
      return;
    }

    // Only handle onboarding routing if user is authenticated
    if (user) {
      // If user hasn't completed onboarding and isn't in the onboarding flow
      if (!hasCompletedOnboarding && !inOnboardingGroup && !isVerifyScreen) {
        router.replace('/onboarding/welcome');
        return;
      }
      
      // If user has completed onboarding but is still in the onboarding flow
      if (hasCompletedOnboarding && (inOnboardingGroup || isVerifyScreen)) {
        router.replace('/(tabs)/home');
        return;
      }
    }
  }, [fontsLoaded, hasCompletedOnboarding, segments, router, user]);

  if (!fontsLoaded) {
    return null;
  }

  return (
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
  );
}