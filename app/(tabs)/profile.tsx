import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { 
  User, 
  Settings, 
  Moon, 
  Sun, 
  LogOut, 
  Bell, 
  Shield, 
  HelpCircle,
  Smartphone,
  Code
} from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { darkTheme, lightTheme } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { NotificationSimulator } from '@/components/NotificationSimulator';
import { useAppStore } from '@/hooks/useAppStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, colors = darkTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { outboundRequests, contacts, updateRequestStatus } = useAppStore();
  
  const [showDeveloperOptions, setShowDeveloperOptions] = useState(false);
  
  const handleEditProfile = () => {
    router.push('/profile');
  };
  
  const handleToggleTheme = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleTheme();
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            logout();
            router.replace('/(auth)');
          },
        },
      ]
    );
  };
  
  const handleSimulateConnection = (requestId: string) => {
    updateRequestStatus(requestId, 'completed');
  };
  
  // Toggle developer options after 7 taps on the version number
  const [versionTapCount, setVersionTapCount] = useState(0);
  const handleVersionTap = () => {
    const newCount = versionTapCount + 1;
    setVersionTapCount(newCount);
    
    if (newCount === 7) {
      setShowDeveloperOptions(true);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert('Developer Options Enabled', 'You now have access to developer features.');
      setVersionTapCount(0);
    }
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80' }}
          style={styles.profileImage}
          contentFit="cover"
        />
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.text.primary }]}>
            {user?.name || 'Your Name'}
          </Text>
          <Text style={[styles.profilePhone, { color: colors.text.secondary }]}>
            {user?.phone || '+1 (555) 123-4567'}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          onPress={handleEditProfile}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      
      {/* Settings Sections */}
      <View style={styles.settingsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Appearance
        </Text>
        
        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={handleToggleTheme}
        >
          {isDarkMode ? (
            <Moon size={22} color={colors.text.primary} style={styles.settingIcon} />
          ) : (
            <Sun size={22} color={colors.text.primary} style={styles.settingIcon} />
          )}
          <Text style={[styles.settingText, { color: colors.text.primary }]}>
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={handleToggleTheme}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={'#f4f3f4'}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.settingsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Notifications
        </Text>
        
        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={() => {}}
        >
          <Bell size={22} color={colors.text.primary} style={styles.settingIcon} />
          <Text style={[styles.settingText, { color: colors.text.primary }]}>
            Push Notifications
          </Text>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={'#f4f3f4'}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.settingsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Account
        </Text>
        
        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={() => {}}
        >
          <Shield size={22} color={colors.text.primary} style={styles.settingIcon} />
          <Text style={[styles.settingText, { color: colors.text.primary }]}>
            Privacy & Security
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={() => {}}
        >
          <HelpCircle size={22} color={colors.text.primary} style={styles.settingIcon} />
          <Text style={[styles.settingText, { color: colors.text.primary }]}>
            Help & Support
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={handleLogout}
        >
          <LogOut size={22} color="#FF3B30" style={styles.settingIcon} />
          <Text style={[styles.settingText, { color: '#FF3B30' }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Developer Options Section */}
      {showDeveloperOptions && (
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Developer Options
          </Text>
          
          {/* Notification Simulator */}
          <NotificationSimulator 
            outboundRequests={outboundRequests}
            contacts={contacts}
            onSimulateConnection={handleSimulateConnection}
          />
          
          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: colors.card }]}
            onPress={() => router.push('/live-activity-preview')}
          >
            <Smartphone size={22} color={colors.text.primary} style={styles.settingIcon} />
            <Text style={[styles.settingText, { color: colors.text.primary }]}>
              Live Activity Preview
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: colors.card }]}
            onPress={() => Alert.alert('Debug Info', 'App Version: 1.0.0\nBuild: 1\nDevice: ' + Platform.OS)}
          >
            <Code size={22} color={colors.text.primary} style={styles.settingIcon} />
            <Text style={[styles.settingText, { color: colors.text.primary }]}>
              Debug Information
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* App Version - Tap 7 times to enable developer options */}
      <TouchableOpacity onPress={handleVersionTap} style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: colors.text.light }]}>
          HitMe v1.0.0
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  profilePhone: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  settingsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 20,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingVertical: 10,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});