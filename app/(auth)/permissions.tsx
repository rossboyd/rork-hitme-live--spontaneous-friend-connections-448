import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Users, Check } from 'lucide-react-native';
import * as Contacts from 'expo-contacts';
import * as Notifications from 'expo-notifications';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { darkTheme } from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function PermissionsScreen() {
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();
  const { completeOnboarding } = useAuthStore();
  
  const [contactsPermission, setContactsPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [notificationsPermission, setNotificationsPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [isLoading, setIsLoading] = useState(false);
  
  // Check existing permissions on mount
  useEffect(() => {
    checkExistingPermissions();
  }, []);
  
  const checkExistingPermissions = async () => {
    // Check contacts permission
    if (Platform.OS !== 'web') {
      const { status: contactsStatus } = await Contacts.getPermissionsAsync();
      setContactsPermission(contactsStatus === 'granted' ? 'granted' : 'denied');
      
      // Check notifications permission
      const { status: notificationStatus } = await Notifications.getPermissionsAsync();
      setNotificationsPermission(notificationStatus === 'granted' ? 'granted' : 'denied');
    } else {
      // Web doesn't support these permissions
      setContactsPermission('denied');
      setNotificationsPermission('denied');
    }
  };
  
  const requestContactsPermission = async () => {
    if (Platform.OS === 'web') {
      alert('Contacts permission is not available on web');
      return;
    }
    
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setContactsPermission(status === 'granted' ? 'granted' : 'denied');
      
      if (status === 'granted' && Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      console.error('Error requesting contacts permission:', err);
    }
  };
  
  const requestNotificationsPermission = async () => {
    if (Platform.OS === 'web') {
      alert('Notifications permission is not available on web');
      return;
    }
    
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotificationsPermission(status === 'granted' ? 'granted' : 'denied');
      
      if (status === 'granted' && Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      console.error('Error requesting notifications permission:', err);
    }
  };
  
  const handleContinue = async () => {
    setIsLoading(true);
    
    try {
      // Complete onboarding
      completeOnboarding();
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Error completing onboarding:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderPermissionItem = (
    title: string,
    description: string,
    status: 'granted' | 'denied' | 'pending',
    icon: React.ReactNode,
    onRequest: () => void
  ) => (
    <View style={[styles.permissionItem, { backgroundColor: colors.card }]}>
      <View style={styles.permissionContent}>
        <View style={styles.permissionIcon}>
          {icon}
        </View>
        <View style={styles.permissionText}>
          <Text style={[styles.permissionTitle, { color: colors.text.primary }]}>
            {title}
          </Text>
          <Text style={[styles.permissionDescription, { color: colors.text.secondary }]}>
            {description}
          </Text>
        </View>
      </View>
      
      {status === 'granted' ? (
        <View style={[styles.grantedBadge, { backgroundColor: colors.primary }]}>
          <Check size={16} color="#000" />
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: colors.primary }]}
          onPress={onRequest}
        >
          <Text style={styles.permissionButtonText}>Allow</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Choose your permissions
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            You can change these any time in settings
          </Text>
          
          <View style={styles.permissionsContainer}>
            {renderPermissionItem(
              'Contacts',
              'Allow HitMe to access your contacts to find friends already using the app',
              contactsPermission,
              <Users size={24} color={colors.primary} />,
              requestContactsPermission
            )}
            
            {renderPermissionItem(
              'Notifications',
              'Get notified when your friends are available to talk',
              notificationsPermission,
              <Bell size={24} color={colors.primary} />,
              requestNotificationsPermission
            )}
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary },
            isLoading && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleContinue}
        >
          <Text style={[styles.skipText, { color: colors.text.secondary }]}>
            Skip for now
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  permissionsContainer: {
    marginBottom: 32,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  permissionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  permissionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  permissionText: {
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
  permissionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  grantedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
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
  skipButton: {
    alignItems: 'center',
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
  },
});