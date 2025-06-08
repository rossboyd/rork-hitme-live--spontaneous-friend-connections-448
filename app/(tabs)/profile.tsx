import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { themes } from '@/constants/colors';

export default function ProfileScreen() {
  const { colors, color, setColor } = useThemeStore();
  
  const renderThemeSelector = () => (
    <View style={styles.themeSelector}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Theme</Text>
      
      <View style={styles.themeOptions}>
        <TouchableOpacity 
          style={[
            styles.themeOption,
            { borderColor: colors.border },
            color === 'green' && { borderColor: themes.green.light.primary }
          ]}
          onPress={() => setColor('green')}
        >
          <View style={[styles.themeColor, { backgroundColor: themes.green.light.primary }]} />
          <Text style={[styles.themeText, { color: colors.text.primary }]}>Green</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.themeOption,
            { borderColor: colors.border },
            color === 'pink' && { borderColor: themes.pink.light.primary }
          ]}
          onPress={() => setColor('pink')}
        >
          <View style={[styles.themeColor, { backgroundColor: themes.pink.light.primary }]} />
          <Text style={[styles.themeText, { color: colors.text.primary }]}>Pink</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      {/* ... existing profile section ... */}
      
      <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
        {/* ... existing settings ... */}
        {renderThemeSelector()}
      </View>
      
      {/* ... rest of the component ... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  themeSelector: {
    marginTop: 24,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  themeOption: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    width: '45%',
  },
  themeColor: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
});