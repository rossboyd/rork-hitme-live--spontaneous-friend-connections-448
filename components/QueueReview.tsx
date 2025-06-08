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
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              {previewMode ? 'Preview Queue' : 'Review Queue'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {requests.map(request => {
              const contact = contacts.find(c => c.id === request.receiverId);
              if (!contact) return null;

              const isSelected = selectedIds.includes(request.id);

              return (
                <TouchableOpacity
                  key={request.id}
                  style={[
                    styles.requestItem,
                    { backgroundColor: colors.card }
                  ]}
                  onPress={() => handleToggleContact(request.id)}
                  disabled={previewMode}
                >
                  <Image
                    source={{ uri: contact.avatar }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                  <View style={styles.requestInfo}>
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
                      isSelected && { backgroundColor: colors.primary }
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
              <Text style={styles.goLiveText}>Go Live ({selectedIds.length})</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
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
  scrollView: {
    padding: 16,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  requestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  topic: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
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