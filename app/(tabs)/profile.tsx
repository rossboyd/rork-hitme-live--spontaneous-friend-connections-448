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
import { Card } from '@/components/common/Card';
import { NotificationSimulator } from '@/components/NotificationSimulator';
import { 
  Bell, 
  Lock, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Camera,
  Edit,
  Smartphone
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { EditProfileModal } from '@/components/EditProfileModal';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser, outboundRequests, contacts, updateRequestStatus } = useAppStore();
  const { colors } = useThemeStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editProfileVisible, setEditProfileVisible] = useState(false);

  // Rest of the component code...
};