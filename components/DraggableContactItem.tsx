import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Contact, Mode } from '@/types';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Avatar } from '@/components/common/Avatar';
import { Briefcase, Home, Heart, Crown, Meh, GripVertical } from 'lucide-react-native';

// Only import gesture handler on native platforms with proper error handling
let Animated: any = null;
let GestureDetector: any = null;
let Gesture: any = null;
let useSharedValue: any = null;
let useAnimatedStyle: any = null;
let runOnJS: any = null;
let withSpring: any = null;
let isGestureHandlerAvailable = false;

if (Platform.OS !== 'web') {
  try {
    const reanimated = require('react-native-reanimated');
    const gestureHandler = require('react-native-gesture-handler');
    
    Animated = reanimated.default;
    useSharedValue = reanimated.useSharedValue;
    useAnimatedStyle = reanimated.useAnimatedStyle;
    runOnJS = reanimated.runOnJS;
    withSpring = reanimated.withSpring;
    GestureDetector = gestureHandler.GestureDetector;
    Gesture = gestureHandler.Gesture;
    
    // Verify all required functions are available
    if (Animated && GestureDetector && Gesture && useSharedValue && useAnimatedStyle && runOnJS && withSpring) {
      isGestureHandlerAvailable = true;
    }
  } catch (error) {
    console.warn('Gesture handler or reanimated not available:', error);
    isGestureHandlerAvailable = false;
  }
}

interface DraggableContactItemProps {
  contact: Contact;
  onPress: (contact: Contact) => void;
  showLastOnline?: boolean;
  isInHitList?: boolean;
  onToggleHitList?: (contact: Contact) => void;
  showModes?: boolean;
  isDraggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (contactId: string, newIndex: number) => void;
  dragIndex?: number;
  itemHeight?: number;
  showGrabHandle?: boolean;
}

export const DraggableContactItem = ({
  contact,
  onPress,
  showLastOnline = false,
  isInHitList = false,
  onToggleHitList,
  showModes = false,
  isDraggable = false,
  onDragStart,
  onDragEnd,
  dragIndex = 0,
  itemHeight = 96,
  showGrabHandle = false
}: DraggableContactItemProps) => {
  const { colors = darkTheme } = useThemeStore();
  const contactModes = contact.modes || [];

  const renderModeIcon = (mode: Mode) => {
    switch (mode) {
      case 'FAM':
        return <Home size={14} color={colors.primary} />;
      case 'VIP':
        return <Crown size={14} color={colors.primary} />;
      case 'BFF':
        return <Heart size={14} color={colors.primary} />;
      case 'WRK':
        return <Briefcase size={14} color={colors.primary} />;
      case 'MEH':
        return <Meh size={14} color={colors.primary} />;
      default:
        return null;
    }
  };

  const getModeLabel = (mode: Mode) => {
    switch (mode) {
      case 'FAM':
        return 'Family';
      case 'VIP':
        return 'VIP';
      case 'BFF':
        return 'BFF';
      case 'WRK':
        return 'Work';
      case 'MEH':
        return 'Meh';
      default:
        return mode;
    }
  };

  const ContactContent = () => (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {showGrabHandle && (
        <View style={[styles.dragHandle, { opacity: showGrabHandle ? 1 : 0 }]}>
          <GripVertical size={20} color={colors.text.secondary} />
        </View>
      )}
      
      <Avatar
        name={contact.name}
        avatar={contact.avatar}
        size={56}
      />
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text.primary }]}>{contact.name}</Text>
        <Text style={[styles.phone, { color: colors.text.secondary }]}>{contact.phone}</Text>
        
        {showLastOnline && contact.lastOnline && (
          <Text style={[styles.lastOnline, { color: colors.text.light }]}>
            Last online {formatDistanceToNow(contact.lastOnline)}
          </Text>
        )}
        
        {showModes && contactModes.length > 0 && (
          <View style={styles.modesContainer}>
            {contactModes.map((mode) => (
              <View 
                key={mode} 
                style={[styles.modeTag, { backgroundColor: colors.background }]}
              >
                {renderModeIcon(mode)}
                <Text style={[styles.modeText, { color: colors.text.secondary }]}>
                  {getModeLabel(mode)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      {onToggleHitList && (
        <TouchableOpacity
          style={[
            styles.hitListButton,
            isInHitList ? 
              { backgroundColor: colors.primary, borderColor: colors.primary } : 
              { borderColor: colors.primary }
          ]}
          onPress={() => onToggleHitList(contact)}
        >
          <Text style={[
            styles.hitListButtonText,
            { color: isInHitList ? '#000' : colors.primary }
          ]}>
            {isInHitList ? 'In HitList' : 'Add'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Only use gesture handler if all conditions are met and it's available
  if (isDraggable && isGestureHandlerAvailable && onDragStart && onDragEnd && Platform.OS !== 'web') {
    try {
      const translateY = useSharedValue(0);
      const scale = useSharedValue(1);
      const zIndex = useSharedValue(0);
      const isDragging = useSharedValue(false);

      const panGesture = Gesture.Pan()
        .onStart(() => {
          'worklet';
          isDragging.value = true;
          runOnJS(onDragStart)();
          scale.value = withSpring(1.02);
          zIndex.value = 1000;
        })
        .onUpdate((event: any) => {
          'worklet';
          translateY.value = event.translationY;
        })
        .onEnd((event: any) => {
          'worklet';
          const newIndex = Math.round(dragIndex + event.translationY / itemHeight);
          const clampedIndex = Math.max(0, newIndex);
          
          runOnJS(onDragEnd)(contact.id, clampedIndex);
          
          translateY.value = withSpring(0);
          scale.value = withSpring(1);
          zIndex.value = 0;
          isDragging.value = false;
        });

      const animatedStyle = useAnimatedStyle(() => {
        'worklet';
        return {
          transform: [
            { translateY: translateY.value },
            { scale: scale.value }
          ],
          zIndex: zIndex.value,
          elevation: zIndex.value > 0 ? 5 : 0,
          opacity: isDragging.value ? 0.9 : 1,
        };
      });

      return (
        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedStyle}>
            <TouchableOpacity onPress={() => onPress(contact)} activeOpacity={0.7}>
              <ContactContent />
            </TouchableOpacity>
          </Animated.View>
        </GestureDetector>
      );
    } catch (error) {
      console.warn('Error creating draggable contact item:', error);
      // Fallback to regular contact item
    }
  }

  // Fallback to regular TouchableOpacity if gesture handler is not available or not needed
  return (
    <TouchableOpacity onPress={() => onPress(contact)} activeOpacity={0.7}>
      <ContactContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dragHandle: {
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    marginBottom: 4,
  },
  lastOnline: {
    fontSize: 12,
  },
  modesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 6,
  },
  modeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  modeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  hitListButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  hitListButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});