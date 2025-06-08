import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TextInput,
  TouchableOpacity,
  Text,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { ContactItem } from '@/components/ContactItem';
import { colors } from '@/constants/colors';
import { Search, X, Plus, User } from 'lucide-react-native';
import { Contact } from '@/types';
import * as Haptics from 'expo-haptics';
import { AddContactModal } from '@/components/AddContactModal';
import { EmptyState } from '@/components/EmptyState';
import { AddRequestModal } from '@/components/AddRequestModal';
import { useThemeStore } from '@/store/useThemeStore';

export default function ContactsManagementScreen() {
  const router = useRouter();
  const { 
    contacts, 
    addContact, 
    outboundRequests, 
    addOutboundRequest 
  } = useAppStore();
  const { colors } = useThemeStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [addRequestModalVisible, setAddRequestModalVisible] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts([...contacts]);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredContacts(
        contacts.filter(contact => 
          contact.name.toLowerCase().includes(query) ||
          contact.phone.includes(query)
        )
      );
    }
  }, [searchQuery, contacts]);

  const handleAddContact = () => {
    setAddModalVisible(true);
  };

  const handleContactPress = (contact: Contact) => {
    // Navigate to contact detail view
    router.push({
      pathname: '/contact-detail',
      params: { id: contact.id }
    });
  };

  const isContactInHitList = (contactId: string) => {
    return outboundRequests.some(req => 
      req.receiverId === contactId && req.status === 'pending'
    );
  };

  const handleToggleHitList = (contact: Contact) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Open the Add Request modal regardless of whether they're in the HitList or not
    setSelectedContact(contact);
    setAddRequestModalVisible(true);
  };

  const handleSubmitNewContact = (data: Omit<Contact, 'id'>) => {
    addContact({
      id: `contact-${Date.now()}`,
      ...data
    });
    setAddModalVisible(false);
  };

  const handleSubmitRequest = (data: {
    topic: string;
    urgency: 'low' | 'medium' | 'high';
    expiresIn: number | null;
  }) => {
    if (!selectedContact) return;
    
    addOutboundRequest({
      senderId: 'user-1', // Current user ID
      receiverId: selectedContact.id,
      topic: data.topic,
      urgency: data.urgency,
      expiresAt: data.expiresIn ? Date.now() + data.expiresIn : null,
    });
    
    setAddRequestModalVisible(false);
    setSelectedContact(null);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <ContactItem 
      contact={item}
      onPress={handleContactPress}
      showLastOnline
      isInHitList={isContactInHitList(item.id)}
      onToggleHitList={() => handleToggleHitList(item)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search size={20} color={colors.text.light} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search contacts"
          placeholderTextColor={colors.text.light}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={20} color={colors.text.light} />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No contacts found"
            message={searchQuery ? "Try a different search term" : "Add your first contact to get started"}
            icon={<User size={48} color={colors.text.light} />}
          />
        }
      />
      
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={handleAddContact}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
      
      <AddContactModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleSubmitNewContact}
      />
      
      <AddRequestModal
        visible={addRequestModalVisible}
        contact={selectedContact}
        onClose={() => {
          setAddRequestModalVisible(false);
          setSelectedContact(null);
        }}
        onSubmit={handleSubmitRequest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});