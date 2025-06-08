import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';

interface SlideToLiveToggleProps {
  waitingCount: number;
  onSlideComplete: () => void;
  userName?: string;
  onPreviewQueue?: () => void;
}

export const SlideToLiveToggle = ({
  waitingCount,
  onSlideComplete,
  userName,
  onPreviewQueue
}: SlideToLiveToggleProps) => {
  const { colors } = useThemeStore();

  return (
    <View style={styles.container}>
      {waitingCount > 0 && (
        <TouchableOpacity
          style={[styles.waitingButton, { backgroundColor: colors.primary }]}
          onPress={onPreviewQueue}
        >
          <Text style={[styles.waitingText, { color: '#000' }]}>
            {waitingCount} {waitingCount === 1 ? 'person is' : 'people are'} waiting
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.slideButton, { backgroundColor: colors.primary }]}
        onPress={onSlideComplete}
      >
        <Text style={[styles.slideText, { color: '#000' }]}>
          {userName ? `Hey ${userName}, tap to go live` : 'Tap to go live'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  waitingButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  waitingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slideButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  slideText: {
    fontSize: 18,
    fontWeight: '600',
  },
});