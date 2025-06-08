import React, { useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  Dimensions
} from 'react-native';
import { Eye } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  useSharedValue,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const BUTTON_WIDTH = 64;
const SLIDER_WIDTH = Dimensions.get('window').width - 48; // 24px padding on each side
const SLIDER_HEIGHT = 80;

interface SlideToLiveToggleProps {
  waitingCount: number;
  onSlideComplete: () => void;
  userName?: string;
  onPreviewQueue?: () => void;
}

export const SlideToLiveToggle = ({ 
  waitingCount, 
  onSlideComplete,
  userName = "there",
  onPreviewQueue
}: SlideToLiveToggleProps) => {
  const { colors = darkTheme } = useThemeStore();
  const translateX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const handleComplete = useCallback(() => {
    onSlideComplete();
    translateX.value = withSpring(0);
  }, [onSlideComplete]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      isDragging.value = true;
    },
    onActive: (event) => {
      const newValue = Math.max(0, Math.min(event.translationX, SLIDER_WIDTH - BUTTON_WIDTH));
      translateX.value = newValue;
    },
    onEnd: () => {
      isDragging.value = false;
      if (translateX.value > SLIDER_WIDTH * 0.8) {
        runOnJS(handleComplete)();
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: translateX.value + BUTTON_WIDTH,
  }));

  return (
    <View style={styles.container}>
      {waitingCount > 0 && (
        <TouchableOpacity 
          style={[styles.previewButton, { backgroundColor: colors.card }]}
          onPress={onPreviewQueue}
        >
          <Eye size={20} color={colors.text.primary} />
          <Text style={[styles.previewText, { color: colors.text.primary }]}>
            Preview Queue ({waitingCount})
          </Text>
        </TouchableOpacity>
      )}
      
      <View style={[styles.slider, { backgroundColor: colors.card }]}>
        <Animated.View 
          style={[
            styles.progress, 
            { backgroundColor: colors.primary },
            progressStyle
          ]} 
        />
        
        <Text style={[styles.sliderText, { color: colors.text.primary }]}>
          Hey {userName}, slide to go live
        </Text>
        
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View 
            style={[
              styles.thumb,
              { backgroundColor: '#E2E8F0' }, // Light grey color as requested
              animatedStyle
            ]}
          />
        </PanGestureHandler>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  previewText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  slider: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    borderRadius: SLIDER_HEIGHT / 2,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  progress: {
    ...StyleSheet.absoluteFillObject,
    width: BUTTON_WIDTH,
  },
  sliderText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  thumb: {
    position: 'absolute',
    left: 8,
    width: BUTTON_WIDTH - 16,
    height: SLIDER_HEIGHT - 16,
    borderRadius: (SLIDER_HEIGHT - 16) / 2,
    margin: 8,
  },
});