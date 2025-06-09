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
    const isRootScreen = segments.length === 0 || segments[0] === '';
    const isVerifyScreen = segments[0] === 'verify';

    // If user hasn't completed onboarding and isn't in the onboarding flow or initial screens
    if (!hasCompletedOnboarding && 
        !inOnboardingGroup && 
        !isVerifyScreen && 
        !isRootScreen) {
      router.replace('/onboarding/welcome');
      return;
    }
    
    // If user has completed onboarding but is still in the onboarding flow
    if (hasCompletedOnboarding && (inOnboardingGroup || isVerifyScreen)) {
      router.replace('/(tabs)/home');
      return;
    }
  }, [fontsLoaded, hasCompletedOnboarding, segments, router]);

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
      {/* Root screen */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      
      {/* Verification screen */}
      <Stack.Screen
        name="verify"
        options={{
          headerTitle: '',
          headerTransparent: true,
        }}
      />
      
      {/* Onboarding group - hide the group name from header */}
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
        }}
      />
      
      {/* Tabs group - hide the group name from header */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      
      {/* Auth group - hide the group name from header */}
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
      
      {/* Modal screens */}
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          headerTitle: 'Modal',
        }}
      />
      
      {/* Contact detail screen */}
      <Stack.Screen
        name="contact-detail"
        options={{
          headerTitle: 'Contact Details',
        }}
      />
      
      {/* Live activity preview */}
      <Stack.Screen
        name="live-activity-preview"
        options={{
          headerTitle: 'Live Activity Preview',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}