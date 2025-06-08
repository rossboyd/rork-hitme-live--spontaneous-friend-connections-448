import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  ScrollView,
  Platform,
  useWindowDimensions
} from 'react-native';
import { Image } from 'expo-image';
import { X, Check } from 'lucide-react-native';
import { HitRequest, Contact } from '@/types';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

interface QueueReviewProps {
  visible: boolean;
  requests: HitRequest[];
  contacts: Contact[];
  onClose: () => void;
  onGoLive?: (selectedIds: string[]) => void;
  previewMode?: boolean;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export const QueueReview = ({
  visible,
  requests,
  contacts,
  onClose,
  onGoLive,
  previewMode = false,
  selectedIds,
  setSelectedIds,
}: QueueReviewProps) => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const { colors = darkTheme } = useThemeStore();
  
  const MODAL_HEIGHT = SCREEN_HEIGHT * 0.6; // 60% of screen height

  // Rest of the component code...
};