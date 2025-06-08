import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NotificationSimulator } from '@/components/NotificationSimulator';
import { useAppStore } from '@/store/useAppStore';
import { useThemeStore } from '@/store/useThemeStore';

export default function NotificationTestScreen() {
  const { outboundRequests, contacts } = useAppStore();
  const { colors } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NotificationSimulator
        outboundRequests={outboundRequests}
        contacts={contacts}
        onSimulateConnection={(requestId) => {
          // Handle connection simulation
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});