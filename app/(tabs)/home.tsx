// Update Home screen
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  // ... rest of imports
} from 'react-native';

export default function HomeScreen() {
  // ... existing code ...

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageHeading, { color: colors.text.primary }]}>
        HitMeApp
      </Text>

      {isHitMeModeActive ? (
        // ... rest of existing code ...
      ) : (
        <View style={styles.fixedContainer}>
          <SlideToLiveToggle 
            waitingCount={pendingRequests.length}
            onSlideComplete={handleSlideComplete}
            userName={user?.name.split(' ')[0]}
            onPreviewQueue={handlePreviewQueue}
          />
        </View>
      )}

      {/* ... rest of existing code ... */}
    </View>
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