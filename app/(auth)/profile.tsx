import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { ChevronLeft, Camera, User } from 'lucide-react-native';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const { colors = darkTheme } = useThemeStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBack = () => {
    router.back();
  };
  
  const handlePickImage = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to select a profile picture');
      return;
    }
    
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };
  
  const handleContinue = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name to continue');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Update user profile
      updateUser({
        name,
        email: email || undefined,
        avatar: avatar || undefined,
      });
      
      // In a real app, we would save this to a backend
      
      // Navigate to permissions screen
      router.push('/permissions');
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };
  
  const handleSkip = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // If name is not provided, use a default
    if (!name.trim()) {
      updateUser({
        name: 'HitMe User',
      });
    }
    
    // Navigate to permissions screen
    router.push('/permissions');
  };
  
  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Complete Profile
        </Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.skipText, { color: colors.text.secondary }]}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Set up your profile
        </Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          Add your details so friends can recognize you
        </Text>
        
        {/* Profile Picture */}
        <TouchableOpacity 
          style={[styles.avatarContainer, { borderColor: colors.border }]}
          onPress={handlePickImage}
        >
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={styles.avatar}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.card }]}>
              <User size={40} color={colors.text.light} />
            </View>
          )}
          <View style={[styles.cameraButton, { backgroundColor: colors.primary }]}>
            <Camera size={16} color="#000" />
          </View>
        </TouchableOpacity>
        
        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>
            Name
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.card,
                color: colors.text.primary,
                borderColor: colors.border
              }
            ]}
            placeholder="Your name"
            placeholderTextColor={colors.text.light}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>
        
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>
            Email (Optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.card,
                color: colors.text.primary,
                borderColor: colors.border
              }
            ]}
            placeholder="Your email"
            placeholderTextColor={colors.text.light}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <TouchableOpacity
          style={[
            styles.button, 
            { backgroundColor: colors.primary },
            !name.trim() && styles.buttonDisabled
          ]}
          onPress={handleContinue}
          disabled={isLoading || !name.trim()}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Saving...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    padding: 8,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  avatarContainer: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 32,
    borderWidth: 2,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});