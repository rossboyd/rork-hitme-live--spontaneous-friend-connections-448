import React from "react";
import { Tabs } from "expo-router";
import { Home, ListChecks, Users, User } from "lucide-react-native";
import { useThemeStore } from "@/store/useThemeStore";

export default function TabLayout() {
  const { colors } = useThemeStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.light,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text.primary,
          fontFamily: 'PlusJakartaSans-SemiBold',
        },
        headerShadowVisible: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'PlusJakartaSans-Medium',
        },
      }}
      initialRouteName="home"
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "HitList",
          tabBarLabel: "HitList",
          tabBarIcon: ({ color, size }) => (
            <ListChecks size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: "Contacts",
          tabBarLabel: "Contacts",
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}