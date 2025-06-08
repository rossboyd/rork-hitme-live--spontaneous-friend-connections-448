import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Platform,
  Linking
} from 'react-native';
import { Bell, ExternalLink } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { HitRequest, Contact } from '@/types';
import { useThemeStore } from '@/store/useThemeStore';
import { openWhatsApp } from '@/utils/whatsapp';

// Only import Notifications on native platforms
let Notifications: any = null;
if (Platform.OS !== 'web') {
  import('expo-notifications').then(module => {
    Notifications = module;
    
    // Configure notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  });
}

interface NotificationSimulatorProps {
  outboundRequests: HitRequest[];
  contacts: Contact[];
  onSimulateConnection: (requestId: string) => void;
}

export const NotificationSimulator = ({ 
  outboundRequests, 
  contacts,
  onSimulateConnection 
}: NotificationSimulatorProps) => {
  const { colors } = useThemeStore();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  // Set up notification listeners
  useEffect(() => {
    if (Platform.OS !== 'web' && Notifications) {
      const requestPermissions = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Push notifications need permission to work properly',
            [{ text: 'OK' }]
          );
        }
      };
      
      requestPermissions();

      notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
        console.log('Notification received in foreground:', notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
        console.log('Notification response received:', response);
        
        const requestId = response.notification.request.content.data?.requestId;
        const contactId = response.notification.request.content.data?.contactId;
        
        if (requestId && contactId) {
          const contact = contacts.find(c => c.id === contactId);
          if (contact) {
            handleConnectFromNotification(requestId, contact);
          }
        }
      });

      return () => {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(notificationListener.current);
        }
        if (responseListener.current) {
          Notifications.removeNotificationSubscription(responseListener.current);
        }
      };
    }
  }, [contacts]);

  const handleConnectFromNotification = async (requestId: string, contact: Contact) => {
    try {
      const success = await openWhatsApp(contact.phone);
      if (success) {
        onSimulateConnection(requestId);
      } else {
        Alert.alert(
          "Connection Error",
          "There was an error connecting to WhatsApp. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error connecting:", error);
      Alert.alert(
        "Connection Error",
        "There was an error connecting. Please try again later."
      );
    }
  };

  // Filter for active outbound requests
  const activeRequests = outboundRequests.filter(req => req.status === 'pending');
  
  if (activeRequests.length === 0) {
    return null;
  }

  // Get a random request to simulate
  const randomIndex = Math.floor(Math.random() * activeRequests.length);
  const requestToSimulate = activeRequests[randomIndex];
  
  // Find the contact for this request
  const contact = contacts.find(c => c.id === requestToSimulate.receiverId);
  
  if (!contact) return null;

  const scheduleNotification = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      try {
        if (Notifications) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'HitMe Notification',
              body: `${contact.name} is now online! Connect with them now.`,
              data: { 
                requestId: requestToSimulate.id,
                contactId: contact.id
              },
            },
            trigger: { 
              seconds: 1,
            },
          });
          
          Alert.alert(
            'Notification Sent',
            'Check your notifications to see the test notification',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error scheduling notification:', error);
        Alert.alert(
          'Notification Error',
          'There was an error sending the notification. Please check permissions.'
        );
      }
    } else {
      // Web fallback
      Alert.alert(
        'Notification Simulation (Web)',
        `${contact.name} is now online! Connect with them now.`,
        [
          { 
            text: 'Connect', 
            onPress: () => handleConnectFromNotification(requestToSimulate.id, contact)
          },
          { text: 'Dismiss' }
        ]
      );
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={scheduleNotification}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
        <Bell size={20} color="#000" />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Test Notification</Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          {Platform.OS === 'web' 
            ? 'Simulate a notification that someone on your HitList is online' 
            : 'Send a real push notification that someone on your HitList is online'}
        </Text>
      </View>
      <ExternalLink size={20} color={colors.text.light} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
  },
});