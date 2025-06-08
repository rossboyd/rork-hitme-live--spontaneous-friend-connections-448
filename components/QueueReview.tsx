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

  const getContactById = (contactId: string) => {
    return contacts.find(c => c.id === contactId) || {
      id: contactId,
      name: "Unknown Contact",
      avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      phone: "",
    };
  };

  const toggleContact = (contactId: string) => {
    if (selectedIds.includes(contactId)) {
      setSelectedIds(selectedIds.filter(id => id !== contactId));
    } else {
      setSelectedIds([...selectedIds, contactId]);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {previewMode ? "Queue Preview" : "Manage Your Queue"}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            {previewMode
              ? `${requests.length} people waiting to talk`
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
                  isSelected && { borderColor: colors.primary, borderWidth: 2 }
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
                  <Text style={[styles.topic, { color: colors.text.secondary }]}>
                    {request.topic}
                  </Text>
                </View>
                {!previewMode && (
                  <View style={[
                    styles.checkbox,
                    { borderColor: colors.border },
                    isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }
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
            style={[styles.goLiveButton, { backgroundColor: colors.primary }]}
            onPress={() => onGoLive(selectedIds)}
          >
            <Text style={styles.goLiveText}>Go Live ({selectedIds.length})</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
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
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
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
  topic: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});