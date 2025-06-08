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
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
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
  ExternalLink
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { EditProfileModal } from '@/components/EditProfileModal';
import { Card } from '@/components/common/Card';
import { NotificationSimulator } from '@/components/NotificationSimulator';
import { darkTheme } from '@/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { 
    user, 
    setUser, 
    outboundRequests, 
    contacts, 
    updateRequestStatus 
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
          <Image
            source={{ uri: user?.avatar }}
            style={styles.avatar}
            contentFit="cover"
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
          () => router.push('/live-activity-preview')
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
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
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