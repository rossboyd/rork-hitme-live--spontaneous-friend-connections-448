import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { LiveActivitySimulator } from '@/components/LiveActivitySimulator';
import { useAppStore } from '@/store/useAppStore';
import { Image } from 'expo-image';

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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* iOS Lock Screen Simulation */}
      <View style={styles.lockScreen}>
        {/* Time */}
        <Text style={styles.lockScreenTime}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        
        {/* Date */}
        <Text style={styles.lockScreenDate}>
          {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
        
        {/* Notifications */}
        <View style={styles.notificationsArea}>
          <LiveActivitySimulator
            timeRemaining={timeRemaining}
            onlineCount={onlineCount}
            userAvatar={user?.avatar || ''}
          />
        </View>
        
        {/* Bottom indicators */}
        <View style={styles.bottomIndicators}>
          <View style={styles.flashlightIcon}>
            <View style={styles.flashlightCircle} />
          </View>
          
          <View style={styles.homeIndicator} />
          
          <View style={styles.cameraIcon}>
            <View style={styles.cameraCircle} />
          </View>
        </View>
      </View>
      
      {/* Tap anywhere to return overlay */}
      <TouchableOpacity 
        style={styles.tapOverlay}
        activeOpacity={1}
        onPress={() => router.push('/(tabs)/home')}
      >
        <Text style={styles.tapText}>Tap anywhere to return to app</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  lockScreen: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
  lockScreenTime: {
    fontSize: 72,
    fontWeight: '200',
    color: '#fff',
    marginBottom: 8,
  },
  lockScreenDate: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 40,
  },
  notificationsArea: {
    width: '100%',
    paddingHorizontal: 16,
    flex: 1,
  },
  bottomIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  flashlightIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashlightCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  homeIndicator: {
    width: 140,
    height: 5,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  cameraIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  tapOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tapText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
});