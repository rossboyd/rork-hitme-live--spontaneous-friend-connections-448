import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { ContactItem } from '@/components/ContactItem';
import { AddRequestModal } from '@/components/AddRequestModal';
import { Search, X } from 'lucide-react-native';
import { Contact } from '@/types';
import { useThemeStore } from '@/store/useThemeStore';

export default function ContactsScreen() {
  const router = useRouter();
  const { contacts, addOutboundRequest } = useAppStore();
  const { colors } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts([...contacts]);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredContacts(
        contacts.filter(contact => 
          contact.name.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, contacts]);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedContact(null);
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
    
    setModalVisible(false);
    router.back();
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <ContactItem 
      contact={item}
      onPress={handleSelectContact}
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
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>No contacts found</Text>
          </View>
        }
      />
      
      <AddRequestModal
        visible={modalVisible}
        contact={selectedContact}
        onClose={handleCloseModal}
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
  },
});