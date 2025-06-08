import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch,
  Alert,
  ScrollView as RNScrollView,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
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
  BellRing
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { EditProfileModal } from '@/components/EditProfileModal';
import { useThemeStore } from '@/store/useThemeStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useAppStore();
  const { colors } = useThemeStore();
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
            // In a real app, this would clear auth tokens, etc.
            Alert.alert("Logged Out", "You have been logged out successfully");
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

  const renderSettingItem = (
    icon: React.ReactNode,
    label: string,
    onPress?: () => void,
    rightElement?: React.ReactNode,
    textColor = colors.text.primary
  ) => (
    <TouchableOpacity 
      style={styles.settingItem}
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
    <RNScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user?.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          <TouchableOpacity 
            style={[styles.cameraButton, { backgroundColor: colors.primary }]}
            onPress={() => setEditProfileVisible(true)}
          >
            <Camera size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.editNameButton, { backgroundColor: colors.border }]}
          onPress={() => setEditProfileVisible(true)}
        >
          <Edit size={18} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
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
        
        {renderSettingItem(
          <LogOut size={24} color={colors.accent} />,
          "Log Out",
          handleLogout,
          <ChevronRight size={20} color={colors.accent} />,
          colors.accent
        )}
      </View>

      <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Developer</Text>
        {renderSettingItem(
          <Smartphone size={24} color={colors.text.primary} />,
          "Live Activity Preview",
          () => router.push('/live-activity-preview')
        )}
        {renderSettingItem(
          <BellRing size={24} color={colors.text.primary} />,
          "Test Push Notification",
          () => router.push('/notification-test')
        )}
      </View>
      
      <Text style={[styles.versionText, { color: colors.text.light }]}>HitMe v1.0.0</Text>
      
      <EditProfileModal
        visible={editProfileVisible}
        user={user}
        onClose={() => setEditProfileVisible(false)}
        onUpdate={handleUpdateProfile}
      />
    </RNScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
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
  editNameButton: {
    padding: 8,
    borderRadius: 20,
  },
  settingsCard: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    borderBottomColor: '#E2E8F0',
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
    fontSize: 14,
  },
});