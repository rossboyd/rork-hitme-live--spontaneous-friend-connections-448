import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { ChevronDown } from 'lucide-react-native';
import { validatePhone } from '@/utils/validation';
import * as Haptics from 'expo-haptics';
import { darkTheme } from '@/constants/colors';
import { AnimatedView } from '@/components/AnimatedView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LoginScreen() {
  // Existing state and handlers remain the same

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: darkTheme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AnimatedView style={styles.container}>
            {/* Rest of the component content remains the same */}
          </AnimatedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Previous styles remain
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 60,
    paddingBottom: 20,
    width: SCREEN_WIDTH, // Added fixed width
    alignSelf: 'center', // Center content
  },
  // Rest of the styles remain the same
});