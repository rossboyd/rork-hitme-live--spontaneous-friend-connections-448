import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { 
  PlusJakartaSans_400Regular, 
  PlusJakartaSans_500Medium, 
  PlusJakartaSans_600SemiBold, 
  PlusJakartaSans_700Bold 
} from '@expo-google-fonts/plus-jakarta-sans';
import { useThemeStore } from '@/store/useThemeStore';
import { ErrorBoundary } from '@/utils/errorBoundary';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colors } = useThemeStore();
  
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          headerTintColor: colors.text.primary,
          animation: 'fade',
        }}
      />
    </ErrorBoundary>
  );
}