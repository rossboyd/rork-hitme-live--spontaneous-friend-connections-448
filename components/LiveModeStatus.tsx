import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { X } from 'lucide-react-native';

interface LiveModeStatusProps {
  timeRemaining: number;
  onGoOffline: () => void;
}

export const LiveModeStatus = ({ timeRemaining, onGoOffline }: LiveModeStatusProps) => {
  const { colors } = useThemeStore();
  
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Text style={styles.label}>You're Live</Text>
      <Text style={styles.timeText}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </Text>
      
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={onGoOffline}
      >
        <X size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    position: 'relative',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  timeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
});