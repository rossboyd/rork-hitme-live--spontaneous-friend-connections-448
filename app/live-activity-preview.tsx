import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LiveActivitySimulator } from '@/components/LiveActivitySimulator';
import { useAppStore } from '@/store/useAppStore';

export default function LiveActivityPreviewScreen() {
  const router = useRouter();
  const { user, contacts, hitMeEndTime } = useAppStore();
  
  // Calculate time remaining
  const timeRemaining = hitMeEndTime ? hitMeEndTime - Date.now() : 30 * 60 * 1000;
  
  // Count online contacts (those with lastOnline within last hour)
  const onlineCount = contacts.filter(c => 
    c.lastOnline && Date.now() - c.lastOnline < 60 * 60 * 1000
  ).length;

  return (
    <TouchableOpacity 
      style={styles.container}
      activeOpacity={1}
      onPress={() => router.push('/(tabs)/home')}
    >
      <LiveActivitySimulator
        timeRemaining={timeRemaining}
        onlineCount={onlineCount}
        userAvatar={user?.avatar || ''}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});