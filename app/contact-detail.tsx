import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Platform,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Image } from 'expo-image';
import { Edit2, Trash2, Phone, MessageSquare, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { EditContactModal } from '@/components/EditContactModal';
import { AddRequestModal } from '@/components/AddRequestModal';
import { useThemeStore } from '@/store/useThemeStore';

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    contacts, 
    deleteContact, 
    updateContact,
    outboundRequests,
    addOutboundRequest
  } = useAppStore();
  const { colors } = useThemeStore();
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addRequestModalVisible, setAddRequestModalVisible] = useState(false);
  
  const contact = contacts.find(c => c.id === id);
  
  if (!contact) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.text.primary }]}>Contact not found</Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const handleDelete = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      "Delete Contact",
      `Are you sure you want to delete ${contact.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteContact(contact.id);
            router.back();
          }
        }
      ]
    );
  };
  
  const handleUpdateContact = (contactId: string, data: Partial<Contact>) => {
    updateContact(contactId, data);
    setEditModalVisible(false);
  };
  
  const handleAddToHitList = () => {
    setAddRequestModalVisible(true);
  };
  
  const handleSubmitRequest = (data: {
    topic: string;
    urgency: 'low' | 'medium' | 'high';
    expiresIn: number | null;
  }) => {
    addOutboundRequest({
      senderId: 'user-1', // Current user ID
      receiverId: contact.id,
      topic: data.topic,
      urgency: data.urgency,
      expiresAt: data.expiresIn ? Date.now() + data.expiresIn : null,
    });
    
    setAddRequestModalVisible(false);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    Alert.alert(
      "Added to HitList",
      `${contact.name} has been added to your HitList`,
      [{ text: "OK" }]
    );
  };
  
  const isInHitList = outboundRequests.some(req => 
    req.receiverId === contact.id && req.status === 'pending'
  );
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: contact.name,
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setEditModalVisible(true)}
              style={styles.headerButton}
            >
              <Edit2 size={20} color={colors.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Image
            source={{ uri: contact.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          
          <Text style={[styles.name, { color: colors.text.primary }]}>{contact.name}</Text>
          <Text style={[styles.phone, { color: colors.text.secondary }]}>{contact.phone}</Text>
          
          {contact.lastSeen && (
            <Text style={[styles.lastSeen, { color: colors.text.light }]}>
              Last seen {formatDistanceToNow(contact.lastSeen)}
            </Text>
          )}
          
          {contact.lastOnline && (
            <Text style={[styles.lastOnline, { color: colors.text.light }]}>
              Last online {formatDistanceToNow(contact.lastOnline)}
            </Text>
          )}
        </View>
        
        <View style={[styles.actions, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.actionButton}>
            <Phone size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text.primary }]}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MessageSquare size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text.primary }]}>Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              isInHitList && [styles.activeActionButton, { backgroundColor: colors.primary }]
            ]}
            onPress={handleAddToHitList}
          >
            <Plus size={24} color={isInHitList ? "#fff" : colors.primary} />
            <Text style={[
              styles.actionText, 
              { color: colors.text.primary },
              isInHitList && styles.activeActionText
            ]}>
              {isInHitList ? "In HitList" : "Add to HitList"}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.dangerZone, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
          <Text style={[styles.dangerTitle, { color: colors.accent }]}>Danger Zone</Text>
          <TouchableOpacity 
            style={[styles.deleteButton, { backgroundColor: '#FEE2E2' }]}
            onPress={handleDelete}
          >
            <Trash2 size={20} color={colors.accent} />
            <Text style={[styles.deleteText, { color: colors.accent }]}>Delete Contact</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <EditContactModal
        visible={editModalVisible}
        contact={contact}
        onClose={() => setEditModalVisible(false)}
        onUpdate={handleUpdateContact}
      />
      
      <AddRequestModal
        visible={addRequestModalVisible}
        contact={contact}
        onClose={() => setAddRequestModalVisible(false)}
        onSubmit={handleSubmitRequest}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  headerButton: {
    padding: 8,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    marginBottom: 8,
  },
  lastSeen: {
    fontSize: 14,
    marginBottom: 4,
  },
  lastOnline: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginTop: 16,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  activeActionButton: {
    borderRadius: 8,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
  },
  activeActionText: {
    color: '#fff',
  },
  dangerZone: {
    margin: 16,
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  deleteText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});