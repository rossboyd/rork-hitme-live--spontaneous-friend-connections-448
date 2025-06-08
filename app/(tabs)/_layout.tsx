import React from "react";
import { Tabs } from "expo-router";
import { Home, ListChecks, Users, User } from "lucide-react-native";
import { useThemeStore } from "@/store/useThemeStore";
import { darkTheme } from "@/constants/colors";

export default function TabLayout() {
  // Always provide default colors to prevent undefined errors
  const { colors = darkTheme } = useThemeStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.light,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text.primary,
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
          // Hide the header completely to remove the "(tabs)" text
          headerShown: false,
        }}
      />
    </Tabs>
  );
}