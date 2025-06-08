import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
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
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1695048133142-1a20484d8a3c?q=80&w=2070&auto=format&fit=crop' }}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity 
        style={styles.touchable}
        activeOpacity={1}
        onPress={() => router.back()}
      >
        <View style={styles.widgetContainer}>
          <LiveActivitySimulator
            timeRemaining={timeRemaining}
            onlineCount={onlineCount}
            userAvatar={user?.avatar || ''}
          />
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  touchable: {
    flex: 1,
  },
  widgetContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
});