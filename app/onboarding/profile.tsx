import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { Avatar } from '@/components/common/Avatar';
import { Camera, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

// Default avatars to choose from
const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=633&q=80',
];

export default function OnboardingProfileScreen() {
  const router = useRouter();
  const { user, setUser, loadMockData } = useAppStore();
  const { setHasCompletedOnboarding } = useOnboardingStore();
  const { colors = darkTheme } = useThemeStore();
  
  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || DEFAULT_AVATARS[0]);
  
  const handleContinue = () => {
    if (!name.trim()) {
      Alert.alert('Please enter your name');
      return;
    }
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Update user profile
    if (user) {
      setUser({
        ...user,
        name: name.trim(),
        avatar: selectedAvatar,
      });
    }
    
    // Load mock data before completing onboarding
    loadMockData();
    
    // Mark onboarding as completed
    setHasCompletedOnboarding(true);
    
    // Navigate to the main app
    router.replace('/(tabs)/home');
  };
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Set up your profile
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Choose how you'll appear to others
          </Text>
        </View>
        
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Avatar 
              name={name || 'You'} 
              avatar={selectedAvatar} 
              size={120}
              borderWidth={4}
              borderColor={colors.background}
            />
            <TouchableOpacity 
              style={[styles.cameraButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                // In a real app, this would open the image picker
                Alert.alert('Choose Avatar', 'Select from the options below');
              }}
            >
              <Camera size={20} color="#000" />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.label, { color: colors.text.primary }]}>Choose Avatar</Text>
          <View style={styles.avatarGrid}>
            {DEFAULT_AVATARS.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.avatarOption,
                  selectedAvatar === avatar && [styles.selectedAvatarOption, { borderColor: colors.primary }]
                ]}
                onPress={() => setSelectedAvatar(avatar)}
              >
                <Avatar
                  name={name || 'You'}
                  avatar={avatar}
                  size={50}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text.primary }]}>Your Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text.primary }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={colors.text.light}
            autoFocus
          />
        </View>
        
        <TouchableOpacity
          style={[
            styles.continueButton, 
            { 
              backgroundColor: name.trim() ? colors.primary : colors.border,
              opacity: name.trim() ? 1 : 0.6
            }
          ]}
          onPress={handleContinue}
          disabled={!name.trim()}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <ChevronRight size={20} color="#000" />
        </TouchableOpacity>
        
        <Text style={[styles.skipText, { color: colors.text.light }]}>
          You can always change these later
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
  },
  avatarOption: {
    margin: 8,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatarOption: {
    borderWidth: 2,
  },
  formGroup: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  continueButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  skipText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
  },
});