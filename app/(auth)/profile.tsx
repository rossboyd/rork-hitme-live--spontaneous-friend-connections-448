import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { darkTheme } from '@/constants/colors';
import * as Haptics from 'expo-haptics';

// Default avatars to choose from
const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=633&q=80',
];

export default function ProfileScreen() {
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();
  const { completeProfile } = useAuthStore();
  
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handlePickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
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
        setSelectedAvatar(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error picking image:', err);
    }
  };
  
  const handleContinue = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Complete profile
      completeProfile({
        name: name.trim(),
        avatar: selectedAvatar,
      });
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Navigate to permissions screen
      router.push('/(auth)/permissions');
    } catch (err) {
      console.error('Error completing profile:', err);
      setError('Failed to save profile. Please try again.');
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Complete your profile
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Add your name and a profile picture
          </Text>
          
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: selectedAvatar }}
              style={styles.avatar}
              contentFit="cover"
            />
            
            <TouchableOpacity
              style={[styles.cameraButton, { backgroundColor: colors.primary }]}
              onPress={handlePickImage}
            >
              <Camera size={20} color="#000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.avatarOptions}>
            {DEFAULT_AVATARS.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.avatarOption,
                  selectedAvatar === avatar && { borderColor: colors.primary, borderWidth: 2 }
                ]}
                onPress={() => setSelectedAvatar(avatar)}
              >
                <Image
                  source={{ uri: avatar }}
                  style={styles.avatarThumbnail}
                  contentFit="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              Your Name
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text.primary,
                }
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={colors.text.light}
              autoCapitalize="words"
            />
            
            {error ? (
              <Text style={[styles.errorText, { color: colors.accent }]}>
                {error}
              </Text>
            ) : null}
          </View>
          
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.primary },
              (!name.trim() || isLoading) && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
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
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
  avatarOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
  },
  avatarOption: {
    margin: 8,
    borderRadius: 25,
  },
  avatarThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});