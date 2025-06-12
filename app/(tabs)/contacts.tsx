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
import { useRouter, Stack } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { ContactItem } from '@/components/ContactItem';
import { DraggableContactItem } from '@/components/DraggableContactItem';
import { EmptyState } from '@/components/EmptyState';
import { ToggleButton } from '@/components/common/ToggleButton';
import { Search, UserPlus, Filter } from 'lucide-react-native';
import { Contact, Mode, SortOrder } from '@/types';
import { AddContactModal } from '@/components/AddContactModal';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { useContactSearch } from '@/hooks/useContactSearch';

export default function ContactsScreen() {
  const router = useRouter();
  const { 
    contacts, 
    addContact, 
    outboundRequests, 
    contactSortOrder, 
    setContactSortOrder,
    reorderContactsInMode,
    initializeModeRankings
  } = useAppStore();
  const { colors = darkTheme } = useThemeStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modeFilter, setModeFilter] = useState<Mode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const filteredContacts = useContactSearch(contacts, searchQuery, modeFilter, contactSortOrder);
  
  useEffect(() => {
    // Initialize rankings when component mounts
    initializeModeRankings();
  }, []);
  
  const handleContactPress = (contact: Contact) => {
    if (!isDragging) {
      router.push(`/contact-detail?id=${contact.id}`);
    }
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

  const handleSortToggle = (isRanked: boolean) => {
    const newOrder: SortOrder = isRanked ? 'ranked' : 'alphabetical';
    setContactSortOrder(newOrder);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (contactId: string, newIndex: number) => {
    setIsDragging(false);
    
    if (modeFilter && contactSortOrder === 'ranked') {
      try {
        // Get current filtered contacts in their current order
        const currentContactIds = filteredContacts.map(c => c.id);
        
        // Find the current index of the dragged contact
        const currentIndex = currentContactIds.indexOf(contactId);
        if (currentIndex === -1) return;
        
        // Remove the contact from its current position
        const reorderedIds = [...currentContactIds];
        reorderedIds.splice(currentIndex, 1);
        
        // Insert at new position (clamp to valid range)
        const clampedIndex = Math.max(0, Math.min(newIndex, reorderedIds.length));
        reorderedIds.splice(clampedIndex, 0, contactId);
        
        // Update rankings in the store
        reorderContactsInMode(modeFilter, reorderedIds);
      } catch (error) {
        console.warn('Error reordering contacts:', error);
      }
    }
  };
  
  // Only enable drag and drop on native platforms when in ranked mode with a mode filter
  const canDragAndDrop = modeFilter && contactSortOrder === 'ranked' && Platform.OS !== 'web';
  const showGrabHandle = modeFilter && contactSortOrder === 'ranked';
  
  const renderItem = ({ item, index }: { item: Contact; index: number }) => {
    // Use DraggableContactItem only when drag and drop is enabled and available
    if (canDragAndDrop) {
      return (
        <DraggableContactItem
          contact={item}
          onPress={handleContactPress}
          showLastOnline={true}
          isInHitList={isInHitList(item.id)}
          onToggleHitList={handleToggleHitList}
          showModes={true}
          isDraggable={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          dragIndex={index}
          itemHeight={96}
          showGrabHandle={showGrabHandle}
        />
      );
    }
    
    // Use regular ContactItem for all other cases
    return (
      <ContactItem
        contact={item}
        onPress={handleContactPress}
        showLastOnline={true}
        isInHitList={isInHitList(item.id)}
        onToggleHitList={handleToggleHitList}
        showModes={true}
        showGrabHandle={showGrabHandle}
      />
    );
  };
  
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
          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: colors.text.secondary }]}>Sort:</Text>
            <ToggleButton
              leftLabel="A-Z"
              rightLabel="Ranked"
              isRightSelected={contactSortOrder === 'ranked'}
              onToggle={handleSortToggle}
              style={styles.sortToggle}
            />
          </View>
          
          <View style={styles.modeFilters}>
            {(['FAM', 'VIP', 'BFF', 'WRK', 'MEH'] as Mode[]).map((mode) => (
              <TouchableOpacity 
                key={mode}
                style={[
                  styles.modeFilter, 
                  { 
                    backgroundColor: modeFilter === mode ? colors.primary : colors.card,
                    borderColor: modeFilter === mode ? colors.primary : colors.border
                  }
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
          
          {showGrabHandle && (
            <Text style={[styles.dragHint, { color: colors.text.light }]}>
              {Platform.OS === 'web' 
                ? `Viewing ${getModeLabel(modeFilter!)} in ranked order`
                : `Drag contacts to reorder your ${getModeLabel(modeFilter!)} list`
              }
            </Text>
          )}
        </View>
        
        <FlatList
          data={filteredContacts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={!isDragging}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title="No contacts found"
              message={searchQuery 
                ? "Try a different search term" 
                : modeFilter
                  ? `No contacts in ${getModeLabel(modeFilter)} trait`
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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortToggle: {
    // ToggleButton will handle its own styling
  },
  modeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  modeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  modeFilterText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  dragHint: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  listContent: {
    paddingVertical: 8,
  },
});