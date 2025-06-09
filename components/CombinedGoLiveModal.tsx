import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Mode } from '@/types';
import { ModeSelector } from './ModeSelector';
import { DurationSelector } from './DurationSelector';
import { X } from 'lucide-react-native';

interface CombinedGoLiveModalProps {
  visible: boolean;
  onClose: () => void;
  onGoLive: (minutes: number, modes: Mode[]) => void;
  initialDuration?: number;
}

export const CombinedGoLiveModal = ({ 
  visible, 
  onClose, 
  onGoLive,
  initialDuration = 30
}: CombinedGoLiveModalProps) => {
  const { colors = darkTheme } = useThemeStore();
  
  const [selectedDuration, setSelectedDuration] = useState(initialDuration);
  const [selectedModes, setSelectedModes] = useState<Mode[]>([]);
  
  useEffect(() => {
    if (visible) {
      setSelectedDuration(initialDuration);
      setSelectedModes([]);
    }
  }, [visible, initialDuration]);
  
  const handleConfirm = () => {
    if (selectedDuration < 1) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const modesToUse = selectedModes.length === 0 ? ['work', 'social', 'family'] : selectedModes;
    onGoLive(selectedDuration, modesToUse);
  };
  
  const handleToggleMode = (mode: Mode) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedModes(prev => {
      if (prev.includes(mode)) {
        return prev.filter(m => m !== mode);
      } else {
        return [...prev, mode];
      }
    });
  };
  
  const handleSelectAll = () => {
    setSelectedModes(['work', 'social', 'family']);
  };
  
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
          
          <DurationSelector
            onSelect={setSelectedDuration}
            initialDuration={initialDuration}
          />
          
          <ModeSelector
            selectedModes={selectedModes}
            onToggleMode={handleToggleMode}
            onSelectAll={handleSelectAll}
          />
          
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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