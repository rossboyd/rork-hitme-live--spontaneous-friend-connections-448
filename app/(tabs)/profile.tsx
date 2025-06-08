// Update Profile screen
import React, { useState } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  // ... rest of imports
} from 'react-native';

export default function ProfileScreen() {
  // ... existing code ...

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageHeading, { color: colors.text.primary }]}>
        Profile
      </Text>

      <View style={styles.profileSection}>
        {/* ... existing profile section ... */}
      </View>

      {/* ... rest of existing code ... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageHeading: {
    fontSize: 32,
    fontWeight: '700',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  // ... rest of existing styles ...
});