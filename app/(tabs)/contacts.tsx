import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  Text
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { ContactItem } from '@/components/ContactItem';
import { EmptyState } from '@/components/EmptyState';
import { Search, UserPlus, Filter } from 'lucide-react-native';
import { Contact, Mode } from '@/types';
import { AddContactModal } from '@/components/AddContactModal';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

export default function ContactsScreen() {
  const router = useRouter();
  const { contacts, addContact, outboundRequests } = useAppStore();
  const { colors = darkTheme } = useThemeStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modeFilter, setModeFilter] = useState<Mode | null>(null);
  
  useEffect(() => {
    let result = [...contacts];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        contact => 
          contact.name.toLowerCase().includes(query) || 
          contact.phone.includes(query)
      );
    }
    
    // Apply mode filter
    if (modeFilter) {
      result = result.filter(
        contact => contact.modes?.includes(modeFilter)
      );
    }
    
    // Sort alphabetically
    result.sort((a, b) => a.name.localeCompare(b.name));
    
    setFilteredContacts(result);
  }, [contacts, searchQuery, modeFilter]);
  
  const handleContactPress = (contact: Contact) => {
    router.push(`/contact-detail?id=${contact.id}`);
  };
  
  const handleAddContact = (data: { name: string; phone: string; avatar: string }) => {
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      ...data
    };
    
    addContact(newContact);
    setShowAddModal(false);
  };
  
  const isInHitList = (contactId: string) => {
    return outboundRequests.some(
      req => req.receiverId === contactId && req.status === 'pending'
    );
  };
  
  const handleToggleHitList = (contact: Contact) => {
    router.push(`/contact-detail?id=${contact.id}`);
  };
  
  const getModeLabel = (mode: Mode) => {
    switch (mode) {
      case 'FAM':
        return 'Family';
      case 'VIP':
        return 'VIP';
      case 'BFF':
        return 'BFF';
      case 'WRK':
        return 'Work';
      case 'MEH':
        return 'Meh';
      default:
        return mode;
    }
  };
  
  const toggleModeFilter = (mode: Mode) => {
    setModeFilter(currentMode => currentMode === mode ? null : mode);
  };
  
  const renderItem = ({ item }: { item: Contact }) => (
    <ContactItem
      contact={item}
      onPress={handleContactPress}
      showLastOnline={true}
      isInHitList={isInHitList(item.id)}
      onToggleHitList={handleToggleHitList}
      showModes={true}
    />
  );
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Contacts',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setShowAddModal(true)}
              style={styles.headerButton}
            >
              <UserPlus size={24} color={colors.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="Search contacts..."
            placeholderTextColor={colors.text.light}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filterContainer}>
          <Text style={[styles.filterLabel, { color: colors.text.secondary }]}>Filter by mode:</Text>
          <View style={styles.modeFilters}>
            {(['FAM', 'VIP', 'BFF', 'WRK', 'MEH'] as Mode[]).map((mode) => (
              <TouchableOpacity 
                key={mode}
                style={[
                  styles.modeFilter, 
                  { backgroundColor: modeFilter === mode ? colors.primary : colors.card }
                ]}
                onPress={() => toggleModeFilter(mode)}
              >
                <Filter size={14} color={modeFilter === mode ? '#000' : colors.text.primary} />
                <Text style={[
                  styles.modeFilterText, 
                  { color: modeFilter === mode ? '#000' : colors.text.primary }
                ]}>
                  {getModeLabel(mode)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <FlatList
          data={filteredContacts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              title="No contacts found"
              message={searchQuery 
                ? "Try a different search term" 
                : modeFilter
                  ? `No contacts in ${getModeLabel(modeFilter)} mode`
                  : "Add your first contact to get started"}
              icon={<UserPlus size={48} color={colors.text.light} />}
            />
          }
        />
      </View>
      
      <AddContactModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddContact}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  modeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  modeFilterText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  listContent: {
    paddingVertical: 8,
  },
});