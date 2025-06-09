import { useEffect, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { darkTheme } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Always provide default colors to prevent undefined errors
  const colors = darkTheme;
  const hasCompletedOnboarding = useAppStore(state => state.hasCompletedOnboarding);
  const isFirstLaunch = useAppStore(state => state.isFirstLaunch);
  const user = useAppStore(state => state.user);
  const setIsFirstLaunch = useAppStore(state => state.setIsFirstLaunch);
  
  const segments = useSegments();
  const router = useRouter();
  const lastRouteRef = useRef<string>('');
  
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

    const currentPath = segments.join('/');
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inTabsGroup = segments[0] === '(tabs)';
    
    // Auth-related routes that should bypass onboarding redirect
    const isAuthRoute = 
      inAuthGroup || 
      segments[0] === 'verify' || 
      segments[0] === '' || // root/index (likely login)
      segments[0] === 'phone' || 
      segments[0] === 'login';

    // Prevent infinite redirects by checking if we're already at the target route
    const navigateIfDifferent = (targetPath: string) => {
      if (lastRouteRef.current !== targetPath && currentPath !== targetPath) {
        lastRouteRef.current = targetPath;
        router.replace(targetPath as any);
      }
    };

    // First-time users should start at welcome screen
    if (isFirstLaunch && segments[0] !== 'onboarding' && segments[0] !== 'welcome') {
      navigateIfDifferent('/onboarding/welcome');
      return;
    }
    
    // If user has verified but hasn't completed onboarding
    if (user && !hasCompletedOnboarding && !inOnboardingGroup && !isAuthRoute) {
      navigateIfDifferent('/onboarding/profile');
      return;
    }
    
    // If user has completed onboarding but is still in the onboarding flow
    if (hasCompletedOnboarding && (inOnboardingGroup || segments[0] === 'welcome')) {
      navigateIfDifferent('/(tabs)/home');
      return;
    }
    
    // If user is authenticated and has completed onboarding, ensure they're in the main app
    if (user && hasCompletedOnboarding && isAuthRoute) {
      navigateIfDifferent('/(tabs)/home');
      return;
    }
    
    // If user is not authenticated and not in auth flow, redirect to login
    if (!user && !isAuthRoute && segments[0] !== 'onboarding' && segments[0] !== 'welcome') {
      navigateIfDifferent('/');
      return;
    }
  }, [fontsLoaded, hasCompletedOnboarding, isFirstLaunch, segments, router, user]);

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
      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}