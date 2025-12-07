import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch,
  Alert,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { useThemeStore } from '@/store/useThemeStore';
import { 
  Bell, 
  Lock, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Camera,
  Edit,
  Smartphone,
  RotateCcw
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { EditProfileModal } from '@/components/EditProfileModal';
import { Card } from '@/components/common/Card';
import { NotificationSimulator } from '@/components/NotificationSimulator';
import { darkTheme } from '@/constants/colors';
import { Avatar } from '@/components/common/Avatar';

export default function ProfileScreen() {
  const router = useRouter();
  const { 
    user, 
    setUser, 
    outboundRequests, 
    contacts, 
    updateRequestStatus,
    resetToMockData,
    resetOnboarding
  } = useAppStore();
  const { colors = darkTheme } = useThemeStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editProfileVisible, setEditProfileVisible] = useState(false);

  const handleNotificationsToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleLogout = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            // Reset onboarding state
            resetOnboarding();
            // Navigate to the sign-in screen
            router.replace('/');
          }
        }
      ]
    );
  };

  const handleResetData = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      "Reset App Data",
      "This will reset all app data to the original prototype state. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetToMockData();
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            Alert.alert(
              "Data Reset",
              "App data has been reset to prototype state successfully."
            );
          }
        }
      ]
    );
  };

  const handleUpdateProfile = (data: Partial<typeof user>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
    setEditProfileVisible(false);
  };

  const handleSimulateConnection = (requestId: string) => {
    // Mark the request as completed
    updateRequestStatus(requestId, 'completed');
    
    // Show success message
    setTimeout(() => {
      Alert.alert(
        "Connection Successful",
        "The request has been marked as completed and removed from your HitList."
      );
    }, 1000);
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    label: string,
    onPress?: () => void,
    rightElement?: React.ReactNode,
    textColor = colors.text.primary
  ) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIconContainer}>
        {icon}
      </View>
      <Text style={[styles.settingLabel, { color: textColor }]}>{label}</Text>
      {rightElement || (onPress && <ChevronRight size={20} color={colors.text.light} />)}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Avatar
            name={user?.name || "User"}
            avatar={user?.avatar}
            size={120}
          />
          <TouchableOpacity 
            style={[styles.cameraButton, { backgroundColor: colors.primary }]}
            onPress={() => setEditProfileVisible(true)}
          >
            <Camera size={20} color="#000" />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.userName, { color: colors.text.primary }]}>
          {user?.name || "User"}
        </Text>
        
        <TouchableOpacity 
          style={[styles.editNameButton, { backgroundColor: colors.border }]}
          onPress={() => setEditProfileVisible(true)}
        >
          <Edit size={18} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
      
      <Card style={styles.settingsCard}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Settings</Text>
        
        {renderSettingItem(
          <Bell size={24} color={colors.text.primary} />,
          "Notifications",
          undefined,
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        )}
        
        {renderSettingItem(
          <Lock size={24} color={colors.text.primary} />,
          "Privacy",
          () => Alert.alert("Privacy", "Privacy settings would open here")
        )}
        
        {renderSettingItem(
          <Shield size={24} color={colors.text.primary} />,
          "Security",
          () => Alert.alert("Security", "Security settings would open here")
        )}
        
        {renderSettingItem(
          <HelpCircle size={24} color={colors.text.primary} />,
          "Help",
          () => Alert.alert("Help", "Help center would open here")
        )}
      </Card>

      <Card style={styles.settingsCard}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Developer</Text>
        {renderSettingItem(
          <Smartphone size={24} color={colors.text.primary} />,
          "Live Activity Preview",
          () => router.push('/live-activity-preview' as Href)
        )}
        
        {renderSettingItem(
          <RotateCcw size={24} color={colors.text.primary} />,
          "Reset App Data",
          handleResetData
        )}
        
        {renderSettingItem(
          <RotateCcw size={24} color={colors.text.primary} />,
          "Reset Onboarding",
          () => {
            resetOnboarding();
            Alert.alert(
              "Onboarding Reset",
              "You'll see the onboarding flow next time you restart the app."
            );
          }
        )}
        
        {/* Added notification simulator to developer section */}
        {outboundRequests.filter(req => req.status === 'pending').length > 0 && (
          <NotificationSimulator 
            outboundRequests={outboundRequests}
            contacts={contacts}
            onSimulateConnection={handleSimulateConnection}
          />
        )}
      </Card>
      
      <Card style={styles.settingsCard}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Danger Zone</Text>
        {renderSettingItem(
          <LogOut size={24} color={colors.accent} />,
          "Log Out",
          handleLogout,
          <ChevronRight size={20} color={colors.accent} />,
          colors.accent
        )}
      </Card>
      
      <Text style={[styles.versionText, { color: colors.text.light }]}>HitMe v1.0.0</Text>
      
      <EditProfileModal
        visible={editProfileVisible}
        user={user}
        onClose={() => setEditProfileVisible(false)}
        onUpdate={handleUpdateProfile}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
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
  editNameButton: {
    padding: 8,
    borderRadius: 20,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
    fontSize: 14,
  },
});