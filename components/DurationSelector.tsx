import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
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
const ITEM_HEIGHT = 36;
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
  
  const handleScroll = (
    event: any, 
    type: 'hour' | 'minute',
    setter: (value: number) => void,
    currentValue: number
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    
    if (index !== currentValue) {
      setter(index);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };
  
  const handleScrollEnd = (event: any, scrollRef: React.RefObject<ScrollView>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    
    scrollRef.current?.scrollTo({ 
      y: index * ITEM_HEIGHT, 
      animated: true 
    });
  };
  
  const hours = Array.from({ length: MAX_HOURS + 1 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  
  const paddingVertical = (VISIBLE_ITEMS - 1) / 2 * ITEM_HEIGHT;
  
  const renderPickerItem = (value: number, selectedValue: number, type: 'hour' | 'minute') => {
    const formattedValue = type === 'minute' && value < 10 ? `0${value}` : value.toString();
    const distance = Math.abs(value - selectedValue);
    const opacity = distance === 0 ? 1 : distance === 1 ? 0.4 : 0.15;
    const isSelected = distance === 0;
    
    return (
      <View key={`${type}-${value}`} style={styles.pickerItem}>
        <Text 
          style={[
            styles.pickerText,
            { 
              color: isSelected ? colors.primary : colors.text.primary, 
              opacity,
              fontWeight: isSelected ? '600' : '400',
              fontSize: isSelected ? 22 : 18
            }
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
            onScroll={(e) => handleScroll(e, 'hour', setSelectedHours, selectedHours)}
            onMomentumScrollEnd={(e) => handleScrollEnd(e, hoursScrollRef)}
            scrollEventThrottle={16}
          >
            {hours.map((hour) => renderPickerItem(hour, selectedHours, 'hour'))}
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
            onScroll={(e) => handleScroll(e, 'minute', setSelectedMinutes, selectedMinutes)}
            onMomentumScrollEnd={(e) => handleScrollEnd(e, minutesScrollRef)}
            scrollEventThrottle={16}
          >
            {minutes.map((minute) => renderPickerItem(minute, selectedMinutes, 'minute'))}
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