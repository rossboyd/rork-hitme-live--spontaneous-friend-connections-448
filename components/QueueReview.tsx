import React, { useState } from 'react';
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

  const getContactById = (contactId: string) => {
    return contacts.find(c => c.id === contactId) || {
      id: contactId,
      name: "Unknown Contact",
      avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      phone: "",
    };
  };

  const handleToggleContact = (contactId: string) => {
    setSelectedIds(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleGoLive = () => {
    if (onGoLive) {
      onGoLive(selectedIds);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View 
          style={[
            styles.container, 
            { 
              backgroundColor: colors.background,
              height: MODAL_HEIGHT
            }
          ]}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text.primary }]}>Queue Preview</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={[styles.subtitle, { color: colors.text.primary }]}>
              {requests.length} {requests.length === 1 ? 'person' : 'people'} waiting to talk
            </Text>

            {requests.map(request => {
              const contact = getContactById(request.senderId);
              const isSelected = selectedIds.includes(request.senderId);

              return (
                <TouchableOpacity
                  key={request.id}
                  style={[
                    styles.contactItem,
                    { backgroundColor: colors.card },
                    isSelected && { borderColor: colors.primary, borderWidth: 2 }
                  ]}
                  onPress={() => handleToggleContact(request.senderId)}
                  disabled={previewMode}
                >
                  <Image
                    source={{ uri: contact.avatar }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                  <View style={styles.contactInfo}>
                    <Text style={[styles.contactName, { color: colors.text.primary }]}>
                      {contact.name}
                    </Text>
                    <Text style={[styles.requestTopic, { color: colors.text.secondary }]}>
                      {request.topic}
                    </Text>
                  </View>
                  {!previewMode && (
                    <View style={[
                      styles.checkbox,
                      isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}>
                      {isSelected && <Check size={16} color="#000" />}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {!previewMode && onGoLive && (
            <TouchableOpacity
              style={[styles.goLiveButton, { backgroundColor: colors.primary }]}
              onPress={handleGoLive}
            >
              <Text style={styles.goLiveText}>Go Live ({selectedIds.length} selected)</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    paddingVertical: 16,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  requestTopic: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goLiveButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  goLiveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});