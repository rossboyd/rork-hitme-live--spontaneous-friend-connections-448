import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Users, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

export default function ContactsPermissionScreen() {
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();
  
  const handleAllowContacts = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // In a real app, this would request contacts permissions
    // For now, we'll just navigate to the next step
    router.replace('/onboarding/notifications');
  };
  
  const handleSkip = () => {
    // Skip to notifications screen
    router.replace('/onboarding/notifications');
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Find your friends
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Connect with friends who are already using HitMe
        </Text>
      </View>
      
      <View style={styles.illustrationContainer}>
        <View style={[styles.contactsCard, { backgroundColor: colors.card }]}>
          <View style={styles.contactsList}>
            {[1, 2, 3].map((index) => (
              <View 
                key={index} 
                style={[styles.contactItem, { borderBottomColor: colors.border }]}
              >
                <View style={[styles.contactAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.contactInitial}>
                    {String.fromCharCode(64 + index)}
                  </Text>
                </View>
                <View style={styles.contactInfo}>
                  <View style={[styles.contactNamePlaceholder, { backgroundColor: colors.border }]} />
                  <View style={[styles.contactPhonePlaceholder, { backgroundColor: colors.border }]} />
                </View>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.iconContainer}>
          <Users size={64} color={colors.primary} />
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.allowButton, { backgroundColor: colors.primary }]}
          onPress={handleAllowContacts}
        >
          <Text style={styles.allowButtonText}>Allow Contacts Access</Text>
          <ChevronRight size={20} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.skipButton, { borderColor: colors.border }]}
          onPress={handleSkip}
        >
          <Text style={[styles.skipButtonText, { color: colors.text.secondary }]}>
            Skip for now
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.privacyText, { color: colors.text.light }]}>
        We only use your contacts to help you connect with friends who are already using HitMe. Your contacts will never be shared without your permission.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    marginBottom: 40,
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
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  contactsCard: {
    padding: 16,
    borderRadius: 16,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactsList: {
    width: '100%',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  contactInfo: {
    flex: 1,
  },
  contactNamePlaceholder: {
    height: 14,
    width: '70%',
    borderRadius: 7,
    marginBottom: 6,
  },
  contactPhonePlaceholder: {
    height: 12,
    width: '50%',
    borderRadius: 6,
  },
  iconContainer: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: colors.background,
    borderRadius: 32,
    padding: 8,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  allowButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  allowButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  skipButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  privacyText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
  },
});