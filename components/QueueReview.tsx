import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { HitRequest, Contact } from '@/types';
import { X, Check } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';

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

  const getContactById = (id: string) => {
    return contacts.find(c => c.id === id) || {
      id,
      name: "Unknown Contact",
      avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      phone: "",
    };
  };

  const toggleContact = (contactId: string) => {
    setSelectedIds(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
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
                ? "These people are waiting to talk to you"
                : "Select who to notify when you go live"}
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
                    isSelected && styles.selectedItem
                  ]}
                  onPress={() => !previewMode && toggleContact(request.senderId)}
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
                      isSelected && { backgroundColor: '#00FF00', borderColor: '#00FF00' }
                    ]}>
                      {isSelected && <Check size={16} color="#fff" />}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {!previewMode && onGoLive && (
            <TouchableOpacity
              style={[styles.goLiveButton, { backgroundColor: '#00FF00' }]}
              onPress={() => onGoLive(selectedIds)}
            >
              <Text style={styles.goLiveText}>Go Live ({selectedIds.length})</Text>
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
    fontFamily: 'PlusJakartaSans-SemiBold',
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
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedItem: {
    borderColor: '#00FF00',
    borderWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  requestTopic: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginLeft: 12,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});