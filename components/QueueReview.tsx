import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { X, Check } from 'lucide-react-native';
import { HitRequest, Contact } from '@/types';
import { useThemeStore } from '@/store/useThemeStore';
import * as Haptics from 'expo-haptics';

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
  const { colors } = useThemeStore();

  const handleToggleContact = (contactId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedIds((prev: string[]) => 
      prev.includes(contactId)
        ? prev.filter((id: string) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const getContactById = (contactId: string) => {
    return contacts.find(c => c.id === contactId) || {
      id: contactId,
      name: "Unknown Contact",
      avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      phone: "",
    };
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
              {previewMode ? "Queue Preview" : "Manage Your Queue"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            <Text style={[styles.description, { color: colors.text.secondary }]}>
              {previewMode 
                ? "These people are waiting to chat with you"
                : "Select who to notify when you go live"}
            </Text>

            {requests.map(request => {
              const contact = getContactById(request.senderId);
              const isSelected = selectedIds.includes(contact.id);

              return (
                <TouchableOpacity
                  key={request.id}
                  style={[
                    styles.contactItem,
                    { backgroundColor: colors.card },
                    !previewMode && isSelected && { borderColor: colors.primary }
                  ]}
                  onPress={() => !previewMode && handleToggleContact(contact.id)}
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
              onPress={() => onGoLive(selectedIds)}
            >
              <Text style={styles.goLiveText}>
                Go Live ({selectedIds.length} selected)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    paddingVertical: 16,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  scrollView: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
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
    marginLeft: 12,
  },
  goLiveButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  goLiveText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});