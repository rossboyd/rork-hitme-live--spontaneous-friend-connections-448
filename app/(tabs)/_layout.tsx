import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, ListChecks, Users, User } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SPRING_CONFIG } from '@/utils/animations';

export default function TabLayout() {
  const { colors } = useThemeStore();

  const tabBarStyle = useAnimatedStyle(() => ({
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: 1,
  }));

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.light,
        tabBarStyle: Platform.select({
          web: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
          default: tabBarStyle,
        }),
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text.primary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          fontFamily: 'PlusJakartaSans-SemiBold',
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="hitlist"
        options={{
          title: 'HitList',
          tabBarIcon: ({ color }) => <ListChecks size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}