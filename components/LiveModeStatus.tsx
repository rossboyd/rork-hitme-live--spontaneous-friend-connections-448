import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Filter } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Mode } from '@/types';

interface LiveModeStatusProps {
  timeRemaining: number;
  onGoOffline: () => void;
  currentMode: Mode | null;
}

export const LiveModeStatus = ({ 
  timeRemaining, 
  onGoOffline,
  currentMode
}: LiveModeStatusProps) => {
  const { colors = darkTheme } = useThemeStore();
  
  const formatTimeRemaining = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getModeLabel = () => {
    switch (currentMode) {
      case 'work':
        return 'Work Mode';
      case 'family':
        return 'Family Mode';
      case 'social':
        return 'Social Mode';
      default:
        return null;
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <View style={styles.statusRow}>
          <View style={[styles.statusIndicator, { backgroundColor: '#4ADE80' }]} />
          <Text style={[styles.statusText, { color: colors.text.primary }]}>
            You're Live
          </Text>
          
          <View style={styles.timeContainer}>
            <Clock size={16} color={colors.text.secondary} />
            <Text style={[styles.timeText, { color: colors.text.secondary }]}>
              {formatTimeRemaining(timeRemaining)}
            </Text>
          </View>
        </View>
        
        {currentMode && (
          <View style={[styles.modeIndicator, { backgroundColor: colors.background }]}>
            <Filter size={14} color={colors.primary} />
            <Text style={[styles.modeText, { color: colors.text.primary }]}>
              {getModeLabel()}
            </Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={[styles.offlineButton, { backgroundColor: colors.accent }]}
        onPress={onGoOffline}
      >
        <Text style={styles.offlineButtonText}>Go Offline</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  content: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  timeText: {
    fontSize: 14,
    marginLeft: 4,
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  modeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  offlineButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  offlineButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
});