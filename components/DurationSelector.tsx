import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated,
  ScrollView,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

interface DurationSelectorProps {
  onSelect: (minutes: number) => void;
  initialDuration?: number;
}

const MAX_HOURS = 12;
const ITEM_HEIGHT = 32;
const VISIBLE_ITEMS = 3;

export const DurationSelector = ({ 
  onSelect,
  initialDuration = 30
}: DurationSelectorProps) => {
  const { colors = darkTheme } = useThemeStore();
  
  const initialHours = Math.floor(initialDuration / 60);
  const initialMinutes = initialDuration % 60;
  
  const [selectedHours, setSelectedHours] = useState(initialHours);
  const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);
  
  const hoursScrollRef = useRef<ScrollView>(null);
  const minutesScrollRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    const totalMinutes = (selectedHours * 60) + selectedMinutes;
    onSelect(totalMinutes);
  }, [selectedHours, selectedMinutes, onSelect]);
  
  useEffect(() => {
    setSelectedHours(initialHours);
    setSelectedMinutes(initialMinutes);
    
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
  }, [initialHours, initialMinutes]);
  
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
  
  const hours = Array.from({ length: MAX_HOURS + 1 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  
  const paddingVertical = (VISIBLE_ITEMS - 1) / 2 * ITEM_HEIGHT;
  
  const renderPickerItem = (value: number, isSelected: boolean, type: 'hour' | 'minute', index: number, selectedIndex: number) => {
    const formattedValue = type === 'minute' && value < 10 ? `0${value}` : value.toString();
    const distance = Math.abs(index - selectedIndex);
    const opacity = distance === 0 ? 1 : distance === 1 ? 0.4 : 0.15;
    const fontSize = distance === 0 ? 20 : 16;
    
    return (
      <View key={`${type}-${value}`} style={styles.pickerItem}>
        <Text 
          style={[
            styles.pickerText,
            { 
              color: colors.text.primary,
              opacity,
              fontSize,
              fontWeight: distance === 0 ? '600' : '400'
            },
            isSelected && { color: colors.primary }
          ]}
        >
          {formattedValue}
        </Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        How long will you be available?
      </Text>
      
      <View style={styles.pickerContainer}>
        <View style={[styles.selectionIndicator, { borderColor: colors.primary }]} />
        
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
            {hours.map((hour, index) => renderPickerItem(hour, selectedHours === hour, 'hour', index, selectedHours))}
          </ScrollView>
          <Text style={[styles.pickerLabel, { color: colors.text.secondary }]}>
            hours
          </Text>
        </View>
        
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
            {minutes.map((minute, index) => renderPickerItem(minute, selectedMinutes === minute, 'minute', index, selectedMinutes))}
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
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
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
    fontWeight: '400',
  },
  pickerLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  durationSummary: {
    textAlign: 'center',
    fontSize: 14,
  },
});