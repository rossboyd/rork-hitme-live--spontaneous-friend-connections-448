import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Bell, Users, ChevronLeft } from 'lucide-react-native';

// Only import these on native platforms
let Contacts: any = null;
let Notifications: any = null;

if (Platform.OS !== 'web') {
  import('expo-contacts').then(module => {
    Contacts = module;
  });
  
  import('expo-notifications').then(module => {
    Notifications = module;
  });
}

export default function PermissionsScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuthStore();
  const { colors = darkTheme } = useThemeStore();
  
  const [contactsPermission, setContactsPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [notificationsPermission, setNotificationsPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBack = () => {
    router.back();
  };
  
  const requestContactsPermission = async () => {
    if (Platform.OS === 'web') {
      // Web doesn't support contacts
      setContactsPermission('granted');
      return;
    }
    
    if (!Contacts) return;
    
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setContactsPermission(status);
      
      if (status === 'granted') {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
      setContactsPermission('denied');
    }
  };
  
  const requestNotificationsPermission = async () => {
    if (Platform.OS === 'web') {
      // Web doesn't support notifications in the same way
      setNotificationsPermission('granted');
      return;
    }
    
    if (!Notifications) return;
    
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotificationsPermission(status);
      
      if (status === 'granted') {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error('Error requesting notifications permission:', error);
      setNotificationsPermission('denied');
    }
  };
  
  const handleContinue = async () => {
    setIsLoading(true);
    
    try {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Complete onboarding
      completeOnboarding();
      
      // Navigate to main app
      router.replace('/(onboarding)');
    } catch (error) {
      console.error('Error completing setup:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to complete setup. Please try again.');
    }
  };
  
  const handleSkip = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Complete onboarding without permissions
    completeOnboarding();
    
    // Navigate to main app
    router.replace('/(onboarding)');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Permissions
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
          Enable permissions
        </Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          HitMe needs a few permissions to work properly. You can change these anytime in settings.
        </Text>
        
        {/* Contacts Permission */}
        <TouchableOpacity 
          style={[styles.permissionCard, { backgroundColor: colors.card }]}
          onPress={requestContactsPermission}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Users size={24} color={colors.primary} />
          </View>
          <View style={styles.permissionInfo}>
            <Text style={[styles.permissionTitle, { color: colors.text.primary }]}>
              Contacts
            </Text>
            <Text style={[styles.permissionDescription, { color: colors.text.secondary }]}>
              Find friends who are already using HitMe
            </Text>
          </View>
          <View 
            style={[
              styles.permissionStatus, 
              { 
                backgroundColor: 
                  contactsPermission === 'granted' 
                    ? colors.status.success + '20' 
                    : colors.card
              }
            ]}
          >
            <Text 
              style={[
                styles.permissionStatusText, 
                { 
                  color: 
                    contactsPermission === 'granted' 
                      ? colors.status.success 
                      : colors.text.secondary
                }
              ]}
            >
              {contactsPermission === 'granted' 
                ? 'Granted' 
                : contactsPermission === 'denied' 
                  ? 'Denied' 
                  : 'Enable'}
            </Text>
          </View>
        </TouchableOpacity>
        
        {/* Notifications Permission */}
        <TouchableOpacity 
          style={[styles.permissionCard, { backgroundColor: colors.card }]}
          onPress={requestNotificationsPermission}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Bell size={24} color={colors.primary} />
          </View>
          <View style={styles.permissionInfo}>
            <Text style={[styles.permissionTitle, { color: colors.text.primary }]}>
              Notifications
            </Text>
            <Text style={[styles.permissionDescription, { color: colors.text.secondary }]}>
              Get notified when friends are available
            </Text>
          </View>
          <View 
            style={[
              styles.permissionStatus, 
              { 
                backgroundColor: 
                  notificationsPermission === 'granted' 
                    ? colors.status.success + '20' 
                    : colors.card
              }
            ]}
          >
            <Text 
              style={[
                styles.permissionStatusText, 
                { 
                  color: 
                    notificationsPermission === 'granted' 
                      ? colors.status.success 
                      : colors.text.secondary
                }
              ]}
            >
              {notificationsPermission === 'granted' 
                ? 'Granted' 
                : notificationsPermission === 'denied' 
                  ? 'Denied' 
                  : 'Enable'}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.button, 
            { backgroundColor: colors.primary }
          ]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Finishing Setup...' : 'Continue'}
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.noteText, { color: colors.text.light }]}>
          You can always change these permissions later in your device settings
        </Text>
      </ScrollView>
    </View>
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
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  permissionDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  permissionStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  permissionStatusText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  noteText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});