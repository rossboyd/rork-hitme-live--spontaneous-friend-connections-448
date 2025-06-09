import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Platform,
  ScrollView
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Mode } from '@/types';
import { ModeSelector } from './ModeSelector';
import { X } from 'lucide-react-native';

interface CombinedGoLiveModalProps {
  visible: boolean;
  onClose: () => void;
  onGoLive: (minutes: number, modes: (Mode | null)[]) => void;
  initialDuration?: number; // in minutes
}

const MAX_HOURS = 12;
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

export const CombinedGoLiveModal = ({ 
  visible, 
  onClose, 
  onGoLive,
  initialDuration = 30 // Default to 30 minutes
}: CombinedGoLiveModalProps) => {
  const { colors = darkTheme } = useThemeStore();
  
  // Calculate initial hours and minutes
  const initialHours = Math.floor(initialDuration / 60);
  const initialMinutes = initialDuration % 60;
  
  const [selectedHours, setSelectedHours] = useState(initialHours);
  const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);
  const [selectedModes, setSelectedModes] = useState<(Mode | null)[]>([null]); // Default to "All"
  
  const hoursScrollRef = useRef<ScrollView>(null);
  const minutesScrollRef = useRef<ScrollView>(null);
  
  // Reset to initial values when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedHours(initialHours);
      setSelectedMinutes(initialMinutes);
      setSelectedModes([null]); // Reset to "All" when opening
      
      // Scroll to initial positions with a slight delay to ensure refs are ready
      setTimeout(() => {
        hoursScrollRef.current?.scrollTo({ 
          y: initialHours * ITEM_HEIGHT, 
          animated: false 
        });
        minutesScrollRef.current?.scrollTo({ 
          y: initialMinutes * ITEM_HEIGHT, 
          animated: false 
        });
      }, 50);
    }
  }, [visible, initialHours, initialMinutes]);
  
  const handleConfirm = () => {
    const totalMinutes = (selectedHours * 60) + selectedMinutes;
    
    // Ensure at least 1 minute is selected
    if (totalMinutes < 1) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }
    
    // Ensure at least one mode is selected
    if (selectedModes.length === 0) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    onGoLive(totalMinutes, selectedModes);
  };
  
  const handleHoursScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    
    if (index !== selectedHours) {
      setSelectedHours(index);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };
  
  const handleMinutesScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    
    if (index !== selectedMinutes) {
      setSelectedMinutes(index);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };
  
  const handleHoursScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    
    hoursScrollRef.current?.scrollTo({ 
      y: index * ITEM_HEIGHT, 
      animated: true 
    });
  };
  
  const handleMinutesScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    
    minutesScrollRef.current?.scrollTo({ 
      y: index * ITEM_HEIGHT, 
      animated: true 
    });
  };
  
  const handleToggleMode = (mode: Mode | null) => {
    setSelectedModes(prev => {
      // If selecting "All", clear other selections
      if (mode === null) {
        return [null];
      }
      
      // If a specific mode is selected, remove "All"
      let newModes = prev.filter(m => m !== null);
      
      // Toggle the selected mode
      if (newModes.includes(mode)) {
        newModes = newModes.filter(m => m !== mode);
      } else {
        newModes.push(mode);
      }
      
      // If no modes selected, default to "All"
      if (newModes.length === 0) {
        return [null];
      }
      
      return newModes;
    });
  };
  
  const handleSelectAll = () => {
    setSelectedModes(['work', 'social', 'family']);
  };
  
  const handleClearAll = () => {
    setSelectedModes([null]);
  };
  
  // Generate arrays for hours and minutes
  const hours = Array.from({ length: MAX_HOURS + 1 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  
  // Calculate padding to center the selected item
  const paddingVertical = (VISIBLE_ITEMS - 1) / 2 * ITEM_HEIGHT;
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Go Live Settings
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          {/* Duration Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              How long will you be available?
            </Text>
            
            <View style={styles.pickerContainer}>
              {/* Selection indicator overlay */}
              <View style={[styles.selectionIndicator, { borderColor: colors.primary }]} />
              
              {/* Hours picker */}
              <View style={styles.pickerColumn}>
                <ScrollView
                  ref={hoursScrollRef}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingVertical }}
                  onScroll={handleHoursScroll}
                  onMomentumScrollEnd={handleHoursScrollEnd}
                  scrollEventThrottle={16}
                >
                  {hours.map((hour) => (
                    <View key={`hour-${hour}`} style={styles.pickerItem}>
                      <Text style={[
                        styles.pickerText,
                        { color: colors.text.primary },
                        selectedHours === hour && { color: colors.primary, fontWeight: '600' }
                      ]}>
                        {hour}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
                <Text style={[styles.pickerLabel, { color: colors.text.secondary }]}>
                  hours
                </Text>
              </View>
              
              {/* Minutes picker */}
              <View style={styles.pickerColumn}>
                <ScrollView
                  ref={minutesScrollRef}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingVertical }}
                  onScroll={handleMinutesScroll}
                  onMomentumScrollEnd={handleMinutesScrollEnd}
                  scrollEventThrottle={16}
                >
                  {minutes.map((minute) => (
                    <View key={`minute-${minute}`} style={styles.pickerItem}>
                      <Text style={[
                        styles.pickerText,
                        { color: colors.text.primary },
                        selectedMinutes === minute && { color: colors.primary, fontWeight: '600' }
                      ]}>
                        {minute < 10 ? `0${minute}` : minute}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
                <Text style={[styles.pickerLabel, { color: colors.text.secondary }]}>
                  minutes
                </Text>
              </View>
            </View>
            
            <Text style={[styles.durationSummary, { color: colors.text.secondary }]}>
              {selectedHours > 0 && `${selectedHours} ${selectedHours === 1 ? 'hour' : 'hours'}`}
              {selectedHours > 0 && selectedMinutes > 0 && ' and '}
              {selectedMinutes > 0 && `${selectedMinutes} ${selectedMinutes === 1 ? 'minute' : 'minutes'}`}
              {selectedHours === 0 && selectedMinutes === 0 && 'Select a duration'}
            </Text>
          </View>
          
          {/* Mode Section */}
          <View style={styles.section}>
            <ModeSelector
              selectedModes={selectedModes}
              onToggleMode={handleToggleMode}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
            />
          </View>
          
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: colors.text.secondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, { backgroundColor: colors.primary }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                Go Live
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    marginBottom: 8,
    position: 'relative',
  },
  selectionIndicator: {
    position: 'absolute',
    height: ITEM_HEIGHT,
    left: 0,
    right: 0,
    top: '50%',
    marginTop: -ITEM_HEIGHT / 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    zIndex: 1,
  },
  pickerColumn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 22,
    fontWeight: '400',
  },
  pickerLabel: {
    fontSize: 14,
    marginTop: 8,
  },
  durationSummary: {
    textAlign: 'center',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});